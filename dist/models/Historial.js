/**
 * Clase que gestiona el historial de conversiones del usuario.
 * Guarda las conversiones en el almacenamiento local (localStorage).
 */
export class Historial {
    constructor() {
        this.registros = [];
        this.CLAVE_STORAGE = "historial_conversiones";
        this.cargarStorage();
    }
    /**
     * Carga los registros almacenados previamente en localStorage.
     */
    cargarStorage() {
        const datos = localStorage.getItem(this.CLAVE_STORAGE);
        this.registros = datos ? JSON.parse(datos) : [];
    }
    /**
     * Guarda los registros actuales en localStorage.
     */
    guardarStorage() {
        localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(this.registros));
    }
    /**
     * Agrega una nueva conversión al historial.
     * @param conversion Texto descriptivo de la conversión realizada.
     */
    agregar(conversion) {
        this.registros.push(conversion);
        this.guardarStorage();
    }
    /**
     * Retorna la lista completa de conversiones almacenadas.
     */
    listar() {
        return this.registros;
    }
    /**
     * Limpia todos los registros del historial.
     */
    limpiar() {
        this.registros = [];
        this.guardarStorage();
    }
}
