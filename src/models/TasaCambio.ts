import type { MonedaCodigo } from "./Tipos.js";

/**
 * Representa una tasa de cambio entre dos monedas.
 */
export class TasaCambio {
  /**
   * @param origen Moneda de origen.
   * @param destino Moneda de destino.
   * @param valor Valor numérico de la tasa.
   */
  constructor(
    public origen: MonedaCodigo,
    public destino: MonedaCodigo,
    public valor: number
  ) {}

  /**
   * Aplica la tasa de cambio a un monto dado.
   * @param monto Cantidad a convertir.
   * @returns Resultado convertido.
   */
  aplicar(monto: number): number {
    return monto * this.valor;
  }

  /**
   * Verifica si la tasa corresponde a dos monedas específicas.
   * @param origen Código de la moneda origen.
   * @param destino Código de la moneda destino.
   * @returns true si coincide, false si no.
   */
  matches(origen: MonedaCodigo, destino: MonedaCodigo): boolean {
    return this.origen === origen && this.destino === destino;
  }

  /**
   * Devuelve una representación en texto de la tasa.
   */
  toString(): string {
    return `${this.origen} → ${this.destino}: ${this.valor}`;
  }
}

