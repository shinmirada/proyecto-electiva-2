import type { MonedaCodigo } from "./Tipos.js";


export class GestorTasas {
  private tasas: Record<MonedaCodigo, number> = {};
  private base: MonedaCodigo = "USD";
  private ultimaActualizacion: Date | null = null;
  private cargandoDelServidor: boolean = false;

  
  private readonly API_URL = "https://api.exchangerate-api.com/v4/latest";
  private readonly CACHE_KEY = "tasas_cache";
  private readonly TIMESTAMP_KEY = "tasas_timestamp";
  private readonly CACHE_DURATION = 60 * 60 * 1000; 

  constructor() {
    this.inicializarTasas();
  }

 
  private async inicializarTasas(): Promise<void> {
    const cached = this.obtenerDelCache();
    if (cached) {
      this.tasas = cached;
      console.log(" Tasas cargadas desde caché local.");
      this.actualizarEnBackground();
    } else {
      console.log(" Sin caché disponible, obteniendo desde API...");
      await this.actualizarDesdeAPI();
    }
  }

  
  async actualizarDesdeAPI(base: MonedaCodigo = "USD"): Promise<boolean> {
    if (this.cargandoDelServidor) {
      console.log(" Ya hay una actualización en curso.");
      return false;
    }

    this.cargandoDelServidor = true;

    try {
      console.log(`Obteniendo tasas desde API con base ${base}...`);
      const response = await fetch(`${this.API_URL}/${base}`);

      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

      const data = await response.json();
      if (!data.rates) throw new Error("Respuesta inválida de la API");

      this.tasas = data.rates;
      this.base = data.base || base;
      this.ultimaActualizacion = new Date();

      this.guardarEnCache();

      console.log(" Tasas actualizadas correctamente desde la API.");
      return true;
    } catch (error) {
      console.error(" Error al actualizar desde API:", error);

     
      const cacheAntiguo = this.obtenerDelCacheAntiguo();
      if (cacheAntiguo) {
        this.tasas = cacheAntiguo;
        console.log(" Usando tasas antiguas del caché.");
      }

      return false;
    } finally {
      this.cargandoDelServidor = false;
    }
  }

 
  private async actualizarEnBackground(): Promise<void> {
    setTimeout(async () => {
      await this.actualizarDesdeAPI(this.base);
    }, 500);
  }

  private guardarEnCache(): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.tasas));
    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
  }

 
  private obtenerDelCache(): Record<MonedaCodigo, number> | null {
    const cache = localStorage.getItem(this.CACHE_KEY);
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);

    if (!cache || !timestamp) return null;

    const ahora = Date.now();
    const diferencia = ahora - parseInt(timestamp);

    if (diferencia > this.CACHE_DURATION) {
      console.log(" Caché expirado (más de 1 hora).");
      return null;
    }

    try {
      const datos = JSON.parse(cache);
      const minutosRestantes = Math.floor((this.CACHE_DURATION - diferencia) / 60000);
      console.log(` Caché válido (${minutosRestantes} min restantes).`);
      return datos;
    } catch {
      return null;
    }
  }


  private obtenerDelCacheAntiguo(): Record<MonedaCodigo, number> | null {
    const cache = localStorage.getItem(this.CACHE_KEY);
    if (!cache) return null;
    try {
      return JSON.parse(cache);
    } catch {
      return null;
    }
  }

  async obtener(): Promise<Record<MonedaCodigo, number>> {
    if (Object.keys(this.tasas).length === 0) {
      await this.actualizarDesdeAPI(this.base);
    }
    return this.tasas;
  }


  async obtenerTasa(origen: MonedaCodigo, destino: MonedaCodigo): Promise<number> {
    const tasas = await this.obtener();

    if (origen === destino) return 1;

    const tasaOrigen = tasas[origen];
    const tasaDestino = tasas[destino];

    if (!tasaOrigen || !tasaDestino) {
      throw new Error(`No se encontró una o ambas monedas: ${origen}, ${destino}`);
    }

 
    return tasaDestino / tasaOrigen;
  }

 
  getUltimaActualizacion(): Date | null {
    return this.ultimaActualizacion;
  }


  estaCargando(): boolean {
    return this.cargandoDelServidor;
  }
}
