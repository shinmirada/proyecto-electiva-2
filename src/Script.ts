import { ConversorMoneda } from "./models/ConversorMoneda.js";
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
(window as any).actualizarTasas = actualizarTasas;
