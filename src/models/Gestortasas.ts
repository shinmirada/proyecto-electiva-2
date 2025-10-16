import { TasaCambio } from "./TasaCambio.js";
import type { MonedaCodigo } from "./Tipos.js";

export class GestorTasas {
  private tasas: TasaCambio[] = [];
  private ultimaActualizacion: Date | null = null;
  private readonly API_URL = "https://api.exchangerate-api.com/v4/latest";
  private readonly CACHE_KEY = "tasas_cache";
  private readonly TIMESTAMP_KEY = "tasas_timestamp";
  private readonly CACHE_DURATION = 60 * 60 * 1000; 
  private cargandoDelServidor: boolean = false;

  constructor() {
    this.tasas = [];
    this.inicializarTasas();
  }

  private async inicializarTasas(): Promise<void> {
    const cached = this.obtenerDelCache();
    if (cached) {
      this.tasas = cached;
      console.log(" Tasas cargadas del caché");
      this.actualizarEnBackground();
      return;
    }

    console.log(" Sin caché, actualizando desde API...");
    await this.actualizarDesdeAPI();
  }


  async actualizarDesdeAPI(): Promise<boolean> {
    if (this.cargandoDelServidor) {
      console.log(" Ya hay una actualización en proceso...");
      return false;
    }

    this.cargandoDelServidor = true;

    try {
      console.log(" Actualizando tasas desde API...");
      const response = await fetch(`${this.API_URL}/USD`);
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const datos = await response.json();
      
      if (!datos.rates) throw new Error("Respuesta API inválida");

      this.procesarRespuestaAPI(datos.rates);
      this.guardarEnCache();
      this.ultimaActualizacion = new Date();
      
      console.log(" Tasas actualizadas exitosamente");
      return true;
    } catch (error) {
      console.error(" Error actualizando desde API:", error);
      
      const cachedViejo = this.obtenerDelCacheAnciano();
      if (cachedViejo) {
        this.tasas = cachedViejo;
        console.log(" Usando tasas antiguas del caché");
      }
      return false;
    } finally {
      this.cargandoDelServidor = false;
    }
  }

  private async actualizarEnBackground(): Promise<void> {
    setTimeout(async () => {
      const cached = this.obtenerDelCache();
      
      if (!cached) {
        await this.actualizarDesdeAPI();
      }
    }, 500);
  }

 
  private procesarRespuestaAPI(rates: Record<string, number>): void {
    const nuevasTasas: TasaCambio[] = [];

    Object.entries(rates).forEach(([moneda, tasa]: [string, number]) => {
      if (typeof tasa === "number" && tasa > 0) {
        nuevasTasas.push(new TasaCambio("USD", moneda as MonedaCodigo, tasa));
        nuevasTasas.push(new TasaCambio(moneda as MonedaCodigo, "USD", 1 / tasa));
      }
    });

    this.tasas = nuevasTasas;
  }

  private guardarEnCache(): void {
    const datosSerializados = this.tasas.map(t => ({
      origen: t.origen,
      destino: t.destino,
      valor: t.valor
    }));
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(datosSerializados));
    localStorage.setItem(this.TIMESTAMP_KEY, new Date().getTime().toString());
  }

  private obtenerDelCache(): TasaCambio[] | null {
    const datosCache = localStorage.getItem(this.CACHE_KEY);
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);

    if (!datosCache || !timestamp) return null;

    const ahora = new Date().getTime();
    const tiempoTranscurrido = ahora - parseInt(timestamp);

    if (tiempoTranscurrido > this.CACHE_DURATION) {
      console.log(" Caché expirado (más de 1 hora)");
      return null;
    }

    try {
      const datos = JSON.parse(datosCache);
      const minutosRestantes = Math.floor((this.CACHE_DURATION - tiempoTranscurrido) / 60000);
      console.log(` Caché válido (${minutosRestantes} min restantes)`);
      return datos.map((t: any) => new TasaCambio(t.origen, t.destino, t.valor));
    } catch {
      return null;
    }
  }

  private obtenerDelCacheAnciano(): TasaCambio[] | null {
    const datosCache = localStorage.getItem(this.CACHE_KEY);
    if (!datosCache) return null;

    try {
      const datos = JSON.parse(datosCache);
      return datos.map((t: any) => new TasaCambio(t.origen, t.destino, t.valor));
    } catch {
      return null;
    }
  }

  obtener(): TasaCambio[] {
    return this.tasas;
  }

  async actualizarManual(): Promise<boolean> {
    return await this.actualizarDesdeAPI();
  }

  getUltimaActualizacion(): Date | null {
    return this.ultimaActualizacion;
  }

  estaCargando(): boolean {
    return this.cargandoDelServidor;
  }
}