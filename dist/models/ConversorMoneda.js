import { Conversor } from "./Conversor.js";
import { TasaCambio } from "./TasaCambio.js";
export class ConversorMoneda extends Conversor {
    constructor(monto, origen, destino) {
        super(monto);
        this.origen = origen;
        this.destino = destino;
    }
    buscarTasa(tasas) {
        return tasas.find(t => t.matches(this.origen, this.destino));
    }
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
