export class Historial {
private registros: string[] = [];
  private readonly CLAVE_STORAGE = "historial_conversiones";

  constructor() {
    
    this.cargarStorage();
  }

  private cargarStorage(): void {
    const datos = localStorage.getItem(this.CLAVE_STORAGE);
    this.registros = datos ? JSON.parse(datos) : [];
  }

  private guardarStorage(): void {
    localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(this.registros));
  }

  agregar(conversion: string): void {
    this.registros.push(conversion);
    this.guardarStorage();
  }

  listar(): string[] {
    return this.registros;
  }

  limpiar(): void {
    this.registros = [];
    this.guardarStorage(); 
  }
}
