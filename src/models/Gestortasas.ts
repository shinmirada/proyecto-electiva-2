import type { MonedaCodigo } from "./Tipos.js";

/**
 * Clase que gestiona las tasas de cambio de monedas.
 * Permite obtener, actualizar y almacenar tasas con caché local.
 */
export class GestorTasas {
  private tasas: Record<MonedaCodigo, number> = {};
  private base: MonedaCodigo = "USD";
  private ultimaActualizacion: Date | null = null;
  private cargandoDelServidor: boolean = false;

  private readonly API_URL = "https://api.exchangerate-api.com/v4/latest";
  private readonly CACHE_KEY = "tasas_cache";
  private readonly TIMESTAMP_KEY = "tasas_timestamp";
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora

  constructor() {
    this.inicializarTasas();
  }

  /**
   * Inicializa las tasas desde caché o desde la API si no hay datos locales.
   */
  private async inicializarTasas(): Promise<void> {
    const cached = this.obtenerDelCache();
    if (cached) {
      this.tasas = cached;
      console.log("✅ Tasas cargadas desde caché local.");
      this.actualizarEnBackground();
    } else {
      console.log("🌐 Sin caché disponible, obteniendo desde API...");
      await this.actualizarDesdeAPI();
    }
  }

  /**
   * Actualiza las tasas directamente desde la API.
   * @param base Moneda base (por defecto USD).
   * @returns true si se actualizó correctamente.
   */
  async actualizarDesdeAPI(base: MonedaCodigo = "USD"): Promise<boolean> {
    if (this.cargandoDelServidor) {
      console.log("⚠️ Ya hay una actualización en curso.");
      return false;
    }

    this.cargandoDelServidor = true;

    try {
      console.log(`🔄 Obteniendo tasas desde API con base ${base}...`);
      const response = await fetch(`${this.API_URL}/${base}`);
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

      const data = await response.json();
      if (!data.rates) throw new Error("Respuesta inválida de la API");

      this.tasas = data.rates;
      this.base = data.base || base;
      this.ultimaActualizacion = new Date();
      this.guardarEnCache();

      console.log("✅ Tasas actualizadas correctamente desde la API.");
      return true;
    } catch (error) {
      console.error("❌ Error al actualizar desde API:", error);
      const cacheAntiguo = this.obtenerDelCacheAntiguo();
      if (cacheAntiguo) {
        this.tasas = cacheAntiguo;
        console.log("♻️ Usando tasas antiguas del caché.");
      }
      return false;
    } finally {
      this.cargandoDelServidor = false;
    }
  }

  /**
   * Lanza una actualización automática en segundo plano.
   */
  private async actualizarEnBackground(): Promise<void> {
    setTimeout(async () => {
      await this.actualizarDesdeAPI(this.base);
    }, 500);
  }

  /**
   * Guarda las tasas actuales en el almacenamiento local.
   */
  private guardarEnCache(): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.tasas));
    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Obtiene las tasas almacenadas si el caché sigue vigente.
   * @returns Tasas guardadas o null si expiraron.
   */
  private obtenerDelCache(): Record<MonedaCodigo, number> | null {
    const cache = localStorage.getItem(this.CACHE_KEY);
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);

    if (!cache || !timestamp) return null;

    const ahora = Date.now();
    const diferencia = ahora - parseInt(timestamp);

    if (diferencia > this.CACHE_DURATION) {
      console.log("⌛ Caché expirado (más de 1 hora).");
      return null;
    }

    try {
      const datos = JSON.parse(cache);
      const minutosRestantes = Math.floor((this.CACHE_DURATION - diferencia) / 60000);
      console.log(`🕐 Caché válido (${minutosRestantes} min restantes).`);
      return datos;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene las tasas antiguas del caché sin verificar tiempo de expiración.
   * @returns Tasas antiguas o null.
   */
  private obtenerDelCacheAntiguo(): Record<MonedaCodigo, number> | null {
    const cache = localStorage.getItem(this.CACHE_KEY);
    if (!cache) return null;
    try {
      return JSON.parse(cache);
    } catch {
      return null;
    }
  }

  /**
   * Devuelve todas las tasas disponibles, actualizando si es necesario.
   */
  async obtener(): Promise<Record<MonedaCodigo, number>> {
    if (Object.keys(this.tasas).length === 0) {
      await this.actualizarDesdeAPI(this.base);
    }
    return this.tasas;
  }

  /**
   * Calcula la tasa entre dos monedas específicas.
   * @param origen Moneda de origen.
   * @param destino Moneda de destino.
   * @returns Valor de conversión entre ambas.
   */
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

  /**
   * Obtiene todas las tasas relativas a una moneda específica.
   * @param moneda Moneda base.
   * @returns Objeto con tasas hacia las demás monedas.
   */
  async obtenerTasasDeMoneda(moneda: MonedaCodigo): Promise<Record<MonedaCodigo, number>> {
    const tasas = await this.obtener();
    const resultado: Record<MonedaCodigo, number> = {};

    if (!tasas[moneda]) {
      throw new Error(`No se encontró la moneda: ${moneda}`);
    }

    for (const [codigo, tasa] of Object.entries(tasas)) {
      if (codigo !== moneda) {
        resultado[codigo] = tasa / tasas[moneda];
      }
    }

    return resultado;
  }

  /**
   * Lista todas las monedas disponibles en orden alfabético.
   */
  async obtenerMonedasDisponibles(): Promise<MonedaCodigo[]> {
    const tasas = await this.obtener();
    return Object.keys(tasas).sort();
  }

  /**
   * Devuelve la fecha de la última actualización.
   */
  getUltimaActualizacion(): Date | null {
    return this.ultimaActualizacion;
  }

  /**
   * Indica si actualmente se está cargando información desde la API.
   */
  estaCargando(): boolean {
    return this.cargandoDelServidor;
  }
}
