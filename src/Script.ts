import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { tasas } from "./models/Tasas.js";
import { Historial } from "./models/Historial.js";
import type { MonedaCodigo } from "./models/Tipos.js";

// ✅ Se crea UNA SOLA INSTANCIA que persiste en ambas páginas gracias a localStorage
const historial = new Historial();

function convertir(): void {
  const monto = parseFloat((document.getElementById("cantidadOrigen") as HTMLInputElement).value);
  const origen = (document.getElementById("monedaOrigen") as HTMLSelectElement).value as MonedaCodigo;
  const destino = (document.getElementById("monedaDestino") as HTMLSelectElement).value as MonedaCodigo;

  const conversor = new ConversorMoneda(monto, origen, destino);

  if (!conversor.validarEntrada()) {
    (document.getElementById("textoResultado") as HTMLElement).innerText = "Ingresa un monto válido.";
    (document.getElementById("tasaResultado") as HTMLElement).innerText = "";
    return;
  }

  const resultado = conversor.convertir(tasas);
  (document.getElementById("cantidadDestino") as HTMLInputElement).value = resultado.toString();

  const texto = document.getElementById("textoResultado") as HTMLElement;
  const tasaTxt = document.getElementById("tasaResultado") as HTMLElement;

  if (resultado > 0) {
    texto.innerText = `${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;
    tasaTxt.innerText = "Conversión realizada con éxito.";
    // ✅ AQUÍ se guarda en localStorage automáticamente
    historial.agregar(`${monto} ${origen} = ${resultado.toFixed(2)} ${destino} (${new Date().toLocaleString()})`);
  } else {
    texto.innerText = "No hay tasa para esta conversión.";
    tasaTxt.innerText = "";
  }
}

function mostrarHistorial(): void {
  // Solo mostrar si estamos en historial.html
  const interfazHistorial = document.getElementById("interfaz-historial");
  const interfazConversor = document.getElementById("interfaz-conversor");
  
  if (interfazHistorial) {
    interfazHistorial.style.display = "block";
  }
  if (interfazConversor) {
    interfazConversor.style.display = "none";
  }

  const lista = document.getElementById("listaHistorialHtml") as HTMLElement;
  const registros = historial.listar();

  if (registros.length > 0) {
    lista.innerText = registros.join("\n");
  } else {
    lista.innerText = "Todavía no hay conversiones.";
  }
}

function mostrarConversor(): void {
  document.getElementById("interfaz-conversor")!.style.display = "block";
  document.getElementById("interfaz-historial")!.style.display = "none";
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

// ✅ Exponer todas las funciones al window para que el HTML las pueda usar
(window as any).convertir = convertir;
(window as any).intercambiar = intercambiar;
(window as any).abrirHistorial = abrirHistorial;
(window as any).cerrarHistorial = cerrarHistorial;
(window as any).limpiarHistorial = limpiarHistorial;
(window as any).mostrarHistorial = mostrarHistorial;
(window as any).mostrarConversor = mostrarConversor;
