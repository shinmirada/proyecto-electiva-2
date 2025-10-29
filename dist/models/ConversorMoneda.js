import { Conversor } from "./Conversor.js";
import { TasaCambio } from "./TasaCambio.js";
/**
 * Clase que extiende Conversor para realizar conversiones entre monedas.
 * Utiliza una lista de tasas de cambio para calcular el valor convertido.
 */
export class ConversorMoneda extends Conversor {
    /**
     * @param monto Monto a convertir.
     * @param origen Código de la moneda origen (ej: "USD").
     * @param destino Código de la moneda destino (ej: "EUR").
     */
    constructor(monto, origen, destino) {
        super(monto);
        this.origen = origen;
        this.destino = destino;
    }
    /**
     * Busca una tasa de cambio que coincida con las monedas origen y destino.
     * @param tasas Lista de tasas disponibles.
     * @returns La tasa correspondiente o undefined si no existe.
     */
    buscarTasa(tasas) {
        return tasas.find(t => t.matches(this.origen, this.destino));
    }
    /**
     * Realiza la conversión entre dos monedas usando la tasa correspondiente.
     * Si las monedas son iguales, devuelve el mismo monto.
     * @param tasas Lista de tasas de cambio disponibles.
     * @returns Resultado de la conversión.
     */
    convertir(tasas) {
        if (this.origen === this.destino) {
            this.resultado = this.montoEntrada;
            return this.resultado;
        }
        const tasa = this.buscarTasa(tasas);
        this.resultado = tasa ? tasa.aplicar(this.montoEntrada) : 0;
        return this.resultado;
    }
}
