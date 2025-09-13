export class CoilType {
  name: string;
  coilTemperature: number;

  constructor(name: string, coilTemperature: number) {
    this.name = name;
    this.coilTemperature = coilTemperature;
  }

  // Default coils from https://github.com/GregTechCEu/GregTech-Modern/blob/1.20.1/src/main/java/com/gregtechceu/gtceu/common/block/CoilBlock.java
  static CUPRONICKEL = new CoilType("Cupronickel", 1800);
  static KANTHAL = new CoilType("Kanthal", 2700);
  static NICHROME = new CoilType("Nichrome", 3600);
  static RTM_ALLOY = new CoilType("RTM-Alloy", 4500);
  static HSS_G = new CoilType("HSS-G", 5400);
  static NAQUADAH = new CoilType("Naquadah", 7200);
  static TRINIUM = new CoilType("Trinium", 9001);
  static TRITANIUM = new CoilType("Tritanium", 10800);

  public static ALL = [
    this.CUPRONICKEL,
    this.KANTHAL,
    this.NICHROME,
    this.RTM_ALLOY,
    this.HSS_G,
    this.NAQUADAH,
    this.TRINIUM,
    this.TRITANIUM,
  ];
}
