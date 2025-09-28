export type MonedaCodigo =
  | "USD" | "COP" | "EUR" | "GBP" | "JPY"
  | "CAD" | "AUD" | "CHF" | "CNY" | "MXN"
  | "BRL" | "ARS";

export type RawTasa = [MonedaCodigo, MonedaCodigo, number];
