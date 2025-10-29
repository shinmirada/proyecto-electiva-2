import { ConversorMoneda } from "./models/ConversorMoneda.js";
import { Historial } from "./models/Historial.js";
import { GestorTasas } from "./models/Gestortasas.js";
import { GestorPaises } from "./models/GestorPaises.js";
import type { MonedaCodigo } from "./models/Tipos.js";

/**
 * Instancias principales utilizadas en el sistema.
 * - historial: registra conversiones realizadas.
 * - gestorTasas: maneja tasas de cambio actualizadas.
 * - gestorPaises: obtiene información de países según la moneda.
 */
const historial = new Historial();
const gestorTasas = new GestorTasas();
const gestorPaises = new GestorPaises();

/**
 * Actualiza las tasas de cambio desde la API y cambia el texto del botón
 * para reflejar el estado de la actualización (éxito o error).
 */
async function actualizarTasas(): Promise<void> {
  const btnActualizar = document.getElementById("btnActualizarTasas") as HTMLButtonElement;
  if (btnActualizar) {
    btnActualizar.innerText = "Actualizando...";
    btnActualizar.disabled = true;
  }

  const exito = await gestorTasas.actualizarDesdeAPI();

  if (btnActualizar) {
    if (exito) {
      btnActualizar.innerText = "✅ Actualizado";
      setTimeout(() => {
        btnActualizar.innerText = "Actualizar Tasas";
        btnActualizar.disabled = false;
      }, 2000);
    } else {
      btnActualizar.innerText = "❌ Error al actualizar";
      btnActualizar.disabled = false;
      setTimeout(() => {
        btnActualizar.innerText = "Actualizar Tasas";
      }, 3000);
    }
  }
}

/**
 * Convierte un monto entre dos monedas seleccionadas por el usuario.
 * Valida el monto y actualiza los resultados en pantalla.
 */
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

/**
 * Muestra la interfaz del historial de conversiones y oculta el conversor.
 */
function mostrarHistorial(): void {
  const interfazHistorial = document.getElementById("interfaz-historial");
  const interfazConversor = document.getElementById("interfaz-conversor");

  if (interfazHistorial) interfazHistorial.style.display = "block";
  if (interfazConversor) interfazConversor.style.display = "none";

  const lista = document.getElementById("listaHistorialHtml") as HTMLElement;
  const registros = historial.listar();

  lista.innerText = registros.length > 0 ? registros.join("\n") : "Todavía no hay conversiones.";
}

/**
 * Muestra la interfaz del conversor principal y oculta el historial.
 */
function mostrarConversor(): void {
  (document.getElementById("interfaz-conversor") as HTMLElement).style.display = "block";
  (document.getElementById("interfaz-historial") as HTMLElement).style.display = "none";
}

/**
 * Limpia el historial de conversiones y actualiza la vista.
 */
function limpiarHistorial(): void {
  historial.limpiar();
  mostrarHistorial();
}

/**
 * Intercambia las monedas seleccionadas (origen ↔ destino)
 * y actualiza la información del país mostrado.
 */
function intercambiar(): void {
  const origen = document.getElementById("monedaOrigen") as HTMLSelectElement;
  const destino = document.getElementById("monedaDestino") as HTMLSelectElement;
  const tmp = origen.value;
  origen.value = destino.value;
  destino.value = tmp;
  
  // 🆕 Actualizar información del país después de intercambiar
  alCambiarMoneda();
}

/**
 * Abre la ventana modal con el historial de conversiones.
 */
function abrirHistorial(): void {
  const modal = document.getElementById("modalHistorial") as HTMLElement;
  modal.style.display = "flex";
  mostrarHistorial();
}

/**
 * Cierra la ventana modal del historial.
 */
function cerrarHistorial(): void {
  const modal = document.getElementById("modalHistorial") as HTMLElement;
  modal.style.display = "none";
}

/**
 * Consulta y muestra las tasas de cambio de una moneda seleccionada.
 */
async function consultarTasas(): Promise<void> {
  const selectMoneda = document.getElementById("monedaConsulta") as HTMLSelectElement;
  const contenedorResultados = document.getElementById("resultadosTasas") as HTMLElement;
  const btnConsultar = document.getElementById("btnConsultarTasas") as HTMLButtonElement;

  const moneda = selectMoneda.value as MonedaCodigo;

  if (!moneda) {
    contenedorResultados.innerHTML = '<p style="color: #ff4d4d;">Por favor selecciona una moneda.</p>';
    return;
  }

  try {
    btnConsultar.innerText = "Consultando...";
    btnConsultar.disabled = true;

    const tasas = await gestorTasas.obtenerTasasDeMoneda(moneda);
    
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
      const banderas: Record<string, string> = {
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

  } catch (error) {
    console.error(error);
    contenedorResultados.innerHTML = '<p style="color: #ff4d4d;">Error al obtener las tasas. Intenta nuevamente.</p>';
  } finally {
    btnConsultar.innerText = "🔍 Consultar Tasas";
    btnConsultar.disabled = false;
  }
}

/**
 * Carga dinámicamente la lista de monedas disponibles
 * en el selector de consulta de tasas.
 */
async function inicializarConsultaTasas(): Promise<void> {
  const selectMoneda = document.getElementById("monedaConsulta") as HTMLSelectElement;
  
  if (!selectMoneda) return;

  try {
    const monedas = await gestorTasas.obtenerMonedasDisponibles();
    
    // Limpiar opciones existentes
    selectMoneda.innerHTML = '<option value="">-- Selecciona una moneda --</option>';
    
    // Agregar todas las monedas disponibles
    const banderas: Record<string, string> = {
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
  } catch (error) {
    console.error("Error al cargar monedas:", error);
  }
}

/**
 * Carga todas las monedas disponibles en los selectores
 * del conversor principal y muestra la información del país correspondiente.
 */
async function cargarMonedasConversor(): Promise<void> {
  const selectOrigen = document.getElementById("monedaOrigen") as HTMLSelectElement;
  const selectDestino = document.getElementById("monedaDestino") as HTMLSelectElement;
  
  if (!selectOrigen || !selectDestino) return;

  try {
    const monedas = await gestorTasas.obtenerMonedasDisponibles();
    
    // Guardar valores seleccionados actualmente (por defecto COP y USD)
    const origenActual = selectOrigen.value || "COP";
    const destinoActual = selectDestino.value || "USD";
    
    // Banderas de monedas comunes
    const banderas: Record<string, string> = {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
      'CAD': '🇨🇦', 'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳',
      'COP': '🇨🇴', 'MXN': '🇲🇽', 'BRL': '🇧🇷', 'ARS': '🇦🇷',
      'INR': '🇮🇳', 'KRW': '🇰🇷', 'RUB': '🇷🇺', 'ZAR': '🇿🇦',
      'SGD': '🇸🇬', 'HKD': '🇭🇰', 'NOK': '🇳🇴', 'SEK': '🇸🇪',
      'NZD': '🇳🇿', 'TRY': '🇹🇷', 'PLN': '🇵🇱', 'THB': '🇹🇭'
    };

    // Limpiar opciones existentes
    selectOrigen.innerHTML = '';
    selectDestino.innerHTML = '';

    // Agregar todas las monedas disponibles
    for (const codigo of monedas) {
      const bandera = banderas[codigo] || '🌍';
      
      // Opción para origen
      const optionOrigen = document.createElement('option');
      optionOrigen.value = codigo;
      optionOrigen.textContent = `${codigo} ${bandera}`;
      selectOrigen.appendChild(optionOrigen);
      
      // Opción para destino
      const optionDestino = document.createElement('option');
      optionDestino.value = codigo;
      optionDestino.textContent = `${codigo} ${bandera}`;
      selectDestino.appendChild(optionDestino);
    }

    // Restaurar valores seleccionados
    selectOrigen.value = origenActual;
    selectDestino.value = destinoActual;

    console.log(`✅ Cargadas ${monedas.length} monedas en el conversor`);
    
    // 🆕 Cargar información del país inicial
    await mostrarInfoPais(origenActual);
  } catch (error) {
    console.error("Error al cargar monedas en conversor:", error);
  }
}

/**
 * Muestra la información del país relacionada con la moneda seleccionada.
 */
async function mostrarInfoPais(moneda: MonedaCodigo): Promise<void> {
  const contenedorInfo = document.getElementById("infoPais");
  
  if (!contenedorInfo) return;

  try {
    // Mostrar loader
    contenedorInfo.innerHTML = `
      <div class="info-pais-loader">
        <p>🌍 Cargando información del país...</p>
      </div>
    `;

    const paises = await gestorPaises.obtenerPaisesPorMoneda(moneda);

    if (paises.length === 0) {
      contenedorInfo.innerHTML = `
        <div class="info-pais-error">
          <p>No se encontró información para esta moneda</p>
        </div>
      `;
      return;
    }

    // Tomar el primer país (en caso de que múltiples países usen la misma moneda)
    const pais = paises[0];
    if (!pais) return;

    // Mostrar información del país
    contenedorInfo.innerHTML = `
      <div class="info-pais-card">
        <div class="info-pais-header">
          <img src="${pais.bandera}" alt="Bandera de ${pais.nombre}" class="info-pais-bandera">
          <div class="info-pais-titulo">
            <h3>${pais.nombre}</h3>
            <p class="info-pais-subtitulo">${pais.nombreOficial}</p>
          </div>
        </div>
        <div class="info-pais-detalles">
          <div class="info-pais-item">
            <span class="info-pais-icono">🏛️</span>
            <div>
              <strong>Capital:</strong>
              <p>${pais.capital[0]}</p>
            </div>
          </div>
          <div class="info-pais-item">
            <span class="info-pais-icono">👥</span>
            <div>
              <strong>Población:</strong>
              <p>${gestorPaises.formatearPoblacion(pais.poblacion)}</p>
            </div>
          </div>
          <div class="info-pais-item">
            <span class="info-pais-icono">🌍</span>
            <div>
              <strong>Región:</strong>
              <p>${pais.region} - ${pais.subregion}</p>
            </div>
          </div>
          <div class="info-pais-item">
            <span class="info-pais-icono">🗣️</span>
            <div>
              <strong>Idiomas:</strong>
              <p>${pais.idiomas.slice(0, 3).join(', ')}</p>
            </div>
          </div>
        </div>
        ${paises.length > 1 ? `
          <div class="info-pais-nota">
            <small>💡 Esta moneda es usada por ${paises.length} países</small>
          </div>
        ` : ''}
      </div>
    `;
  } catch (error) {
    console.error("Error al obtener información del país:", error);
    contenedorInfo.innerHTML = `
      <div class="info-pais-error">
        <p>⚠️ No se pudo cargar la información del país</p>
      </div>
    `;
  }
}

/**
 * Maneja el evento al cambiar la moneda de origen.
 * Actualiza la información del país mostrada.
 */
async function alCambiarMoneda(): Promise<void> {
  const selectOrigen = document.getElementById("monedaOrigen") as HTMLSelectElement;
  if (selectOrigen && selectOrigen.value) {
    await mostrarInfoPais(selectOrigen.value as MonedaCodigo);
  }
}

/**
 * Expone las funciones principales al ámbito global
 * para que puedan ser llamadas desde el HTML.
 */
(window as any).convertir = convertir;
(window as any).intercambiar = intercambiar;
(window as any).abrirHistorial = abrirHistorial;
(window as any).cerrarHistorial = cerrarHistorial;
(window as any).limpiarHistorial = limpiarHistorial;
(window as any).mostrarHistorial = mostrarHistorial;
(window as any).mostrarConversor = mostrarConversor;
(window as any).actualizarTasas = actualizarTasas;
(window as any).consultarTasas = consultarTasas;
(window as any).inicializarConsultaTasas = inicializarConsultaTasas;
(window as any).cargarMonedasConversor = cargarMonedasConversor;
(window as any).mostrarInfoPais = mostrarInfoPais;
(window as any).alCambiarMoneda = alCambiarMoneda;
