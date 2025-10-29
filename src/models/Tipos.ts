/**
 * Tipo que representa el código ISO de una moneda (ej: "USD", "EUR").
 */
export type MonedaCodigo = string;

/**
 * Tipo para representar una tasa cruda sin procesar:
 * [monedaOrigen, monedaDestino, valor].
 */
export type RawTasa = [MonedaCodigo, MonedaCodigo, number];



