export class Historial {
  private registros: string[] = [];

  agregar(conversion: string) {
    this.registros.push(conversion);
  }

  listar(): string[] {
    return this.registros;
  }

  limpiar() {
    this.registros = [];
  }
}
