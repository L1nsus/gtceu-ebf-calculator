import { VoltageTier } from "./VoltageTiers";

export class EBFData {
  hatchCount: number;
  hatchTier: VoltageTier;

  constructor(params: { simpleTier: VoltageTier });
  constructor(params: { hatchCount: number; hatchTier: VoltageTier });
  constructor(
    params:
      | {
          simpleTier: VoltageTier;
        }
      | {
          hatchCount: number;
          hatchTier: VoltageTier;
        }
  ) {
    if ("simpleTier" in params) {
      this.hatchCount = 1;
      this.hatchTier = params.simpleTier;
    } else {
      this.hatchCount = params.hatchCount;
      this.hatchTier = params.hatchTier;
    }
  }

  get effectiveVoltage(): VoltageTier {
    return VoltageTier.getTierFromEUtWithOCFloor(
      this.hatchTier.eut * 2 * this.hatchCount
    );
  }
}
