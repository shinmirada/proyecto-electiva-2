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
        const exito = yield gestorTasas.actualizarManual();
        if (btnActualizar) {
            if (exito) {
                btnActualizar.innerText = " Actualizado";
                setTimeout(() => {
                    btnActualizar.innerText = " Actualizar Tasas";
                    btnActualizar.disabled = false;
                }, 2000);
            }
            else {
                btnActualizar.innerText = " Error en actualización";
                btnActualizar.disabled = false;
                setTimeout(() => {
                    btnActualizar.innerText = " Actualizar Tasas";
                }, 3000);
            }
        }
    });
}
function convertir() {
    const monto = parseFloat(document.getElementById("cantidadOrigen").value);
    const origen = document.getElementById("monedaOrigen").value;
    const destino = document.getElementById("monedaDestino").value;
    const conversor = new ConversorMoneda(monto, origen, destino);
    if (!conversor.validarEntrada()) {
        document.getElementById("textoResultado").innerText = "Ingresa un monto válido.";
        document.getElementById("tasaResultado").innerText = "";
        return;
    }
    const resultado = conversor.convertir(gestorTasas.obtener());
    document.getElementById("cantidadDestino").value = resultado.toFixed(2);
    const texto = document.getElementById("textoResultado");
    const tasaTxt = document.getElementById("tasaResultado");
    if (resultado > 0) {
        texto.innerText = `${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;
        tasaTxt.innerText = "Conversión realizada con éxito.";
        historial.agregar(`${monto} ${origen} = ${resultado.toFixed(2)} ${destino} (${new Date().toLocaleString()})`);
    }
    else {
        texto.innerText = "No hay tasa para esta conversión.";
        tasaTxt.innerText = "";
    }
}
function mostrarHistorial() {
    const interfazHistorial = document.getElementById("interfaz-historial");
    const interfazConversor = document.getElementById("interfaz-conversor");
    if (interfazHistorial) {
        interfazHistorial.style.display = "block";
    }
    if (interfazConversor) {
        interfazConversor.style.display = "none";
    }
    const lista = document.getElementById("listaHistorialHtml");
    const registros = historial.listar();
    if (registros.length > 0) {
        lista.innerText = registros.join("\n");
    }
    else {
        lista.innerText = "Todavía no hay conversiones.";
    }
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
