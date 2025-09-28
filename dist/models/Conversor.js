export class Conversor {
    constructor(monto) {
        this.montoEntrada = monto;
        this.resultado = 0;
    }
    validarEntrada() {
        return !isNaN(this.montoEntrada) && this.montoEntrada > 0;
    }
    getResultado() {
        return this.resultado;
    }
}
