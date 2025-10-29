var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Clase que gestiona la obtención y almacenamiento de información
 * sobre países asociados a una moneda determinada.
 */
export class GestorPaises {
    constructor() {
        this.API_URL = "https://restcountries.com/v3.1/currency";
        this.cachePaises = new Map();
        /**
         * Mapeo de monedas principales a su país más representativo.
         */
        this.PAISES_PRINCIPALES = {
            'USD': 'United States',
            'EUR': 'Germany',
            'GBP': 'United Kingdom',
            'JPY': 'Japan',
            'CAD': 'Canada',
            'AUD': 'Australia',
            'CHF': 'Switzerland',
            'CNY': 'China',
            'COP': 'Colombia',
            'MXN': 'Mexico',
            'BRL': 'Brazil',
            'ARS': 'Argentina',
            'INR': 'India',
            'KRW': 'South Korea',
            'RUB': 'Russia',
            'ZAR': 'South Africa'
        };
    }
    /**
     * Obtiene los países que utilizan una moneda determinada.
     * Utiliza caché para evitar llamadas repetidas al servidor.
     * @param moneda Código de la moneda (ej: "USD").
     * @returns Lista de países asociados a la moneda.
     */
    obtenerPaisesPorMoneda(moneda) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachePaises.has(moneda)) {
                console.log(`✅ País de ${moneda} obtenido desde caché`);
                return this.cachePaises.get(moneda);
            }
            try {
                console.log(`🌍 Obteniendo información de países para ${moneda}...`);
                const response = yield fetch(`${this.API_URL}/${moneda}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}`);
                }
                const data = yield response.json();
                const paises = data.map((pais) => ({
                    nombre: pais.name.common,
                    nombreOficial: pais.name.official,
                    capital: pais.capital || ["N/A"],
                    poblacion: pais.population,
                    region: pais.region,
                    subregion: pais.subregion || "N/A",
                    idiomas: pais.languages ? Object.values(pais.languages) : ["N/A"],
                    bandera: pais.flags.svg || pais.flags.png,
                    codigo: pais.cca2
                }));
                const paisesOrdenados = this.ordenarPaisesPorRelevancia(paises, moneda);
                this.cachePaises.set(moneda, paisesOrdenados);
                console.log(`ℹ️ Información de ${paisesOrdenados.length} país(es) obtenida correctamente`);
                return paisesOrdenados;
            }
            catch (error) {
                console.error(`❌ Error al obtener países para ${moneda}:`, error);
                throw error;
            }
        });
    }
    /**
     * Ordena la lista de países colocando el país principal primero
     * y los demás según su población.
     * @param paises Lista de países obtenida de la API.
     * @param moneda Código de la moneda.
     * @returns Lista de países ordenada por relevancia.
     */
    ordenarPaisesPorRelevancia(paises, moneda) {
        const paisPrincipal = this.PAISES_PRINCIPALES[moneda];
        if (!paisPrincipal) {
            return paises.sort((a, b) => b.poblacion - a.poblacion);
        }
        const principal = paises.find(p => p.nombre === paisPrincipal);
        const otros = paises
            .filter(p => p.nombre !== paisPrincipal)
            .sort((a, b) => b.poblacion - a.poblacion);
        return principal ? [principal, ...otros] : otros;
    }
    /**
     * Convierte un número de población en formato legible (con comas o puntos).
     * @param poblacion Valor numérico de población.
     * @returns Cadena con formato legible (ej: "50.000.000").
     */
    formatearPoblacion(poblacion) {
        return poblacion.toLocaleString('es-ES');
    }
    /**
     * Limpia la memoria caché de países almacenada.
     */
    limpiarCache() {
        this.cachePaises.clear();
        console.log("🗑️ Caché de países limpiado");
    }
}
