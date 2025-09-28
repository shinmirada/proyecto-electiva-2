import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { tasas } from "./models/Tasas.js";
import { Historial } from "./models/Historial.js";
const historial = new Historial();
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
    const resultado = conversor.convertir(tasas);
    document.getElementById("cantidadDestino").value = resultado.toString();
    const texto = document.getElementById("textoResultado");
    const tasaTxt = document.getElementById("tasaResultado");
    if (resultado > 0) {
        texto.innerText = `${monto} ${origen} = ${resultado} ${destino}`;
        tasaTxt.innerText = "Conversión realizada con éxito.";
        historial.agregar(`${monto} ${origen} = ${resultado} ${destino} (${new Date().toLocaleString()})`);
    }
    else {
        texto.innerText = "No hay tasa para esta conversión.";
        tasaTxt.innerText = "";
    }
}
function mostrarHistorial() {
    document.getElementById("interfaz-conversor").style.display = "none";
    document.getElementById("interfaz-historial").style.display = "block";
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
