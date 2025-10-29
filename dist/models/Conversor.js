/**
 * Clase base para realizar conversiones genéricas.
 * Define un monto de entrada y almacena el resultado de la conversión.
 */
export class Conversor {
    /**
     * @param monto Valor numérico que se desea convertir.
     */
    constructor(monto) {
        this.montoEntrada = monto;
        this.resultado = 0;
    }
    /**
     * Valida que el monto ingresado sea un número válido y positivo.
     * @returns true si el monto es válido, false en caso contrario.
     */
    validarEntrada() {
        return !isNaN(this.montoEntrada) && this.montoEntrada > 0;
    }
    /**
     * Obtiene el resultado de la conversión.
     * @returns Valor convertido.
     */
    getResultado() {
        return this.resultado;
    }
}
