var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TasaCambio } from "./TasaCambio.js";
export class GestorTasas {
    constructor() {
        this.tasas = [];
        this.ultimaActualizacion = null;
        this.API_URL = "https://api.exchangerate-api.com/v4/latest";
        this.CACHE_KEY = "tasas_cache";
        this.TIMESTAMP_KEY = "tasas_timestamp";
        this.CACHE_DURATION = 60 * 60 * 1000;
        this.cargandoDelServidor = false;
        this.tasas = [];
        this.inicializarTasas();
    }
    inicializarTasas() {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = this.obtenerDelCache();
            if (cached) {
                this.tasas = cached;
                console.log(" Tasas cargadas del caché");
                this.actualizarEnBackground();
                return;
            }
            console.log(" Sin caché, actualizando desde API...");
            yield this.actualizarDesdeAPI();
        });
    }
    actualizarDesdeAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cargandoDelServidor) {
                console.log(" Ya hay una actualización en proceso...");
                return false;
            }
            this.cargandoDelServidor = true;
            try {
                console.log(" Actualizando tasas desde API...");
                const response = yield fetch(`${this.API_URL}/USD`);
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                const datos = yield response.json();
                if (!datos.rates)
                    throw new Error("Respuesta API inválida");
                this.procesarRespuestaAPI(datos.rates);
                this.guardarEnCache();
                this.ultimaActualizacion = new Date();
                console.log(" Tasas actualizadas exitosamente");
                return true;
            }
            catch (error) {
                console.error(" Error actualizando desde API:", error);
                const cachedViejo = this.obtenerDelCacheAnciano();
                if (cachedViejo) {
                    this.tasas = cachedViejo;
                    console.log(" Usando tasas antiguas del caché");
                }
                return false;
            }
            finally {
                this.cargandoDelServidor = false;
            }
        });
    }
    actualizarEnBackground() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const cached = this.obtenerDelCache();
                if (!cached) {
                    yield this.actualizarDesdeAPI();
                }
            }), 500);
        });
    }
    procesarRespuestaAPI(rates) {
        const nuevasTasas = [];
        Object.entries(rates).forEach(([moneda, tasa]) => {
            if (typeof tasa === "number" && tasa > 0) {
                nuevasTasas.push(new TasaCambio("USD", moneda, tasa));
                nuevasTasas.push(new TasaCambio(moneda, "USD", 1 / tasa));
            }
        });
        this.tasas = nuevasTasas;
    }
    guardarEnCache() {
        const datosSerializados = this.tasas.map(t => ({
            origen: t.origen,
            destino: t.destino,
            valor: t.valor
        }));
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(datosSerializados));
        localStorage.setItem(this.TIMESTAMP_KEY, new Date().getTime().toString());
    }
    obtenerDelCache() {
        const datosCache = localStorage.getItem(this.CACHE_KEY);
        const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
        if (!datosCache || !timestamp)
            return null;
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
            return datos.map((t) => new TasaCambio(t.origen, t.destino, t.valor));
        }
        catch (_a) {
            return null;
        }
    }
    obtenerDelCacheAnciano() {
        const datosCache = localStorage.getItem(this.CACHE_KEY);
        if (!datosCache)
            return null;
        try {
            const datos = JSON.parse(datosCache);
            return datos.map((t) => new TasaCambio(t.origen, t.destino, t.valor));
        }
        catch (_a) {
            return null;
        }
    }
    obtener() {
        return this.tasas;
    }
    actualizarManual() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.actualizarDesdeAPI();
        });
    }
    getUltimaActualizacion() {
        return this.ultimaActualizacion;
    }
    estaCargando() {
        return this.cargandoDelServidor;
    }
}
