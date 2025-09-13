import type { CoilType } from "./Coils";
import { EBFData } from "./EBFData";
import type { Recipe } from "./Recipe";
import { VoltageTier } from "./VoltageTiers";

export const COIL_DISCOUNT_TEMP = 900;

export enum CellResultTypes {
  TOO_COLD,
  TOO_LOW_ENERGY,
  OK,
}

export interface CellResultValues {
  coilBonus: number;
  ocLevel: number;
  perfectOCs: number;
  duration: number;
  durationCut: number;
  parallels: number;
  eut: number;
}

export type CellResult =
  | { type: CellResultTypes.OK; values: CellResultValues }
  | {
      type: CellResultTypes.TOO_COLD | CellResultTypes.TOO_LOW_ENERGY;
    };

export function calculate(
  recipe: Recipe,
  ebf: EBFData,
  coil: CoilType
): CellResult {
  recipe = recipe.copy();
  // Calculate effective temperature with voltage tier bonus
  const effectiveTemp =
    coil.coilTemperature +
    100 *
      Math.max(
        0,
        ebf.effectiveVoltage.numericTier - VoltageTier.MV.numericTier
      );

  if (recipe.temperature > effectiveTemp)
    return { type: CellResultTypes.TOO_COLD };

  if (VoltageTier.getTierFromEUt(recipe.eut).eut > ebf.effectiveVoltage.eut)
    return { type: CellResultTypes.TOO_LOW_ENERGY };

  // Calculate energy multiplier from coils
  let coilEUtMultiplier = 1;
  if (recipe.temperature >= COIL_DISCOUNT_TEMP) {
    const temperatureDiffFactor = Math.max(
      0,
      Math.floor((effectiveTemp - recipe.temperature) / COIL_DISCOUNT_TEMP)
    );
    if (temperatureDiffFactor >= 1)
      coilEUtMultiplier = Math.min(1, 0.95 ** temperatureDiffFactor);
  }
  recipe.eut *= coilEUtMultiplier;

  // Calculate overclocks
  let durationCut = 1;
  let ocLevel = 0;
  let perfectOCCount = 0;
  let maxTheoreticalParallels: number;
  let actualParallels = 1;
  let actualEUt = recipe.eut;

  let ocs = ebf.effectiveVoltage.numericTier - recipe.tier.numericTier;
  if (recipe.tier === VoltageTier.ULV) ocs--;
  if (ocs !== 0) {
    // Check how much we can overclock at most
    const lg4 = Math.floor(Math.floor(Math.log2(recipe.duration)) / 2);
    if (lg4 > ocs) maxTheoreticalParallels = 16;
    else {
      const pLim = 4 ** (ocs - lg4) + 1;
      // if (pLim <= 1) maxTheoreticalParallels = pLim;
      // * Assume we are not limited by inputs/output capacity for parallelization
      // * Therefore we can skip all related checks and just set the value to its max
      maxTheoreticalParallels = pLim;
    }

    // Calculate actually applicable overclocks
    let perfectOCs = Math.max(
      0,
      Math.floor(
        (effectiveTemp - recipe.temperature) / (2 * COIL_DISCOUNT_TEMP)
      )
    );

    let shouldParallel = false;

    while (ocs-- > 0) {
      const isPerfect = perfectOCs-- > 0;
      const nextEUt = actualEUt * 4;

      if (nextEUt > ebf.effectiveVoltage.eut) break;

      const durationMult = isPerfect ? 0.25 : 0.5;
      if (shouldParallel || recipe.duration * durationMult < 1) {
        const nextParallels = actualParallels * (isPerfect ? 4 : 2);
        if (nextParallels > maxTheoreticalParallels) break;
        actualParallels = nextParallels;
        shouldParallel = true;
      } else {
        recipe.duration *= durationMult;
        durationCut /= durationMult;
      }
      actualEUt = nextEUt;
      ocLevel++;
      if (isPerfect) perfectOCCount++;
    }
  }

  return {
    type: CellResultTypes.OK,
    values: {
      coilBonus: coilEUtMultiplier,
      duration: Math.ceil(recipe.duration),
      durationCut,
      ocLevel,
      perfectOCs: perfectOCCount,
      parallels: actualParallels,
      eut: actualEUt,
    },
  };
}
