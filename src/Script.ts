import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { tasas } from "./models/Tasas.js";
import { Historial } from "./models/Historial.js";
import type { MonedaCodigo } from "./models/Tipos.js";

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
    texto.innerText = `${monto} ${origen} = ${resultado} ${destino}`;
    tasaTxt.innerText = "Conversión realizada con éxito.";
    historial.agregar(`${monto} ${origen} = ${resultado} ${destino} (${new Date().toLocaleString()})`);

  } else {
    texto.innerText = "No hay tasa para esta conversión.";
    tasaTxt.innerText = "";
  }
}


function mostrarHistorial(): void {
  document.getElementById("interfaz-conversor")!.style.display = "none";
  document.getElementById("interfaz-historial")!.style.display = "block";

  const lista = document.getElementById("listaHistorialHtml") as HTMLElement;
  const registros = historial.listar()

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


(window as any).convertir = convertir;
(window as any).intercambiar = intercambiar;
(window as any).abrirHistorial = abrirHistorial;
(window as any).cerrarHistorial = cerrarHistorial;
(window as any).limpiarHistorial = limpiarHistorial;
(window as any).mostrarHistorial = mostrarHistorial;
(window as any).mostrarConversor = mostrarConversor;
