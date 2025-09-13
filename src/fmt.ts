const en_US = new Intl.Locale("en-US");

export const percentageFormatter = new Intl.NumberFormat(en_US, {
  style: "percent",
  maximumFractionDigits: 1,
}).format;

export const secondFormatter = new Intl.NumberFormat(en_US, {
  style: "unit",
  unit: "second",
  unitDisplay: "short",
  useGrouping: true,
  maximumFractionDigits: 2,
}).format;

export const decimalFormatter = new Intl.NumberFormat(en_US, {
  maximumFractionDigits: 2,
}).format;

export const integerFormatter = new Intl.NumberFormat(en_US, {
  useGrouping: true,
  maximumFractionDigits: 0,
}).format;
