import type { MonedaCodigo } from "./Tipos.js";

export class TasaCambio {
  constructor(
    public origen: MonedaCodigo,
    public destino: MonedaCodigo,
    public valor: number
  ) {}

  aplicar(monto: number): number {
    return monto * this.valor;
  }

  matches(origen: MonedaCodigo, destino: MonedaCodigo): boolean {
    return this.origen === origen && this.destino === destino;
  }

  toString(): string {
    return `${this.origen} → ${this.destino}: ${this.valor}`;
  }
}
