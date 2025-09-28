export class Historial {
    constructor() {
        this.registros = [];
    }
    agregar(conversion) {
        this.registros.push(conversion);
    }
    listar() {
        return this.registros;
    }
    limpiar() {
        this.registros = [];
    }
}
