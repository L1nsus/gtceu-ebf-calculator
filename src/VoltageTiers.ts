export class VoltageTier {
  name: string;
  numericTier: number;
  eut: number;

  constructor(name: string, numericTier: number) {
    this.name = name;
    this.numericTier = numericTier;
    this.eut = 8 * 4 ** numericTier;
  }

  static ULV = new VoltageTier("ULV", 0);
  static LV = new VoltageTier("LV", 1);
  static MV = new VoltageTier("MV", 2);
  static HV = new VoltageTier("HV", 3);
  static EV = new VoltageTier("EV", 4);
  static IV = new VoltageTier("IV", 5);
  static LuV = new VoltageTier("LuV", 6);
  static ZPM = new VoltageTier("ZPM", 7);
  static UV = new VoltageTier("UV", 8);
  static UHV = new VoltageTier("UHV", 9);
  static UEV = new VoltageTier("UEV", 10);
  static UIV = new VoltageTier("UIV", 11);
  static UXV = new VoltageTier("UXV", 12);
  static OpV = new VoltageTier("OpV", 13);
  static MAX = new VoltageTier("MAX", 14);

  static ALL = [
    this.ULV,
    this.LV,
    this.MV,
    this.HV,
    this.EV,
    this.IV,
    this.LuV,
    this.ZPM,
    this.UV,
    this.UHV,
    this.UEV,
    this.UIV,
    this.UXV,
    this.OpV,
    this.MAX,
  ];

  static getTierByNumericTier(numericTier: number): VoltageTier {
    return numericTier < 0
      ? this.ULV
      : (this.ALL.find((t) => t.numericTier === numericTier) ?? this.MAX);
  }

  static getTierFromEUt(eut: number): VoltageTier {
    // TODO: This checks even more shit with parallels, see:
    //       https://github.com/GregTechCEu/GregTech-Modern/blob/71462eba0e218b3e0ecba733611d410d6d8d59fd/src/main/java/com/gregtechceu/gtceu/api/recipe/RecipeHelper.java#L56
    return this.ALL.find((t) => t.eut >= eut) ?? this.MAX;
  }

  /**
   * Calculates the next lowest tier for a given voltage and can yield tiers above MAX
   */
  static getTierFromEUtWithOCFloor(eut: number): VoltageTier {
    const numericTier = Math.floor((Math.log2(eut) - 3) / 2);
    if (numericTier <= this.MAX.numericTier)
      return this.getTierByNumericTier(numericTier);
    else
      return new VoltageTier(
        `MAX +${numericTier - this.MAX.numericTier}`,
        numericTier
      );
  }
}
