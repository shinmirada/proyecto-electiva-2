/**
 * Representa una tasa de cambio entre dos monedas.
 */
export class TasaCambio {
    /**
     * @param origen Moneda de origen.
     * @param destino Moneda de destino.
     * @param valor Valor numérico de la tasa.
     */
    constructor(origen, destino, valor) {
        this.origen = origen;
        this.destino = destino;
        this.valor = valor;
    }
    /**
     * Aplica la tasa de cambio a un monto dado.
     * @param monto Cantidad a convertir.
     * @returns Resultado convertido.
     */
    aplicar(monto) {
        return monto * this.valor;
    }
    /**
     * Verifica si la tasa corresponde a dos monedas específicas.
     * @param origen Código de la moneda origen.
     * @param destino Código de la moneda destino.
     * @returns true si coincide, false si no.
     */
    matches(origen, destino) {
        return this.origen === origen && this.destino === destino;
    }
    /**
     * Devuelve una representación en texto de la tasa.
     */
    toString() {
        return `${this.origen} → ${this.destino}: ${this.valor}`;
    }
}
