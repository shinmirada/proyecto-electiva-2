export class Historial {
    constructor() {
        this.registros = [];
        this.CLAVE_STORAGE = "historial_conversiones";
        this.cargarStorage();
    }
    cargarStorage() {
        const datos = localStorage.getItem(this.CLAVE_STORAGE);
        this.registros = datos ? JSON.parse(datos) : [];
    }
    guardarStorage() {
        localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(this.registros));
    }
    agregar(conversion) {
        this.registros.push(conversion);
        this.guardarStorage();
    }
    listar() {
        return this.registros;
    }
    limpiar() {
        this.registros = [];
        this.guardarStorage();
    }
}
