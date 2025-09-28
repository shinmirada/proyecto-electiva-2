export class TasaCambio {
    constructor(origen, destino, valor) {
        this.origen = origen;
        this.destino = destino;
        this.valor = valor;
    }
    aplicar(monto) {
        return monto * this.valor;
    }
    matches(origen, destino) {
        return this.origen === origen && this.destino === destino;
    }
    toString() {
        return `${this.origen} → ${this.destino}: ${this.valor}`;
    }
}
