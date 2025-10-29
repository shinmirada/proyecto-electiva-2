/**
 * Clase que gestiona el historial de conversiones del usuario.
 * Guarda las conversiones en el almacenamiento local (localStorage).
 */
export class Historial {
  private registros: string[] = [];
  private readonly CLAVE_STORAGE = "historial_conversiones";

  constructor() {
    this.cargarStorage();
  }

  /**
   * Carga los registros almacenados previamente en localStorage.
   */
  private cargarStorage(): void {
    const datos = localStorage.getItem(this.CLAVE_STORAGE);
    this.registros = datos ? JSON.parse(datos) : [];
  }

  /**
   * Guarda los registros actuales en localStorage.
   */
  private guardarStorage(): void {
    localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(this.registros));
  }

  /**
   * Agrega una nueva conversión al historial.
   * @param conversion Texto descriptivo de la conversión realizada.
   */
  agregar(conversion: string): void {
    this.registros.push(conversion);
    this.guardarStorage();
  }

  /**
   * Retorna la lista completa de conversiones almacenadas.
   */
  listar(): string[] {
    return this.registros;
  }

  /**
   * Limpia todos los registros del historial.
   */
  limpiar(): void {
    this.registros = [];
    this.guardarStorage();
  }
}
