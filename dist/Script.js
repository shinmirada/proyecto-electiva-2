import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { tasas } from "./models/Tasas.js";
import { Historial } from "./models/Historial.js";
// ✅ Se crea UNA SOLA INSTANCIA que persiste en ambas páginas gracias a localStorage
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
        texto.innerText = `${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;
        tasaTxt.innerText = "Conversión realizada con éxito.";
        // ✅ AQUÍ se guarda en localStorage automáticamente
        historial.agregar(`${monto} ${origen} = ${resultado.toFixed(2)} ${destino} (${new Date().toLocaleString()})`);
    }
    else {
        texto.innerText = "No hay tasa para esta conversión.";
        tasaTxt.innerText = "";
    }
}
function mostrarHistorial() {
    // Solo mostrar si estamos en historial.html
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
// ✅ Exponer todas las funciones al window para que el HTML las pueda usar
window.convertir = convertir;
window.intercambiar = intercambiar;
window.abrirHistorial = abrirHistorial;
window.cerrarHistorial = cerrarHistorial;
window.limpiarHistorial = limpiarHistorial;
window.mostrarHistorial = mostrarHistorial;
window.mostrarConversor = mostrarConversor;
