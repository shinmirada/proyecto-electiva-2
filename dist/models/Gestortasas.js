var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GestorTasas {
    constructor() {
        this.tasas = {};
        this.base = "USD";
        this.ultimaActualizacion = null;
        this.cargandoDelServidor = false;
        this.API_URL = "https://api.exchangerate-api.com/v4/latest";
        this.CACHE_KEY = "tasas_cache";
        this.TIMESTAMP_KEY = "tasas_timestamp";
        this.CACHE_DURATION = 60 * 60 * 1000;
        this.inicializarTasas();
    }
    inicializarTasas() {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = this.obtenerDelCache();
            if (cached) {
                this.tasas = cached;
                console.log(" Tasas cargadas desde caché local.");
                this.actualizarEnBackground();
            }
            else {
                console.log(" Sin caché disponible, obteniendo desde API...");
                yield this.actualizarDesdeAPI();
            }
        });
    }
    actualizarDesdeAPI() {
        return __awaiter(this, arguments, void 0, function* (base = "USD") {
            if (this.cargandoDelServidor) {
                console.log(" Ya hay una actualización en curso.");
                return false;
            }
            this.cargandoDelServidor = true;
            try {
                console.log(`Obteniendo tasas desde API con base ${base}...`);
                const response = yield fetch(`${this.API_URL}/${base}`);
                if (!response.ok)
                    throw new Error(`Error HTTP ${response.status}`);
                const data = yield response.json();
                if (!data.rates)
                    throw new Error("Respuesta inválida de la API");
                this.tasas = data.rates;
                this.base = data.base || base;
                this.ultimaActualizacion = new Date();
                this.guardarEnCache();
                console.log(" Tasas actualizadas correctamente desde la API.");
                return true;
            }
            catch (error) {
                console.error(" Error al actualizar desde API:", error);
                const cacheAntiguo = this.obtenerDelCacheAntiguo();
                if (cacheAntiguo) {
                    this.tasas = cacheAntiguo;
                    console.log(" Usando tasas antiguas del caché.");
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
                yield this.actualizarDesdeAPI(this.base);
            }), 500);
        });
    }
    guardarEnCache() {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.tasas));
        localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
    }
    obtenerDelCache() {
        const cache = localStorage.getItem(this.CACHE_KEY);
        const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
        if (!cache || !timestamp)
            return null;
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
        }
        catch (_a) {
            return null;
        }
    }
    obtenerDelCacheAntiguo() {
        const cache = localStorage.getItem(this.CACHE_KEY);
        if (!cache)
            return null;
        try {
            return JSON.parse(cache);
        }
        catch (_a) {
            return null;
        }
    }
    obtener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(this.tasas).length === 0) {
                yield this.actualizarDesdeAPI(this.base);
            }
            return this.tasas;
        });
    }
    obtenerTasa(origen, destino) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasas = yield this.obtener();
            if (origen === destino)
                return 1;
            const tasaOrigen = tasas[origen];
            const tasaDestino = tasas[destino];
            if (!tasaOrigen || !tasaDestino) {
                throw new Error(`No se encontró una o ambas monedas: ${origen}, ${destino}`);
            }
            return tasaDestino / tasaOrigen;
        });
    }
    getUltimaActualizacion() {
        return this.ultimaActualizacion;
    }
    estaCargando() {
        return this.cargandoDelServidor;
    }
}
