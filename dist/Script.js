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
                btnActualizar.innerText = " Actualizado";
                setTimeout(() => {
                    btnActualizar.innerText = "Actualizar Tasas";
                    btnActualizar.disabled = false;
                }, 2000);
            }
            else {
                btnActualizar.innerText = " Error al actualizar";
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
window.convertir = convertir;
window.intercambiar = intercambiar;
window.abrirHistorial = abrirHistorial;
window.cerrarHistorial = cerrarHistorial;
window.limpiarHistorial = limpiarHistorial;
window.mostrarHistorial = mostrarHistorial;
window.mostrarConversor = mostrarConversor;
window.actualizarTasas = actualizarTasas;
