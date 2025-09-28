export class Conversor {
  protected montoEntrada: number;
  protected resultado: number;

  constructor(monto: number) {
    this.montoEntrada = monto;
    this.resultado = 0;
  }

  validarEntrada(): boolean {
    return !isNaN(this.montoEntrada) && this.montoEntrada > 0;
  }

  getResultado(): number {
    return this.resultado;
  }
}
