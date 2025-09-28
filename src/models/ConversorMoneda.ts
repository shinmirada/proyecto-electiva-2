import { Conversor } from "./Conversor.js";
import { TasaCambio } from "./TasaCambio.js";
import type { MonedaCodigo } from "./Tipos.js";

export class ConversorMoneda extends Conversor {
  constructor(
    monto: number,
    private origen: MonedaCodigo,
    private destino: MonedaCodigo
  ) {
    super(monto);
  }

  private buscarTasa(tasas: TasaCambio[]): TasaCambio | undefined {
    return tasas.find(t => t.matches(this.origen, this.destino));
  }

  convertir(tasas: TasaCambio[]): number {
    if (this.origen === this.destino) {
      this.resultado = this.montoEntrada;
      return this.resultado;
    }
    const tasa = this.buscarTasa(tasas);
    this.resultado = tasa ? tasa.aplicar(this.montoEntrada) : 0;
    return this.resultado;
  }
}

