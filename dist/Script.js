/*import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { Historial } from "./models/Historial.js";
import { GestorTasas } from "./models/Gestortasas.js";
import type { MonedaCodigo } from "./models/Tipos.js";

const historial = new Historial();
const gestorTasas = new GestorTasas();


async function actualizarTasas(): Promise<void> {
  const btnActualizar = document.getElementById("btnActualizarTasas") as HTMLButtonElement;
  if (btnActualizar) {
    btnActualizar.innerText = "Actualizando...";
    btnActualizar.disabled = true;
  }

  const exito = await gestorTasas.actualizarDesdeAPI();

  if (btnActualizar) {
    if (exito) {
      btnActualizar.innerText = " Actualizado";
      setTimeout(() => {
        btnActualizar.innerText = "Actualizar Tasas";
        btnActualizar.disabled = false;
      }, 2000);
    } else {
      btnActualizar.innerText = " Error al actualizar";
      btnActualizar.disabled = false;
      setTimeout(() => {
        btnActualizar.innerText = "Actualizar Tasas";
      }, 3000);
    }
  }
}


async function convertir(): Promise<void> {
  const monto = parseFloat((document.getElementById("cantidadOrigen") as HTMLInputElement).value);
  const origen = (document.getElementById("monedaOrigen") as HTMLSelectElement).value as MonedaCodigo;
  const destino = (document.getElementById("monedaDestino") as HTMLSelectElement).value as MonedaCodigo;

  const conversor = new ConversorMoneda(monto, origen, destino);

  if (!conversor.validarEntrada()) {
    (document.getElementById("textoResultado") as HTMLElement).innerText = "Ingresa un monto válido.";
    (document.getElementById("tasaResultado") as HTMLElement).innerText = "";
    return;
  }

  try {
 
    const tasa = await gestorTasas.obtenerTasa(origen, destino);
    const resultado = monto * tasa;

    (document.getElementById("cantidadDestino") as HTMLInputElement).value = resultado.toFixed(2);

    const texto = document.getElementById("textoResultado") as HTMLElement;
    const tasaTxt = document.getElementById("tasaResultado") as HTMLElement;

    texto.innerText = `${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;
    tasaTxt.innerText = `Tasa usada: ${tasa.toFixed(4)}`;

    historial.agregar(`${monto} ${origen} = ${resultado.toFixed(2)} ${destino} (${new Date().toLocaleString()})`);
  } catch (error) {
    console.error(error);
    (document.getElementById("textoResultado") as HTMLElement).innerText = "No se pudo obtener la tasa de cambio.";
    (document.getElementById("tasaResultado") as HTMLElement).innerText = "";
  }
}


function mostrarHistorial(): void {
  const interfazHistorial = document.getElementById("interfaz-historial");
  const interfazConversor = document.getElementById("interfaz-conversor");

  if (interfazHistorial) interfazHistorial.style.display = "block";
  if (interfazConversor) interfazConversor.style.display = "none";

  const lista = document.getElementById("listaHistorialHtml") as HTMLElement;
  const registros = historial.listar();

  lista.innerText = registros.length > 0 ? registros.join("\n") : "Todavía no hay conversiones.";
}


function mostrarConversor(): void {
  (document.getElementById("interfaz-conversor") as HTMLElement).style.display = "block";
  (document.getElementById("interfaz-historial") as HTMLElement).style.display = "none";
}


function limpiarHistorial(): void {
  historial.limpiar();
  mostrarHistorial();
}


function intercambiar(): void {
  const origen = document.getElementById("monedaOrigen") as HTMLSelectElement;
  const destino = document.getElementById("monedaDestino") as HTMLSelectElement;
  const tmp = origen.value;
  origen.value = destino.value;
  destino.value = tmp;
}

function abrirHistorial(): void {
  const modal = document.getElementById("modalHistorial") as HTMLElement;
  modal.style.display = "flex";
  mostrarHistorial();
}

function cerrarHistorial(): void {
  const modal = document.getElementById("modalHistorial") as HTMLElement;
  modal.style.display = "none";
}


(window as any).convertir = convertir;
(window as any).intercambiar = intercambiar;
(window as any).abrirHistorial = abrirHistorial;
(window as any).cerrarHistorial = cerrarHistorial;
(window as any).limpiarHistorial = limpiarHistorial;
(window as any).mostrarHistorial = mostrarHistorial;
(window as any).mostrarConversor = mostrarConversor;
(window as any).actualizarTasas = actualizarTasas;*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { Historial } from "./models/Historial.js";
import { GestorTasas } from "./models/Gestortasas.js";
const historial = new Historial();
const gestorTasas = new GestorTasas();
function actualizarTasas() {
    return __awaiter(this, void 0, void 0, function* () {
        const btnActualizar = document.getElementById("btnActualizarTasas");
        if (btnActualizar) {
            btnActualizar.innerText = "Actualizando...";
            btnActualizar.disabled = true;
        }
        const exito = yield gestorTasas.actualizarDesdeAPI();
        if (btnActualizar) {
            if (exito) {
                btnActualizar.innerText = "✅ Actualizado";
                setTimeout(() => {
                    btnActualizar.innerText = "Actualizar Tasas";
                    btnActualizar.disabled = false;
                }, 2000);
            }
            else {
                btnActualizar.innerText = "❌ Error al actualizar";
                btnActualizar.disabled = false;
                setTimeout(() => {
                    btnActualizar.innerText = "Actualizar Tasas";
                }, 3000);
            }
        }
    });
}
function convertir() {
    return __awaiter(this, void 0, void 0, function* () {
        const monto = parseFloat(document.getElementById("cantidadOrigen").value);
        const origen = document.getElementById("monedaOrigen").value;
        const destino = document.getElementById("monedaDestino").value;
        const conversor = new ConversorMoneda(monto, origen, destino);
        if (!conversor.validarEntrada()) {
            document.getElementById("textoResultado").innerText = "Ingresa un monto válido.";
            document.getElementById("tasaResultado").innerText = "";
            return;
        }
        try {
            const tasa = yield gestorTasas.obtenerTasa(origen, destino);
            const resultado = monto * tasa;
            document.getElementById("cantidadDestino").value = resultado.toFixed(2);
            const texto = document.getElementById("textoResultado");
            const tasaTxt = document.getElementById("tasaResultado");
            texto.innerText = `${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;
            tasaTxt.innerText = `Tasa usada: ${tasa.toFixed(4)}`;
            historial.agregar(`${monto} ${origen} = ${resultado.toFixed(2)} ${destino} (${new Date().toLocaleString()})`);
        }
        catch (error) {
            console.error(error);
            document.getElementById("textoResultado").innerText = "No se pudo obtener la tasa de cambio.";
            document.getElementById("tasaResultado").innerText = "";
        }
    });
}
function mostrarHistorial() {
    const interfazHistorial = document.getElementById("interfaz-historial");
    const interfazConversor = document.getElementById("interfaz-conversor");
    if (interfazHistorial)
        interfazHistorial.style.display = "block";
    if (interfazConversor)
        interfazConversor.style.display = "none";
    const lista = document.getElementById("listaHistorialHtml");
    const registros = historial.listar();
    lista.innerText = registros.length > 0 ? registros.join("\n") : "Todavía no hay conversiones.";
}
function mostrarConversor() {
    document.getElementById("interfaz-conversor").style.display = "block";
    document.getElementById("interfaz-historial").style.display = "none";
}
function limpiarHistorial() {
    historial.limpiar();
    mostrarHistorial();
}
function intercambiar() {
    const origen = document.getElementById("monedaOrigen");
    const destino = document.getElementById("monedaDestino");
    const tmp = origen.value;
    origen.value = destino.value;
    destino.value = tmp;
}
function abrirHistorial() {
    const modal = document.getElementById("modalHistorial");
    modal.style.display = "flex";
    mostrarHistorial();
}
function cerrarHistorial() {
    const modal = document.getElementById("modalHistorial");
    modal.style.display = "none";
}
// 🆕 NUEVA FUNCIÓN: Consultar tasas de una moneda
function consultarTasas() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectMoneda = document.getElementById("monedaConsulta");
        const contenedorResultados = document.getElementById("resultadosTasas");
        const btnConsultar = document.getElementById("btnConsultarTasas");
        const moneda = selectMoneda.value;
        if (!moneda) {
            contenedorResultados.innerHTML = '<p style="color: #ff4d4d;">Por favor selecciona una moneda.</p>';
            return;
        }
        try {
            btnConsultar.innerText = "Consultando...";
            btnConsultar.disabled = true;
            const tasas = yield gestorTasas.obtenerTasasDeMoneda(moneda);
            // Crear tabla HTML con las tasas
            let html = `
      <div class="tasas-header">
        <h3>Tasas de cambio desde ${moneda}</h3>
        <p class="tasas-subtitle">1 ${moneda} equivale a:</p>
      </div>
      <div class="tasas-grid">
    `;
            // Ordenar y mostrar las tasas
            const tasasOrdenadas = Object.entries(tasas).sort((a, b) => a[0].localeCompare(b[0]));
            for (const [codigo, valor] of tasasOrdenadas) {
                const banderas = {
                    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
                    'CAD': '🇨🇦', 'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳',
                    'COP': '🇨🇴', 'MXN': '🇲🇽', 'BRL': '🇧🇷', 'ARS': '🇦🇷'
                };
                const bandera = banderas[codigo] || '🌍';
                html += `
        <div class="tasa-item">
          <span class="tasa-moneda">${bandera} ${codigo}</span>
          <span class="tasa-valor">${valor.toFixed(4)}</span>
        </div>
      `;
            }
            html += '</div>';
            contenedorResultados.innerHTML = html;
        }
        catch (error) {
            console.error(error);
            contenedorResultados.innerHTML = '<p style="color: #ff4d4d;">Error al obtener las tasas. Intenta nuevamente.</p>';
        }
        finally {
            btnConsultar.innerText = "🔍 Consultar Tasas";
            btnConsultar.disabled = false;
        }
    });
}
// 🆕 NUEVA FUNCIÓN: Inicializar página de consulta de tasas
function inicializarConsultaTasas() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectMoneda = document.getElementById("monedaConsulta");
        if (!selectMoneda)
            return;
        try {
            const monedas = yield gestorTasas.obtenerMonedasDisponibles();
            // Limpiar opciones existentes
            selectMoneda.innerHTML = '<option value="">-- Selecciona una moneda --</option>';
            // Agregar todas las monedas disponibles
            const banderas = {
                'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
                'CAD': '🇨🇦', 'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳',
                'COP': '🇨🇴', 'MXN': '🇲🇽', 'BRL': '🇧🇷', 'ARS': '🇦🇷'
            };
            for (const codigo of monedas) {
                const bandera = banderas[codigo] || '🌍';
                const option = document.createElement('option');
                option.value = codigo;
                option.textContent = `${codigo} ${bandera}`;
                selectMoneda.appendChild(option);
            }
        }
        catch (error) {
            console.error("Error al cargar monedas:", error);
        }
    });
}
window.convertir = convertir;
window.intercambiar = intercambiar;
window.abrirHistorial = abrirHistorial;
window.cerrarHistorial = cerrarHistorial;
window.limpiarHistorial = limpiarHistorial;
window.mostrarHistorial = mostrarHistorial;
window.mostrarConversor = mostrarConversor;
window.actualizarTasas = actualizarTasas;
window.consultarTasas = consultarTasas;
window.inicializarConsultaTasas = inicializarConsultaTasas;
