import { VoltageTier } from "./VoltageTiers";

export interface IRecipe {
  temperature: number;
  eut: number;
  /** Duration in ticks (1t = 0.05s) */
  duration: number;
}

export class Recipe implements IRecipe {
  temperature: number;
  eut: number;
  duration: number;

  constructor({ temperature, eut, duration }: IRecipe) {
    this.temperature = temperature;
    this.eut = eut;
    this.duration = duration;
  }

  get tier(): VoltageTier {
    return VoltageTier.getTierFromEUt(this.eut);
  }

  copy(): Recipe {
    return new Recipe({
      temperature: this.temperature,
      eut: this.eut,
      duration: this.duration,
    });
  }
}
