/**
 * app.js — La pantalla nueva (`/nuevo/`).
 *
 * QUÉ HAY AQUÍ
 *
 * El armazón (barra superior, barra lateral en el ordenador, barra de cinco destinos en el
 * móvil) y las pantallas: «Hoy», «Mis tierras» y «Añadir tierras» (por código del SIGPAC, con
 * ventana del SIGPAC para coger el recinto en el mapa, y trayendo el cuaderno de la Junta).
 *
 * REGLAS QUE SE CUMPLEN AQUÍ
 *
 *  1. Los textos que lee el agricultor **no se escriben aquí**: viven en `modelo.js`
 *     (`textos`), en un solo sitio, y hay una prueba que los revisa contra la lista de
 *     palabras prohibidas del proyecto.
 *  2. Un fallo de la red **no es «no hay nada»**: son estados distintos y se dicen distintos.
 *     Sin cuenta se ofrece entrar; si no llega, volver a intentarlo.
 *  3. Las tierras pueden estar en municipios distintos y no caben en una imagen: por eso hay
 *     selector de municipio, zoom y colores con leyenda. Una tierra sin forma se enseña como
 *     punto en su centro; sin centro ni forma, se dice «sin mapa».
 *  4. Solo se añaden tierras con datos que vienen del SIGPAC o del cuaderno: no se inventa
 *     ninguna forma ni ninguna superficie.
 *  5. La lógica que se puede probar sin navegador está en `modelo.js`, no aquí.
 *
 * Sin compilación: React 18 UMD y `htm` vienen de `/vendor/` (los ficheros oficiales, con su
 * licencia). Donde corre esto no hay Node ni paso de compilación.
 */

import {
  ALTO_MAPA,
  ANCHO_MAPA,
  CLAVE_TOKEN,
  agruparLoQueFalta,
  agruparPorDias,
  agruparPorMunicipio,
  ajustarBbox,
  avisoDeLaNota,
  avisoSinForma,
  bboxDeMunicipio,
  bboxDelConjunto,
  cajaDeLosRecintos,
  calcularTotales,
  camposInicialesDelSigpac,
  claveDeTipo,
  colorDeTierra,
  colorDeUso,
  comparativaDeAnios,
  cuerpoDeBusquedaPorMunicipio,
  cuerpoDeBusquedaPorReferencia,
  cuerpoDeLaFactura,
  cuerpoDeLaFertilizacion,
  cuerpoDeLaSiembra,
  cuerpoDeLaSiembraDelCuaderno,
  cuerpoDelAbono,
  cuerpoDelApunte,
  cuerpoDelContorno,
  cuerpoDelTratamiento,
  csvDeTrabajos,
  datosDelPanel,
  cuentaDeUnaSeccion,
  decidirEstado,
  destinoActivo,
  destinoDeLaSeccion,
  dosisMaximaEnTexto,
  elAperoSeGuardaEnLabores,
  etiquetaCampana,
  empezarPorLoPrimero,
  empezarPorLoQueBloquea,
  primerBloqueoDeLoQueFalta,
  actualizadasDeLosContornos,
  apuntesGuardadosAqui,
  avisoEnviado,
  avisoSinCobertura,
  etiquetaDeProvinciaCache,
  etiquetaDelRecintoEnElMapa,
  etiquetaDeTrabajo,
  fechaDeHoyISO,
  fechaValidezEnTexto,
  hashDeLaVista,
  vistaDelHash,
  fechaDePlazo,
  apuntesPendientes,
  encolarApunte,
  quitarApunteDeLaCola,
  faltasDelCuaderno,
  faltasRellenables,
  filtrarPorTipo,
  filtrarTierras,
  formateaNumero,
  importeEnTexto,
  leyendaDe,
  lineasDeLosContornos,
  mandarLosApuntesPendientes,
  mensajesDeLaRespuesta,
  mesEnPalabras,
  municipioDeTierra,
  nombreDeMes,
  normalizaAbonos,
  normalizaAperos,
  normalizaCacheSigpac,
  normalizaCalendario,
  normalizaImportacion,
  normalizaMunicipios,
  normalizaProductos,
  normalizaPropuestaDeFactura,
  normalizaQueFalta,
  normalizaResumen,
  normalizaSemillas,
  normalizaTierra,
  normalizaTrabajo,
  normalizaTrabajos,
  numeroDe,
  proyeccionDeAnillo,
  proyeccionDePunto,
  puedeUsarseElRecinto,
  puntoDelMapa,
  queryDeTrabajos,
  recintoElegido,
  recintosConPuntos,
  referenciasDeTexto,
  rejillaDelMes,
  relacionDeTipos,
  resumenDeLoQueFalta,
  seccionesRellenables,
  tecnicasDeLoQueFalta,
  textoDeLasTecnicas,
  puedeAbrirLaTierraActualizada,
  riquezaEnTexto,
  rutaDeAnillo,
  rutaDeLaAplicacion,
  rutaDeLosContornos,
  sinCodigosDeLosContornos,
  sinMapa,
  sumaDeHectareas,
  textoDeLoGuardado,
  textos,
  textoDeTotales,
  textoRelleno,
  totalDeLaAplicacion,
  totalesDeTrabajos,
  textoDeFaltasSinListar,
  textoDeLasRellenables,
  textoDelAvisoDeBloqueo,
  urlDeLaApi,
  urlDeMiniatura,
  urlDelMapa,
} from "./modelo.js";

const html = htm.bind(React.createElement);
const { useEffect, useMemo, useRef, useState } = React;

const RUTA_HOY = "/api/nuevo/hoy";
const RUTA_TIERRAS = "/api/nuevo/tierras";
const RUTA_RESUMEN = "/api/nuevo/resumen";
const RUTA_QUE_FALTA = "/api/nuevo/que-falta";
const RUTA_BUSCAR = "/api/sigpac/buscar";
const RUTA_PARCELA_UNA = "/api/parcelas/desde-sigpac";
const RUTA_PARCELAS_VARIAS = "/api/parcelas/desde-sigpac/varias";
const RUTA_MAPA_PUNTO = "/api/mapa/punto";
const RUTA_IMPORTAR = "/api/nuevo/importar-cuaderno";
const RUTA_CUADERNO_LEER = "/api/cuaderno-cyl/leer";
const RUTA_CUADERNO_IMPORTAR = "/api/cuaderno-cyl/importar";
const RUTA_TIERRA = (id) => `/api/nuevo/tierra/${id}`;
const RUTA_CALENDARIO = (desde, hasta) => `/api/nuevo/calendario?desde=${desde}&hasta=${hasta}`;
const RUTA_TRABAJOS = (tipo) => (tipo ? `/api/nuevo/trabajos?tipo=${encodeURIComponent(tipo)}` : "/api/nuevo/trabajos");
const RUTA_FACTURAS = "/api/facturas";
const RUTA_FACTURAS_LEER = "/api/facturas/leer";
const RUTA_FACTURA_FICHERO = (id) => `/api/facturas/${id}/fichero`;
const RUTA_DOCUMENTOS = "/api/documentos";
const RUTA_DOCUMENTO_FICHERO = (id) => `/api/documentos/${id}/fichero`;
const RUTA_MAPA_TIERRA = (id, ancho, alto) => `/api/mapa/tierra/${id}.png?ancho=${ancho}&alto=${alto}`;
const RUTA_OPCIONES_DE_TRABAJOS = "/api/trabajos/opciones";
const RUTA_QUE_FALTA_DE_TRABAJOS = "/api/trabajos/que-falta";
const RUTA_LABORES = "/api/labores";
const RUTA_TRABAJO_HECHO = "/api/trabajos";
const RUTA_OPENAPI = "/openapi.json";
const RUTA_PRODUCTOS = "/api/productos";
const RUTA_SEMILLAS = "/api/semillas";
const RUTA_SIEMBRAS = "/api/siembras";
const RUTA_FERTILIZANTES = "/api/fertilizantes";
const RUTA_TRATAMIENTOS = "/api/tratamientos";
const RUTA_FERTILIZACIONES = "/api/fertilizaciones";
const RUTA_MUNICIPIOS = "/api/municipios";
const RUTA_CACHE_SIGPAC = "/api/sigpac/cache";
const RUTA_PARCELA = (id) => `/api/parcelas/${id}`;
const RUTA_CONTORNO = (id) => `/api/parcelas/${id}/contorno`;

/** Los límites del servidor para una zona del mapa (grados). Él los vuelve a mirar. */
const LADO_MINIMO = 0.0008;
const LADO_MAXIMO = 0.5;
const PASO_DE_ZOOM = 0.6;

// ---------------------------------------------------------------- iconos

function Icono({ nombre, tamano = 24 }) {
  const comun = {
    width: tamano,
    height: tamano,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
  };

  switch (nombre) {
    case "hoy":
      return html`<svg ...${comun}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V21h13V9.5" /><path d="M10 21v-6h4v6" /></svg>`;
    case "tierras":
      return html`<svg ...${comun}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14" /><path d="M15 6v14" /></svg>`;
    case "apuntar":
      return html`<svg ...${comun}><path d="M4 20l4-1 10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 15.5 4 20Z" /></svg>`;
    case "cuaderno":
      return html`<svg ...${comun}><path d="M12 6c-2-1.5-4.5-2-7-2v14c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2V4c-2.5 0-5 .5-7 2Z" /><path d="M12 6v14" /></svg>`;
    case "puntos":
      return html`<svg ...${comun}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>`;
    case "campana":
      return html`<svg ...${comun}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>`;
    case "pac":
      return html`<svg ...${comun}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="m9 14 2 2 4-4" /></svg>`;
    case "documentos":
      return html`<svg ...${comun}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></svg>`;
    case "persona":
      return html`<svg ...${comun}><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="8" r="3.5" /><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" /><path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8" /></svg>`;
    case "mas":
      return html`<svg ...${comun}><path d="M12 5v14M5 12h14" /></svg>`;
    case "menos":
      return html`<svg ...${comun}><path d="M5 12h14" /></svg>`;
    case "centrar":
      return html`<svg ...${comun}><circle cx="12" cy="12" r="6.5" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" /></svg>`;
    case "aviso":
      return html`<svg ...${comun}><path d="M12 4 3 20h18L12 4Z" /><path d="M12 10v3" /><path d="M12 16.5h.01" /></svg>`;
    case "cerrar":
      return html`<svg ...${comun}><path d="m6 6 12 12M18 6 6 18" /></svg>`;
    case "buscar":
      return html`<svg ...${comun}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>`;
    case "subir":
      return html`<svg ...${comun}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>`;
    case "anadir":
      return html`<svg ...${comun}><path d="M12 5v14M5 12h14" /></svg>`;
    case "comprobar":
      return html`<svg ...${comun}><path d="m5 12.5 4.5 4.5L19 7" /></svg>`;
    default:
      return null;
  }
}

// ---------------------------------------------------------------- puertas

function leerToken() {
  try {
    return window.localStorage.getItem(CLAVE_TOKEN) || "";
  } catch (fallo) {
    return "";
  }
}

function borrarToken() {
  try {
    window.localStorage.removeItem(CLAVE_TOKEN);
  } catch (fallo) {
    /* Si el navegador no deja tocar el almacén, se sigue: se pedirá entrar otra vez. */
  }
}

/**
 * Una llamada al servidor con el vale. Devuelve el estado, no lanza: la pantalla decide qué
 * enseñar, y un fallo de red nunca se disfraza de «no hay nada».
 */
async function pedir(ruta, opciones = {}) {
  const token = leerToken();
  if (!token) return { estado: "sin-permiso" };
  const cabeceras = { ...(opciones.headers || {}), Authorization: `Bearer ${token}` };
  let respuesta;
  try {
    respuesta = await fetch(urlDeLaApi(ruta), { ...opciones, headers: cabeceras });
  } catch (fallo) {
    return { estado: "error" };
  }
  if (respuesta.status === 401 || respuesta.status === 403) {
    borrarToken();
    return { estado: "sin-permiso" };
  }
  if (respuesta.status === 404 || respuesta.status === 405) return { estado: "no-disponible" };
  if (!respuesta.ok) {
    // El servidor escribe sus avisos en palabras de agricultor: se recogen para poder enseñarlos.
    const cuerpo = await respuesta.json().catch(() => null);
    return { estado: "error", codigo: respuesta.status, detalle: cuerpo };
  }
  try {
    return { estado: "ok", datos: await respuesta.json() };
  } catch (fallo) {
    return { estado: "error" };
  }
}

/**
 * Como `pedir`, pero **también lee el aviso de un 404, 409 o 422**. Esta pantalla los necesita:
 * el 404 de los contornos no es «no está en la pantalla nueva», es «el mapa de esa provincia no
 * está descargado», y eso hay que decírselo al agricultor, no callarlo.
 */
async function pedirConDetalle(ruta, opciones = {}) {
  const token = leerToken();
  if (!token) return { estado: "sin-permiso" };
  const cabeceras = { ...(opciones.headers || {}), Authorization: `Bearer ${token}` };
  let respuesta;
  try {
    respuesta = await fetch(urlDeLaApi(ruta), { ...opciones, headers: cabeceras });
  } catch (fallo) {
    return { estado: "error" };
  }
  if (respuesta.status === 401 || respuesta.status === 403) {
    borrarToken();
    return { estado: "sin-permiso" };
  }
  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) return { estado: "error", codigo: respuesta.status, detalle: cuerpo };
  return { estado: "ok", datos: cuerpo };
}

function conCuerpoJson(cuerpo) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  };
}

function cuerpoDeLaTierra(actual, cambios) {
  return {
    alias: cambios.alias ?? actual.alias,
    ref_sigpac: actual.ref_sigpac,
    provincia: actual.provincia ?? "",
    municipio: actual.municipio ?? "",
    codigo_ine: actual.codigo_ine,
    poligono: actual.poligono,
    numero_parcela: actual.numero_parcela,
    numero_recinto: actual.numero_recinto,
    agregado: actual.agregado ?? 0,
    zona: actual.zona ?? 0,
    referencia_catastral: actual.referencia_catastral,
    superficie_ha: cambios.superficie_ha,
    superficie_oficial: actual.superficie_oficial,
    uso_sigpac: actual.uso_sigpac,
    sistema: actual.sistema,
    pendiente_pct: actual.pendiente_pct,
    masa_agua_cerca: actual.masa_agua_cerca,
    captacion_consumo_humano: actual.captacion_consumo_humano,
    zona_vulnerable_nitratos: actual.zona_vulnerable_nitratos,
  };
}

/**
 * Corregir el nombre y la superficie de una tierra. Se lee la tierra entera primero porque el
 * servidor guarda lo que le llega: mandar solo el nombre borraría el resto. La forma del trozo
 * no se manda y el servidor no la deja tocar.
 */
async function guardarTierra(id, cambios) {
  const leida = await pedir(`/api/parcelas/${id}`);
  if (leida.estado !== "ok") return leida;
  return pedir(`/api/parcelas/${id}`, {
    ...conCuerpoJson(cuerpoDeLaTierra(leida.datos, cambios)),
    method: "PUT",
  });
}

/** Sube el cuaderno y devuelve lo leído y lo importado, en una llamada o en dos. */
async function subirCuaderno(fichero) {
  const token = leerToken();
  if (!token) return { estado: "sin-permiso" };

  const formulario = new FormData();
  formulario.append("fichero", fichero);

  let respuesta;
  try {
    respuesta = await fetch(urlDeLaApi(RUTA_IMPORTAR), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formulario,
    });
  } catch (fallo) {
    return { estado: "error" };
  }

  if (respuesta.status === 401 || respuesta.status === 403) return { estado: "sin-permiso" };
  if (respuesta.status !== 404 && respuesta.status !== 405) {
    if (!respuesta.ok) return { estado: "error" };
    const datos = await respuesta.json().catch(() => null);
    return { estado: "ok", datos, deUnaVez: true };
  }

  // La puerta de un paso todavía no está: se lee y se importa, que es lo mismo en dos pasos.
  const leer = new FormData();
  leer.append("fichero", fichero);
  const leidoRespuesta = await fetch(urlDeLaApi(RUTA_CUADERNO_LEER), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: leer,
  }).catch(() => null);
  if (!leidoRespuesta || !leidoRespuesta.ok) {
    return { estado: leidoRespuesta && (leidoRespuesta.status === 401 || leidoRespuesta.status === 403) ? "sin-permiso" : "error" };
  }
  const leido = await leidoRespuesta.json();

  const importar = new FormData();
  importar.append("fichero", fichero);
  const importadoRespuesta = await fetch(urlDeLaApi(RUTA_CUADERNO_IMPORTAR), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: importar,
  }).catch(() => null);
  if (!importadoRespuesta || !importadoRespuesta.ok) {
    return { estado: importadoRespuesta && (importadoRespuesta.status === 401 || importadoRespuesta.status === 403) ? "sin-permiso" : "error" };
  }
  const importado = await importadoRespuesta.json();
  return { estado: "ok", datos: { leido, importado }, deUnaVez: false };
}

// ---------------------------------------------------------------- carga

/**
 * Trae una pantalla y dice en qué estado está. El estado no se queda en «cargando» para
 * siempre: cada intento empieza de cero, y un 401 o un fallo de red se dicen distinto.
 */
function usarPantalla(ruta, activa) {
  const [conToken, setConToken] = useState(Boolean(leerToken()));
  const [estado, setEstado] = useState("cargando");
  const [datos, setDatos] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!activa) return undefined;

    const token = leerToken();
    setConToken(Boolean(token));
    if (!token) {
      setEstado("sin-permiso");
      setDatos(null);
      return undefined;
    }

    let vivo = true;
    const control = new AbortController();
    setEstado("cargando");

    fetch(urlDeLaApi(ruta), { headers: { Authorization: `Bearer ${token}` }, signal: control.signal })
      .then(async (respuesta) => {
        if (!vivo) return;
        if (respuesta.status === 401 || respuesta.status === 403) {
          borrarToken();
          setConToken(false);
          setEstado("sin-permiso");
          setDatos(null);
          return;
        }
        if (!respuesta.ok) {
          // El cuerpo del «no» trae los avisos en palabras de agricultor: se guardan para la pantalla.
          const cuerpo = await respuesta.json().catch(() => null);
          if (!vivo) return;
          setDetalle(cuerpo);
          setEstado(respuesta.status === 404 || respuesta.status === 405 ? "no-disponible" : "error");
          return;
        }
        const cuerpo = await respuesta.json();
        if (!vivo) return;
        setDatos(cuerpo);
        setDetalle(null);
        setEstado("listo");
      })
      .catch((fallo) => {
        if (!vivo || fallo.name === "AbortError") return;
        setEstado("error");
      });

    return () => {
      vivo = false;
      control.abort();
    };
  }, [ruta, activa, intento]);

  return { estado, datos, detalle, conToken, reintentar: () => setIntento((n) => n + 1) };
}

function inicialesDe(nombre) {
  const palabras = String(nombre || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!palabras.length) return "";
  const primera = palabras[0].charAt(0);
  const segunda = palabras.length > 1 ? palabras[palabras.length - 1].charAt(0) : "";
  return (primera + segunda).toUpperCase();
}

function fechaDe(valor) {
  if (!valor) return "";
  const partes = String(valor).slice(0, 10).split("-");
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return String(valor);
}

/** Acercar o alejar sin pasarse de lo que el servidor puede dibujar. */
function zoomSobre(caja, factor) {
  const nueva = ajustarBbox(caja, factor);
  if (!nueva) return caja;
  const lado = Math.max(nueva[2] - nueva[0], nueva[3] - nueva[1]);
  if (lado < LADO_MINIMO || lado > LADO_MAXIMO) return caja;
  return nueva;
}

/** Una caja que el servidor del mapa acepte: si la finca es muy grande, se abre por una parte. */
function cajaQueSePuedePedir(caja) {
  if (!caja) return null;
  const lado = Math.max(caja[2] - caja[0], caja[3] - caja[1]);
  if (lado <= LADO_MAXIMO) return caja;
  return ajustarBbox(caja, LADO_MAXIMO / lado);
}

function cajaDeLasTierras(tierras, municipios) {
  const conAnillo = (tierras || []).find((tierra) => Array.isArray(tierra.anillo) && tierra.anillo.length >= 3);
  if (conAnillo) {
    const lons = conAnillo.anillo.map((punto) => punto[0]);
    const lats = conAnillo.anillo.map((punto) => punto[1]);
    return cajaQueSePuedePedir([Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]);
  }
  return cajaQueSePuedePedir(bboxDelConjunto(municipios || []));
}

// ---------------------------------------------------------------- estados

function EstadoCargando({ mensaje }) {
  // **Un esqueleto, no una pantalla en blanco** (encargo de UI, 13/11/2026). Antes solo se veía
  // una frase y, si la respuesta tardaba, el contenido aparecía de golpe y empujaba lo de abajo.
  // El esqueleto ocupa el sitio desde el primer momento, así que no hay salto; el texto sigue
  // siendo el que anuncia qué se está trayendo y se lee con el lector de pantalla.
  return html`<div className="estado estado--cargando" role="status" aria-live="polite" aria-busy="true">
    <p className="estado__texto">${mensaje}</p>
    <div className="esqueleto" aria-hidden="true">
      <div className="esqueleto__titulo"></div>
      <div className="esqueleto__linea"></div>
      <div className="esqueleto__linea esqueleto__linea--corta"></div>
      <div className="esqueleto__bloque"></div>
      <div className="esqueleto__bloque"></div>
    </div>
  </div>`;
}

function EstadoFallo({ mensaje, alReintentar }) {
  return html`<div className="estado estado--fallo" role="alert">
    <p className="estado__texto">${mensaje}</p>
    <button type="button" className="boton" data-reintentar onClick=${alReintentar}>${textos.comun.reintentar}</button>
  </div>`;
}

function EstadoSinPermiso({ mensaje }) {
  return html`<div className="estado">
    <p className="estado__texto">${mensaje}</p>
    <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
  </div>`;
}

function EstadoVacio({ mensaje, textoBoton }) {
  return html`<div className="estado">
    <p className="estado__texto">${mensaje}</p>
    <a className="boton boton--principal" data-traer-tierras href="/">${textoBoton}</a>
  </div>`;
}

function EstadoNoDisponible({ alReintentar }) {
  return html`<div className="estado">
    <p className="estado__texto">${textos.comun.todaviaNo}</p>
    <div className="estado__acciones">
      <button type="button" className="boton" data-reintentar onClick=${alReintentar}>${textos.comun.reintentar}</button>
      <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- armazón

/**
 * **La confirmación de lo guardado, persistente** (revisión externa, 13/11/2026): dice cuántos
 * apuntes hay guardados y cuántos esperan para enviarse. No es un aviso que se va: es el estado.
 */
function EstadoDeLoGuardado({ guardados = 0, pendientes = 0, demo = false }) {
  return html`<p
    className="cuaderno__guardado"
    role="status"
    data-cuaderno-guardado
    data-cuaderno-guardados=${guardados}
    data-cuaderno-pendientes=${pendientes}
  >${textoDeLoGuardado({ guardados, pendientes, demo })}</p>`;
}

function BarraDeConexion({ sinCobertura, pendientes, alEnviar, enviando, mensaje, demo = false }) {
  // **El estado de la cobertura y la cola, en un solo sitio y siempre a la vista** (13/11/2026).
  // Sin cobertura en el campo no es un error: es lo normal. Se dice qué pasa y qué puede hacer,
  // sin alarma y sin ofrecer un botón que no va a poder funcionar.
  if (!sinCobertura && pendientes === 0 && !mensaje) return null;
  const textoDeLaCola = pendientes === 1
    ? textos.comun.pendienteDeEnviar
    : textoRelleno(textos.comun.pendientesDeEnviar, { n: pendientes });
  return html`<div
    className=${sinCobertura ? "aviso-conexion-global aviso-conexion-global--sin" : "aviso-conexion-global"}
    role="status"
    aria-live="polite"
    data-aviso-conexion=${sinCobertura ? "sin-cobertura" : "pendiente"}
  >
    ${sinCobertura
      ? html`<p className="aviso-conexion-global__texto">${avisoSinCobertura(demo)}</p>`
      : null}
    ${mensaje
      ? html`<p className="aviso-conexion-global__mensaje" data-aviso-envio>${mensaje}</p>`
      : null}
    ${pendientes > 0
      ? html`<div className="aviso-conexion-global__cola" data-aviso-pendientes=${pendientes}>
          <p className="aviso-conexion-global__texto">${textoDeLaCola}</p>
          <button
            type="button"
            className="boton"
            data-aviso-enviar
            disabled=${sinCobertura || enviando}
            onClick=${alEnviar}
          >
            ${enviando ? textos.comun.enviando : textos.comun.enviarAhora}
          </button>
        </div>`
      : null}
  </div>`;
}

function BarraSuperior({ finca, campana, cuenta, sinCobertura }) {
  const nombreFinca = (finca && finca.nombre) || textos.app.nombre;
  const partesCampana = [etiquetaCampana(campana), finca && finca.municipio].filter(Boolean);
  const claseConexion = sinCobertura ? "aviso-conexion aviso-conexion--sin" : "aviso-conexion";
  const textoConexion = sinCobertura ? textos.app.sinCobertura : textos.app.conCobertura;
  const iniciales = inicialesDe(cuenta && cuenta.nombre);
  const contenidoCuenta = iniciales || html`<${Icono} nombre="persona" tamano=${20} />`;

  return html`<header className="barra-superior">
    <div className="barra-superior__finca">
      <span className="barra-superior__nombre">${nombreFinca}</span>
      <span className="barra-superior__campana">${partesCampana.join(" · ")}</span>
    </div>
    <div className="barra-superior__derecha">
      <span className=${claseConexion}>
        <span className="punto" aria-hidden="true"></span>
        ${textoConexion}
      </span>
      <a className="cuenta" href="/" aria-label=${textos.nav.cuenta}>${contenidoCuenta}</a>
    </div>
  </header>`;
}

function claseNav(activa) {
  return activa ? "nav__enlace nav__enlace--activo" : "nav__enlace";
}

function BarraLateral({ vista, ir }) {
  const esTierras = vista === "tierras" || vista === "alta" || vista === "tierra";
  const claseHoy = claseNav(vista === "hoy");
  const claseTierras = claseNav(esTierras);
  const claseApuntar = claseNav(vista === "apuntar");
  const claseCalendario = claseNav(vista === "calendario");
  const claseTrabajos = claseNav(vista === "trabajos");
  const claseProductos = claseNav(vista === "productos");
  const claseCuaderno = claseNav(vista === "cuaderno");
  const claseFacturas = claseNav(vista === "facturas");

  return html`<nav className="barra-lateral" data-nav-lateral aria-label="Secciones">
    <p className="barra-lateral__titulo">${textos.app.nombre}</p>
    <div className="nav">
      <button type="button" className=${claseHoy} data-destino="hoy" onClick=${() => ir("hoy")} aria-current=${vista === "hoy" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="hoy" /></span>
        ${textos.nav.hoy}
      </button>
      <button type="button" className=${claseTierras} data-destino="tierras" onClick=${() => ir("tierras")} aria-current=${esTierras ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="tierras" /></span>
        ${textos.nav.tierras}
      </button>
      <button type="button" className=${claseApuntar} data-destino="apuntar" onClick=${() => ir("apuntar")} aria-current=${vista === "apuntar" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="apuntar" /></span>
        ${textos.nav.apuntar}
      </button>
      <button type="button" className=${claseCalendario} data-destino="calendario" onClick=${() => ir("calendario")} aria-current=${vista === "calendario" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="campana" /></span>
        ${textos.nav.calendario}
      </button>
      <button type="button" className=${claseTrabajos} data-destino="trabajos" onClick=${() => ir("trabajos")} aria-current=${vista === "trabajos" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="cuaderno" /></span>
        ${textos.nav.trabajos}
      </button>
      <button type="button" className=${claseProductos} data-destino="productos" onClick=${() => ir("productos")} aria-current=${vista === "productos" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="pac" /></span>
        ${textos.nav.productos}
      </button>
      <button type="button" className=${claseFacturas} data-destino="facturas" onClick=${() => ir("facturas")} aria-current=${vista === "facturas" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="documentos" /></span>
        ${textos.nav.facturas}
      </button>
      <button type="button" className=${claseCuaderno} data-destino="cuaderno" onClick=${() => ir("cuaderno")} aria-current=${vista === "cuaderno" ? "page" : undefined}>
        <span className="nav__icono"><${Icono} nombre="cuaderno" /></span>
        ${textos.nav.cuaderno}
      </button>
      <a className="nav__enlace" href="/">
        <span className="nav__icono"><${Icono} nombre="pac" /></span>
        ${textos.nav.pac}
      </a>
      <a className="nav__enlace" href="/">
        <span className="nav__icono"><${Icono} nombre="documentos" /></span>
        ${textos.nav.documentos}
      </a>
      <a className="nav__enlace" href="/">
        <span className="nav__icono"><${Icono} nombre="persona" /></span>
        ${textos.mas.ajustes}
      </a>
    </div>
  </nav>`;
}

function claseDestino(activa, base) {
  return activa ? `${base} ${base}--activo` : base;
}

function BarraInferior({ vista, ir }) {
  // **Dónde estás, marcado** (revisión externa, 13/11/2026): la barra marca el destino activo
  // también en Cuaderno y en Productos, que antes no marcaban nada.
  const activo = destinoActivo(vista);
  const clase = (clave) => claseDestino(activo === clave, "barra-inferior__destino");

  return html`<nav className="barra-inferior" data-nav-inferior aria-label="Los cinco destinos">
    <button type="button" className=${clase("hoy")} data-destino="hoy" onClick=${() => ir("hoy")} aria-current=${activo === "hoy" ? "page" : undefined}>
      <${Icono} nombre="hoy" />
      ${textos.nav.hoy}
    </button>
    <button type="button" className=${clase("tierras")} data-destino="tierras" onClick=${() => ir("tierras")} aria-current=${activo === "tierras" ? "page" : undefined}>
      <${Icono} nombre="tierras" />
      ${textos.nav.tierras}
    </button>
    <button type="button" className="barra-inferior__apuntar" data-destino="apuntar" aria-label=${textos.nav.apuntar} onClick=${() => ir("apuntar")} aria-current=${activo === "apuntar" ? "page" : undefined}>
      <${Icono} nombre="apuntar" tamano=${20} />
      ${textos.nav.apuntar}
    </button>
    <button type="button" className=${clase("calendario")} data-destino="calendario" onClick=${() => ir("calendario")} aria-current=${activo === "calendario" ? "page" : undefined}>
      <${Icono} nombre="campana" />
      ${textos.nav.calendario}
    </button>
    <button type="button" className=${clase("mas")} data-destino="mas" onClick=${() => ir("mas")} aria-current=${activo === "mas" ? "page" : undefined}>
      <${Icono} nombre="puntos" />
      ${textos.nav.mas}
    </button>
  </nav>`;
}

// ---------------------------------------------------------------- Hoy

function BloqueQueFalta({ estado, lista, alReintentar }) {
  if (estado === "cargando") {
    return html`<section className="tarjeta" aria-labelledby="que-falta-titulo">
      <h2 className="tarjeta__titulo" id="que-falta-titulo">${textos.hoy.faltaCuaderno}</h2>
      <p className="estado__texto">${textos.comun.cargando}</p>
    </section>`;
  }
  if (estado === "error" || estado === "no-disponible") {
    return html`<section className="tarjeta" aria-labelledby="que-falta-titulo">
      <h2 className="tarjeta__titulo" id="que-falta-titulo">${textos.hoy.faltaCuaderno}</h2>
      <p className="estado__texto">${textos.comun.todaviaNo}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${alReintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </section>`;
  }
  if (estado === "sin-permiso") {
    return html`<section className="tarjeta" aria-labelledby="que-falta-titulo">
      <h2 className="tarjeta__titulo" id="que-falta-titulo">${textos.hoy.faltaCuaderno}</h2>
      <p className="estado__texto">${textos.comun.sinPermiso}</p>
      <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
    </section>`;
  }

  const filas = lista.map((fila, indice) => html`<li className="que-falta__fila" key=${`falta-${indice}`}>
    <span className="que-falta__que">${fila.que}</span>
    <span className="que-falta__donde">${fila.donde || textos.hoy.abrirAppVieja}</span>
  </li>`);
  const contenido = lista.length
    ? html`<ul className="que-falta" data-que-falta=${lista.length}>${filas}</ul>`
    : html`<div data-que-falta="0"><p className="estado__texto">${textos.hoy.queFaltaVacio}</p></div>`;

  return html`<section className="tarjeta" aria-labelledby="que-falta-titulo">
    <h2 className="tarjeta__titulo" id="que-falta-titulo">${textos.hoy.faltaCuaderno}</h2>
    ${contenido}
    <a className="boton" href="/">${textos.hoy.abrirAppVieja}</a>
  </section>`;
}

function VistaHoy({ estadoVista, datos, alReintentar, resumen, queFalta, alApuntar }) {
  if (estadoVista === "cargando") return html`<${EstadoCargando} mensaje=${textos.hoy.cargando} />`;
  if (estadoVista === "error") return html`<${EstadoFallo} mensaje=${textos.hoy.fallo} alReintentar=${alReintentar} />`;
  if (estadoVista === "sin-permiso") return html`<${EstadoSinPermiso} mensaje=${textos.hoy.sinPermiso} />`;

  const tierras = (datos && datos.tierras) || { n: 0, ha: 0 };
  const ultimos = ((datos && datos.ultimos) || []).slice(0, 5);
  const nTierras = tierras.n === null || tierras.n === undefined ? 0 : tierras.n;
  const haDeLaFinca = tierras.ha === null || tierras.ha === undefined ? null : tierras.ha;
  const plantillaDelContador = haDeLaFinca === null ? textos.hoy.contadorSinHa : textos.hoy.contador;
  const contador = textoRelleno(plantillaDelContador, {
    n: nTierras,
    ha: haDeLaFinca === null ? "" : formateaNumero(haDeLaFinca),
  });

  const filas = ultimos.map((fila, indice) => {
    const tierra = fila.tierra || "";
    const detalle = fila.tipo ? `${tierra} · ${fila.tipo}` : tierra;
    return html`<li className="lista-ultimos__fila" key=${`ultimo-${indice}`}>
      <span className="lista-ultimos__fecha">${fechaDe(fila.fecha)}</span>
      <span>
        <span className="lista-ultimos__titulo">${fila.titulo || ""}</span>
        <span className="lista-ultimos__tierra">${detalle}</span>
      </span>
    </li>`;
  });

  const vacio = html`<div data-ultimos>
    <p className="estado__texto">${textos.hoy.vacio}</p>
    <p><button type="button" className="boton" data-accion="apuntar-vacio" onClick=${alApuntar}>${textos.hoy.vacioBoton}</button></p>
  </div>`;

  const lista = html`<ul className="lista-ultimos" data-ultimos=${ultimos.length}>${filas}</ul>`;

  const contable = normalizaResumen(resumen.estado === "listo" ? resumen.datos : null);
  const falta = normalizaQueFalta(queFalta.estado === "listo" ? queFalta.datos : null);
  // **Una sola verdad para el cuaderno** (13/11/2026). Antes la tarjeta decía «faltan 3 cosas»
  // —lo que contesta `/api/nuevo/resumen`— y debajo la lista decía «No falta nada para el
  // cuaderno» —lo que contesta `/api/nuevo/que-falta`—: dos avisos contrarios en la misma
  // pantalla, y el agricultor sin saber a cuál creer. Manda la lista, que es la que dice qué
  // falta y dónde se arregla; la tarjeta repite esa misma cuenta y no enseña la nota del resumen
  // cuando la lista dice que no falta nada (`faltasDelCuaderno`).
  const cuentaDelCuaderno = faltasDelCuaderno(
    queFalta.estado === "listo" ? queFalta.datos : null,
    resumen.estado === "listo" ? resumen.datos : null,
  );
  // `faltan === null` quiere decir «no lo sé»: ni cero ni «completo». Se dice y el bloque de «qué
  // falta» ofrece reintentar. Un cero inventado sobre una obligación legal no es un dato.
  const seSabe = cuentaDelCuaderno.faltan !== null;
  const cuantasFaltan = seSabe ? cuentaDelCuaderno.faltan : 0;
  const textoDelCuaderno = !seSabe
    ? textos.comun.noSeSabeQueFalta
    : cuantasFaltan === 0
      ? textos.cuaderno.completo
      : cuantasFaltan === 1
        ? textos.cuaderno.faltaUna
        : textoRelleno(textos.cuaderno.faltan, { n: cuantasFaltan });
  const mostrarQueFalta = queFalta.estado !== "listo" || cuantasFaltan > 0 || !seSabe;

  return html`<div className="pantalla-hoy">
    <header className="pagina__cabecera" data-titulo=${textos.hoy.titulo}>
      <h1 className="pagina__titulo">${textos.hoy.titulo}</h1>
      <p className="pagina__dato" data-contador-tierras=${contador}>${contador}</p>
    </header>

    <button type="button" className="boton boton--principal boton--grande" data-accion="apuntar" onClick=${alApuntar}>
      <${Icono} nombre="apuntar" />
      ${textos.hoy.accion}
    </button>

    <div className="tarjetas">
      <article className="tarjeta-dato" data-resumen-gastos=${contable.gastos.importe || textos.tierras.panel.noConsta}>
        <h2 className="tarjeta-dato__titulo">${textos.hoy.gastos}</h2>
        <p className="tarjeta-dato__cifra">${contable.gastos.importe || textos.tierras.panel.noConsta}</p>
        <p className="tarjeta-dato__nota">${contable.gastos.nota || textos.tierras.panel.noConsta}</p>
      </article>
      <article className="tarjeta-dato" data-resumen-ventas=${contable.ventas.importe || textos.tierras.panel.noConsta}>
        <h2 className="tarjeta-dato__titulo">${textos.hoy.ventas}</h2>
        <p className="tarjeta-dato__cifra">${contable.ventas.importe || textos.tierras.panel.noConsta}</p>
        <p className="tarjeta-dato__nota">${contable.ventas.nota || textos.tierras.panel.noConsta}</p>
      </article>
      <article className="tarjeta-dato" data-resumen-cuaderno=${textoDelCuaderno}>
        <h2 className="tarjeta-dato__titulo">${textos.hoy.cuaderno}</h2>
        <p className="tarjeta-dato__cifra">${textoDelCuaderno}</p>
        ${seSabe && cuantasFaltan > 0
          ? html`<p className="tarjeta-dato__nota">${contable.cuaderno.nota || textos.hoy.cuadernoNota}</p>`
          : null}
      </article>
    </div>

    <section className="tarjeta" aria-labelledby="ultimos-titulo">
      <h2 className="tarjeta__titulo" id="ultimos-titulo">${textos.hoy.ultimos}</h2>
      ${ultimos.length ? lista : vacio}
    </section>

    ${mostrarQueFalta
      ? html`<${BloqueQueFalta} estado=${queFalta.estado} lista=${falta} alReintentar=${queFalta.reintentar} />`
      : null}
  </div>`;
}

// ---------------------------------------------------------------- mapa

function Leyenda({ leyenda, campo }) {
  const filas = leyenda.map((fila) => html`<li className="leyenda__fila" key=${`leyenda-${fila.etiqueta}`}>
    <span className="leyenda__color" style=${{ background: fila.color }} aria-hidden="true"></span>
    <span className="leyenda__palabra">${fila.etiqueta}</span>
    <span className="leyenda__cuenta">${fila.n}</span>
  </li>`);

  return html`<ul className="leyenda" data-leyenda-uso=${campo} aria-label=${textos.tierras.leyenda}>${filas}</ul>`;
}

function Mapa({ municipios, tierras, municipio, caja, elegida, alCambiarMunicipio, alZoom, alElegir, leyenda, campo }) {
  const [intento, setIntento] = useState(0);
  const [noLlega, setNoLlega] = useState(false);
  const url = caja ? urlDelMapa(caja, ANCHO_MAPA, ALTO_MAPA) : "";
  const urlConIntento = url ? `${url}&intento=${intento}` : "";

  useEffect(() => {
    setNoLlega(false);
  }, [urlConIntento]);

  // **Las zonas de toque van ANTES que los trazos visibles**: en SVG gana el último que se
  // pinta, así que el trazo de color y las etiquetas quedan por encima y el dedo acierta los
  // 60 px del anillo. Medido el 09/11/2026: los anillos del mapa tenían 2 px de trazo y el
  // mapa no se podía tocar; la ventana del SIGPAC ya lo hacía así.
  const toques = [];
  if (caja) {
    for (const tierra of tierras) {
      const rutaParaTocar = rutaDeAnillo(tierra.anillo, caja, ANCHO_MAPA, ALTO_MAPA);
      const alTocar = alElegir ? () => alElegir(tierra) : undefined;
      if (rutaParaTocar) {
        toques.push(html`<path
          key=${`toque-anillo-${tierra.id}`}
          className="mapa__anillo mapa__anillo--toque"
          d=${rutaParaTocar}
          data-mapa-toque=${tierra.id}
          aria-hidden="true"
          onClick=${alTocar}
        />`);
        continue;
      }
      const puntoParaTocar = proyeccionDePunto(tierra.centro, caja, ANCHO_MAPA, ALTO_MAPA);
      if (puntoParaTocar) {
        toques.push(html`<circle
          key=${`toque-punto-${tierra.id}`}
          className="mapa__punto mapa__punto--toque"
          cx=${puntoParaTocar[0]}
          cy=${puntoParaTocar[1]}
          r="30"
          data-mapa-toque=${tierra.id}
          aria-hidden="true"
          onClick=${alTocar}
        />`);
      }
    }
  }

  const dibujos = [];
  if (caja) {
    for (const tierra of tierras) {
      const esElegida = Boolean(elegida && elegida.id === tierra.id);
      const color = leyenda ? colorDeTierra(tierra, leyenda, campo) : "var(--brand-bright)";
      const estilo = esElegida ? { stroke: color, strokeWidth: 5 } : { stroke: color };
      const ruta = rutaDeAnillo(tierra.anillo, caja, ANCHO_MAPA, ALTO_MAPA);
      if (ruta) {
        dibujos.push(html`<path
          key=${`anillo-${tierra.id}`}
          className="mapa__anillo"
          d=${ruta}
          style=${estilo}
          onClick=${alElegir ? () => alElegir(tierra) : undefined}
        />`);
        continue;
      }
      const punto = proyeccionDePunto(tierra.centro, caja, ANCHO_MAPA, ALTO_MAPA);
      if (punto) {
        dibujos.push(html`<circle
          key=${`punto-${tierra.id}`}
          className="mapa__punto"
          cx=${punto[0]}
          cy=${punto[1]}
          r=${esElegida ? 9 : 6}
          style={estilo}
          onClick=${alElegir ? () => alElegir(tierra) : undefined}
        />`);
      }
    }
  }

  const opciones = municipios.map((m) => html`<option key=${m.nombre} value=${m.nombre} data-municipio-opcion=${m.nombre}>${m.nombre}</option>`);
  const etiquetaDeLaFoto = `${textos.tierras.mapa}: ${municipio}`;

  const fotografía = html`<div className="mapa__lienzo">
    <img className="mapa__foto" data-mapa-imagen src=${urlConIntento} alt=${etiquetaDeLaFoto} onError=${() => setNoLlega(true)} />
    <svg className="mapa__dibujo" viewBox=${`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`} preserveAspectRatio="none" aria-hidden="true">${toques}${dibujos}</svg>
  </div>`;

  const sinCaja = html`<div className="mapa__aviso">
    <p className="estado__texto">${textos.tierras.sinMapa}</p>
  </div>`;

  const falloDeFoto = html`<div className="mapa__aviso" data-mapa-error>
    <p className="estado__texto">${textos.tierras.mapaNoLlega}</p>
    <button type="button" className="boton" onClick=${() => setIntento((n) => n + 1)}>${textos.comun.reintentarCorto}</button>
  </div>`;

  let contenido = sinCaja;
  if (caja) contenido = noLlega ? falloDeFoto : fotografía;

  return html`<section className="mapa" data-mapa aria-labelledby="mapa-titulo">
    <div className="mapa__barra">
      <h2 className="mapa__titulo" id="mapa-titulo">${textos.tierras.mapa}</h2>
      <label className="mapa__selector">
        <span>${textos.tierras.municipio}</span>
        <select className="mapa__campo" data-municipio-selector value=${municipio} onChange=${(evento) => alCambiarMunicipio(evento.target.value)}>
          ${opciones}
        </select>
      </label>
      <div className="mapa__zoom">
        <button type="button" className="boton boton--icono" data-zoom="mas" aria-label=${textos.tierras.zoomMas} onClick=${() => alZoom("mas")}>
          <${Icono} nombre="mas" tamano=${20} />
        </button>
        <button type="button" className="boton boton--icono" data-zoom="menos" aria-label=${textos.tierras.zoomMenos} onClick=${() => alZoom("menos")}>
          <${Icono} nombre="menos" tamano=${20} />
        </button>
        <button type="button" className="boton boton--icono" data-zoom="todo" aria-label=${textos.tierras.zoomTodo} onClick=${() => alZoom("todo")}>
          <${Icono} nombre="centrar" tamano=${20} />
        </button>
      </div>
    </div>
    ${contenido}
    <p className="mapa__pie">${textos.tierras.ayudaDelMapa}</p>
  </section>`;
}

// ---------------------------------------------------------------- panel

function Panel({ tierra, alCerrar, alGuardar }) {
  const [alias, setAlias] = useState(tierra.alias || "");
  const [superficie, setSuperficie] = useState(
    tierra.superficie_ha === null || tierra.superficie_ha === undefined ? "" : formateaNumero(tierra.superficie_ha),
  );
  const [estado, setEstado] = useState("quieto");

  useEffect(() => {
    setAlias(tierra.alias || "");
    setSuperficie(tierra.superficie_ha === null || tierra.superficie_ha === undefined ? "" : formateaNumero(tierra.superficie_ha));
    setEstado("quieto");
  }, [tierra.id]);

  const filas = datosDelPanel(tierra).map((dato) => html`<div key=${dato.etiqueta}>
    <dt className="panel__dato-etiqueta">${dato.etiqueta}</dt>
    <dd className="panel__dato-valor">${dato.valor}</dd>
  </div>`);

  const otros = Array.isArray(tierra.otros_anios) ? tierra.otros_anios : [];
  const filasDeAnios = otros.map((anio) => html`<tr key=${`anio-${anio.anio}`} data-anio=${anio.anio}>
    <td>${anio.anio}</td>
    <td>${anio.cultivo || textos.tierras.panel.noConsta}</td>
    <td>${anio.superficie_ha === null || anio.superficie_ha === undefined ? textos.tierras.panel.noConsta : formateaNumero(anio.superficie_ha)}</td>
    <td>${anio.variedad || textos.tierras.panel.noConsta}</td>
  </tr>`);

  const cuerpoDeAnios = otros.length
    ? filasDeAnios
    : html`<tr><td colSpan=${4}>${textos.tierras.panel.sinOtrosAnios}</td></tr>`;

  const avisoSinMapa = sinMapa(tierra)
    ? html`<p className="panel__aviso"><${Icono} nombre="aviso" tamano=${20} />${textos.tierras.sinMapa}</p>`
    : null;

  const guardar = async () => {
    setEstado("guardando");
    const numero = superficie.trim() === "" ? null : Number(String(superficie).replace(",", "."));
    const resultado = await guardarTierra(tierra.id, {
      alias: alias.trim(),
      superficie_ha: Number.isNaN(numero) ? null : numero,
    });
    if (resultado.estado === "ok") {
      setEstado("guardado");
      if (alGuardar) alGuardar();
      return;
    }
    setEstado(resultado.estado === "sin-permiso" ? "sin-permiso" : "fallo");
  };

  let editor = null;
  {
    const aviso = estado === "guardado" ? textos.tierras.panel.guardado : estado === "fallo" ? textos.tierras.panel.noSeGuardo : estado === "sin-permiso" ? textos.comun.sinPermiso : null;
    const claseAviso = estado === "guardado" ? "panel__aviso panel__aviso--bien" : "panel__aviso";
    editor = html`<div className="panel__editor">
      <label className="campo">
        <span>${textos.tierras.panel.alias}</span>
        <input className="campo__control" type="text" data-editar-alias value=${alias} onChange=${(evento) => setAlias(evento.target.value)} />
      </label>
      <label className="campo">
        <span>${textos.tierras.panel.superficieEditable}</span>
        <input className="campo__control" type="tel" inputMode="decimal" data-editar-superficie value=${superficie} onChange=${(evento) => setSuperficie(evento.target.value)} />
      </label>
      <p className="panel__nota">${textos.tierras.panel.soloEsto}</p>
      <div className="estado__acciones">
        <button type="button" className="boton boton--principal" data-guardar-alias onClick=${guardar} disabled=${estado === "guardando"}>
          ${estado === "guardando" ? textos.tierras.panel.guardando : textos.tierras.panel.guardar}
        </button>
      </div>
      ${aviso ? html`<p className=${claseAviso}>${aviso}</p>` : null}
    </div>`;
  }

  return html`<aside className="panel" data-panel aria-labelledby="panel-alias">
    <div className="panel__cabecera">
      <h2 className="panel__alias" id="panel-alias" data-panel-alias=${tierra.alias}>${tierra.alias}</h2>
      <button type="button" className="boton boton--icono" aria-label=${textos.tierras.panel.cerrar} onClick=${alCerrar}>
        <${Icono} nombre="cerrar" tamano=${20} />
      </button>
    </div>
    ${avisoSinMapa}
    ${editor}
    <dl className="panel__datos" data-panel-datos>${filas}</dl>
    <div>
      <h3 className="panel__subtitulo">${textos.tierras.panel.otrosAnios}</h3>
      <div className="tabla-envoltura">
        <table className="panel__tabla" data-panel-otros-anios=${otros.length}>
          <thead>
            <tr>
              <th scope="col">${textos.tierras.panel.anio}</th>
              <th scope="col">${textos.tierras.panel.cultivo}</th>
              <th scope="col">${textos.tierras.panel.hectareas}</th>
              <th scope="col">${textos.tierras.panel.variedad}</th>
            </tr>
          </thead>
          <tbody>${cuerpoDeAnios}</tbody>
        </table>
      </div>
    </div>
  </aside>`;
}

// ---------------------------------------------------------------- Mis tierras

function VistaTierras({ estadoVista, datos, alReintentar, alAnadirTierras, alAbrirTierra, tierraAbierta }) {
  const tierras = (datos && datos.tierras) || [];
  const municipios = (datos && datos.municipios) || [];

  const municipiosDelMapa = useMemo(
    () =>
      municipios.map((delServidor) => ({
        ...delServidor,
        nombre: delServidor.nombre || textos.tierras.sinMunicipio,
      })),
    [municipios],
  );

  const [busqueda, setBusqueda] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [caja, setCaja] = useState(null);
  const [campoDeColor, setCampoDeColor] = useState("uso");
  const elegidaId = tierraAbierta || null;

  const municipioPorDefecto = useMemo(() => {
    const conForma = municipiosDelMapa.find((m) => Array.isArray(m.bbox) && m.bbox.length === 4);
    if (conForma) return conForma.nombre;
    return municipiosDelMapa.length ? municipiosDelMapa[0].nombre : "";
  }, [municipiosDelMapa]);

  useEffect(() => {
    if (!municipio && municipioPorDefecto) setMunicipio(municipioPorDefecto);
  }, [municipio, municipioPorDefecto]);

  useEffect(() => {
    setCaja(null);
  }, [municipio]);

  const cajaBase = useMemo(
    () => bboxDeMunicipio(municipiosDelMapa, municipio) || bboxDelConjunto(municipiosDelMapa),
    [municipiosDelMapa, municipio],
  );
  const cajaDelMapa = caja || cajaBase;

  const elegida = useMemo(() => tierras.find((tierra) => tierra.id === elegidaId) || null, [tierras, elegidaId]);

  if (estadoVista === "cargando") return html`<${EstadoCargando} mensaje=${textos.tierras.cargando} />`;
  if (estadoVista === "error") return html`<${EstadoFallo} mensaje=${textos.tierras.fallo} alReintentar=${alReintentar} />`;
  if (estadoVista === "sin-permiso") return html`<${EstadoSinPermiso} mensaje=${textos.tierras.sinPermiso} />`;

  const calculados = calcularTotales(tierras);
  const delServidor = (datos && datos.totales) || {};
  const totales = {
    n: delServidor.n === null || delServidor.n === undefined ? calculados.n : delServidor.n,
    ha: "ha" in delServidor ? delServidor.ha : calculados.ha,
    municipios:
      delServidor.municipios === null || delServidor.municipios === undefined
        ? calculados.municipios
        : delServidor.municipios,
  };
  const conSuperficie = totales.ha !== null && totales.ha !== undefined;
  const plantilla = conSuperficie
    ? totales.n === 1
      ? textos.tierras.totalesUno
      : textos.tierras.totales
    : totales.n === 1
      ? textos.tierras.totalesUnoSinHa
      : textos.tierras.totalesSinHa;
  const textoDeTotales = textoRelleno(plantilla, {
    n: totales.n,
    ha: conSuperficie ? formateaNumero(totales.ha) : "",
    m: totales.municipios,
  });

  const cabecera = html`<header className="pagina__cabecera">
    <div className="pagina__fila">
      <div>
        <h1 className="pagina__titulo">${textos.tierras.titulo}</h1>
        <p className="pagina__dato" data-totales=${textoDeTotales}>${textoDeTotales}</p>
      </div>
      <button type="button" className="boton boton--principal" data-accion="anadir-tierras" onClick=${alAnadirTierras}>
        <${Icono} nombre="anadir" tamano=${20} />
        ${textos.alta.accion}
      </button>
    </div>
    <label className="buscador">
      <span>${textos.tierras.buscador}</span>
      <input
        className="buscador__campo"
        type="search"
        enterKeyHint="search"
        data-buscador
        value=${busqueda}
        placeholder=${textos.tierras.buscadorPista}
        onChange=${(evento) => setBusqueda(evento.target.value)}
      />
    </label>
  </header>`;

  if (estadoVista === "vacio") {
    return html`<div>
      ${cabecera}
      <${EstadoVacio} mensaje=${textos.tierras.vacio} textoBoton=${textos.tierras.traerTierras} />
    </div>`;
  }

  const visibles = filtrarTierras(tierras, busqueda);
  const grupos = agruparPorMunicipio(visibles);
  const delMunicipio = tierras.filter((tierra) => municipioDeTierra(tierra) === municipio);
  const leyenda = leyendaDe(tierras, campoDeColor);

  const alElegir = (tierra) => {
    const suMunicipio = municipioDeTierra(tierra);
    if (suMunicipio && suMunicipio !== municipio) setMunicipio(suMunicipio);
    alAbrirTierra(tierra.id);
  };

  const alCambiarMunicipio = (nombre) => {
    setMunicipio(nombre);
  };

  const alZoom = (sentido) => {
    if (sentido === "mas") {
      setCaja(zoomSobre(cajaDelMapa, PASO_DE_ZOOM));
      return;
    }
    if (sentido === "menos") {
      setCaja(zoomSobre(cajaDelMapa, 1 / PASO_DE_ZOOM));
      return;
    }
    setCaja(bboxDelConjunto(municipiosDelMapa) || cajaBase);
  };

  const bloques = grupos.map((grupo) => {
    const unidad = textos.tierras.panel.hectareas;
    const superficie = grupo.ha === null ? textos.tierras.panel.noConsta : `${formateaNumero(grupo.ha)} ${unidad}`;
    const cuenta = `${grupo.n === 1 ? `${grupo.n} tierra` : `${grupo.n} tierras`} · ${superficie}`;
    const filas = grupo.tierras.map((tierra) => {
      const esElegida = Boolean(elegida && elegida.id === tierra.id);
      const sinForma = sinMapa(tierra);
      const clase = [
        esElegida ? "tierra tierra--elegida" : "tierra",
        sinForma ? "tierra--sin-miniatura" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const hectareas = tierra.superficie_ha === null || tierra.superficie_ha === undefined
        ? textos.tierras.panel.noConsta
        : `${formateaNumero(tierra.superficie_ha)} ${textos.tierras.panel.hectareas}`;
      const detalles = [
        tierra.uso_sigpac,
        tierra.cultivo && tierra.cultivo.nombre,
        sinForma ? textos.tierras.sinMapa : null,
      ].filter(Boolean);
      const detalle = detalles.length
        ? html`<span className="tierra__detalle">${detalles.join(" · ")}</span>`
        : null;
      const color = colorDeTierra(tierra, leyenda, campoDeColor);

      return html`<button
        type="button"
        key=${`tierra-${tierra.id}`}
        className=${clase}
        data-tierra-id=${tierra.id}
        data-seleccionada=${esElegida ? "si" : "no"}
        onClick=${() => alElegir(tierra)}
      >
        <${Miniatura} tierra=${tierra} sinForma=${sinForma} />
        <span className="tierra__alias"><span className="tierra__color" style=${{ background: color }} aria-hidden="true"></span>${tierra.alias}</span>
        <span className="tierra__hectareas">${hectareas}</span>
        ${detalle}
      </button>`;
    });

    return html`<div key=${`grupo-${grupo.nombre}`}>
      <h3 className="grupo__cabecera" data-municipio=${grupo.nombre}>
        <span className="grupo__nombre">${grupo.nombre}</span>
        <span className="grupo__cuenta">${cuenta}</span>
      </h3>
      ${filas}
    </div>`;
  });

  const sinResultados = html`<div className="estado">
    <p className="estado__texto">${textos.tierras.sinResultados}</p>
    <button type="button" className="boton" onClick=${() => setBusqueda("")}>${textos.tierras.quitarBusqueda}</button>
  </div>`;

  const lista = html`<section className="lista-tierras" aria-label=${textos.tierras.titulo}>${bloques}</section>`;

  const detalle = html`<div>
    <${Mapa}
      municipios=${municipiosDelMapa}
      tierras=${delMunicipio}
      municipio=${municipio}
      caja=${cajaDelMapa}
      elegida=${elegida}
      alCambiarMunicipio=${alCambiarMunicipio}
      alZoom=${alZoom}
      alElegir=${alElegir}
      leyenda=${leyenda}
      campo=${campoDeColor}
    />
    <${Leyenda} leyenda=${leyenda} campo=${campoDeColor} />
  </div>`;

  return html`<div>
    ${cabecera}
    <div className="campo-de-color">
      <span>${textos.tierras.colorPor}</span>
      <button type="button" className=${campoDeColor === "uso" ? "pastilla pastilla--activa" : "pastilla"} onClick=${() => setCampoDeColor("uso")} aria-pressed=${campoDeColor === "uso"}>${textos.tierras.colorPorUso}</button>
      <button type="button" className=${campoDeColor === "cultivo" ? "pastilla pastilla--activa" : "pastilla"} onClick=${() => setCampoDeColor("cultivo")} aria-pressed=${campoDeColor === "cultivo"}>${textos.tierras.colorPorCultivo}</button>
    </div>
    <div className="tierras">
      ${visibles.length ? lista : sinResultados}
      ${detalle}
    </div>
  </div>`;
}

// ---------------------------------------------------------------- Añadir tierras

function CampoDeCodigo({ etiqueta, nombre, valor, alCambiar, numerico = true, obligatorio = true, pista }) {
  const tipo = numerico ? "number" : "text";
  return html`<label className="campo">
    <span>${etiqueta}</span>
    <input
      className="campo__control"
      type=${tipo}
      inputMode=${numerico ? "numeric" : undefined}
      min=${numerico ? "0" : undefined}
      required=${obligatorio}
      placeholder=${pista || ""}
      value=${valor}
      onChange=${(evento) => alCambiar(nombre, evento.target.value)}
    />
  </label>`;
}

function ListaDeRecintos({ estado, recintos, marcados, alMarcar, alAnadir, mensaje }) {
  if (estado === "buscando") return html`<p className="estado__texto" role="status">${textos.alta.buscando}</p>`;
  if (estado === "sin-permiso") {
    return html`<div className="estado">
      <p className="estado__texto">${textos.comun.sinPermiso}</p>
      <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
    </div>`;
  }
  if (estado === "error") {
    return html`<div className="estado estado--fallo" role="alert">
      <p className="estado__texto">${textos.alta.noSePudoBuscar}</p>
    </div>`;
  }
  if (estado === "vacio") {
    return html`<div className="estado">
      <p className="estado__texto">${mensaje || textos.alta.sinRecintos}</p>
    </div>`;
  }
  if (estado !== "listo") return null;

  const filas = recintos.map((recinto) => {
    const marcado = marcados.includes(recinto.recinto);
    const clase = marcado ? "recinto recinto--marcado" : "recinto";
    const dibujo = recinto.tiene_dibujo ? null : html`<span className="recinto__sin-dibujo">${textos.alta.sinDibujo}</span>`;
    return html`<li key=${`recinto-${recinto.recinto}`}>
      <label className=${clase} data-recinto-id=${recinto.recinto} data-recinto-marcado=${marcado ? "si" : "no"}>
        <input type="checkbox" checked=${marcado} onChange=${() => alMarcar(recinto.recinto)} />
        <span className="recinto__datos">
          <span className="recinto__titulo">${textos.alta.recinto} ${recinto.recinto} · ${recinto.uso || recinto.uso_sigpac || textos.tierras.panel.noConsta}</span>
          <span className="recinto__detalle">
            ${textos.alta.superficie}: ${recinto.superficie_ha === null || recinto.superficie_ha === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(recinto.superficie_ha)} ${textos.tierras.panel.hectareas}`}
            · ${textos.alta.pendiente}: ${recinto.pendiente_pct === null || recinto.pendiente_pct === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(recinto.pendiente_pct, 1)} %`}
          </span>
          ${dibujo}
        </span>
      </label>
    </li>`;
  });

  const cuenta = textoRelleno(textos.alta.marcados, { n: marcados.length });

  return html`<div>
    <h3 className="panel__subtitulo">${textos.alta.recintos}</h3>
    <p className="pagina__dato">${cuenta}</p>
    <ul className="lista-recintos">${filas}</ul>
    <button type="button" className="boton boton--principal" data-anadir-seleccionados onClick=${alAnadir} disabled=${!marcados.length}>
      ${textos.alta.anadirMarcados}
    </button>
  </div>`;
}

function VentanaSigpac({ cajaInicial, buscados, alAnadir, alRefrescar }) {
  // Los recintos de la búsqueda ya están dibujados en el primer pintado: no se abre el mapa
  // vacío y luego se rellena.
  const [recintos, setRecintos] = useState(() => recintosConPuntos(buscados));
  const [caja, setCaja] = useState(
    () => cajaDeLosRecintos(recintosConPuntos(buscados)) || cajaInicial,
  );
  const [estado, setEstado] = useState("quieto");
  const [ficha, setFicha] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [intento, setIntento] = useState(0);
  const [noLlega, setNoLlega] = useState(false);

  // **Los recintos de la búsqueda, dibujados todos de una vez** cuando el SIGPAC manda sus
  // puntos. El mapa se abre mirando a esos recintos y no a la finca: es donde está lo que se
  // acaba de buscar. Si la búsqueda no trae dibujo, se dice y se queda la lista.
  const deLaBusqueda = useMemo(() => recintosConPuntos(buscados), [buscados]);

  useEffect(() => {
    setRecintos(deLaBusqueda);
    setFicha(null);
    setAviso(null);
    const cajaDeLaBusqueda = cajaDeLosRecintos(deLaBusqueda);
    setCaja(cajaDeLaBusqueda || cajaInicial);
  }, [deLaBusqueda, cajaInicial]);

  const url = caja ? urlDelMapa(caja, ANCHO_MAPA, ALTO_MAPA) : "";
  const urlConIntento = url ? `${url}&intento=${intento}` : "";

  useEffect(() => {
    setNoLlega(false);
  }, [urlConIntento]);

  const alTocar = async (evento) => {
    if (!caja) return;
    // Con el teclado no hay un punto donde tocar: Enter sobre el mapa no elige una parcela al azar.
    if (!evento.detail) return;
    const rect = evento.currentTarget.getBoundingClientRect();
    const x = ((evento.clientX - rect.left) / rect.width) * ANCHO_MAPA;
    const y = ((evento.clientY - rect.top) / rect.height) * ALTO_MAPA;
    const punto = puntoDelMapa(x, y, caja, ANCHO_MAPA, ALTO_MAPA);
    if (!punto) return;

    setEstado("buscando");
    setAviso(null);
    const resultado = await pedir(RUTA_MAPA_PUNTO, conCuerpoJson({ x: punto[0], y: punto[1] }));
    if (resultado.estado === "sin-permiso") {
      setEstado("sin-permiso");
      return;
    }
    if (resultado.estado !== "ok") {
      setEstado("error");
      return;
    }
    if (!resultado.datos.encontrado) {
      setEstado("listo");
      setFicha(null);
      setAviso(resultado.datos.mensaje || textos.alta.sinForma);
      return;
    }
    const encontrado = resultado.datos;
    const conPuntos = Array.isArray(encontrado.puntos) && encontrado.puntos.length >= 3;
    setFicha(encontrado);
    setEstado("listo");
    if (conPuntos) {
      const color = colorDeUso(encontrado.uso_sigpac, recintos.length);
      setRecintos((previos) => {
        const otros = previos.filter((uno) => uno.recinto !== encontrado.recinto);
        return [...otros, { recinto: encontrado.recinto, puntos: encontrado.puntos, uso: encontrado.uso, color }];
      });
      const lons = encontrado.puntos.map((uno) => uno[0]);
      const lats = encontrado.puntos.map((uno) => uno[1]);
      setCaja(cajaQueSePuedePedir([Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]));
    } else {
      setAviso(textos.alta.sinForma);
    }
  };

  const alZoom = (sentido) => {
    if (sentido === "mas") {
      setCaja(zoomSobre(caja, PASO_DE_ZOOM));
      return;
    }
    if (sentido === "menos") {
      setCaja(zoomSobre(caja, 1 / PASO_DE_ZOOM));
      return;
    }
    setCaja(cajaDeLosRecintos(recintos) || cajaInicial);
  };

  const anadirEste = async () => {
    if (!ficha) return;
    setEstado("anadiendo");
    const resultado = await alAnadir(ficha);
    if (resultado === "ok") {
      setAviso(textoRelleno(textos.alta.anadidas, { n: 1 }));
      if (alRefrescar) alRefrescar();
    } else {
      setAviso(resultado === "sin-permiso" ? textos.comun.sinPermiso : textos.alta.noSePudoBuscar);
    }
    setEstado("listo");
  };

  const dibujos = [];
  if (caja) {
    for (const recinto of recintos) {
      const camino = rutaDeAnillo(recinto.puntos, caja, ANCHO_MAPA, ALTO_MAPA);
      if (!camino) continue;
      dibujos.push(html`<path
        key=${`recinto-${recinto.recinto}`}
        className="mapa__anillo mapa__anillo--recinto"
        d=${camino}
        style=${{ stroke: recinto.color }}
        data-mapa-recinto=${recinto.recinto}
      >
        <title>${`${textos.alta.recinto} ${recinto.recinto} · ${recinto.uso || ""}`}</title>
      </path>`);

      // La etiqueta del recinto, encima de su dibujo y con un borde claro para que se lea
      // sobre la foto sin depender del color.
      const proyectados = proyeccionDeAnillo(recinto.puntos, caja, ANCHO_MAPA, ALTO_MAPA);
      const primerPunto = proyectados && proyectados.length ? proyectados[0] : null;
      if (primerPunto) {
        dibujos.push(html`<text
          key=${`etiqueta-${recinto.recinto}`}
          x=${primerPunto[0] + 6}
          y=${primerPunto[1] - 6}
          style=${{
            fill: "var(--ink)",
            fontSize: "15px",
            fontWeight: "600",
            paintOrder: "stroke",
            stroke: "var(--surface-card)",
            strokeWidth: "3",
          }}
        >${recinto.recinto}</text>`);
      }
    }
  }

  const sinMapa = !caja;
  const etiquetaDeLaFoto = textos.alta.ventana;

  const lienzo = html`<button
    type="button"
    className="mapa__lienzo mapa__lienzo--tocable"
    data-mapa-ventana
    aria-label=${textos.alta.ventanaAyuda}
    onClick=${alTocar}
  >
    <img className="mapa__foto" data-mapa-imagen src=${urlConIntento} alt=${etiquetaDeLaFoto} onError=${() => setNoLlega(true)} />
    <svg className="mapa__dibujo" viewBox=${`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`} preserveAspectRatio="none" aria-hidden="true">${dibujos}</svg>
  </button>`;

  let contenido = html`<div className="mapa__aviso">
    <p className="estado__texto">${textos.alta.ventanaSinMapa}</p>
  </div>`;
  if (!sinMapa) {
    contenido = noLlega
      ? html`<div className="mapa__aviso" data-mapa-error>
          <p className="estado__texto">${textos.tierras.mapaNoLlega}</p>
          <button type="button" className="boton" onClick=${() => setIntento((n) => n + 1)}>${textos.comun.reintentarCorto}</button>
        </div>`
      : lienzo;
  }

  const fichaDeLaTierra = ficha
    ? html`<div className="ficha-recinto">
        <h4 className="panel__subtitulo">${textos.alta.fichaRecinto}</h4>
        <dl className="panel__datos">
          <div><dt className="panel__dato-etiqueta">${textos.alta.recinto}</dt><dd className="panel__dato-valor">${ficha.recinto ?? textos.tierras.panel.noConsta}</dd></div>
          <div><dt className="panel__dato-etiqueta">${textos.alta.uso}</dt><dd className="panel__dato-valor">${ficha.uso || ficha.uso_sigpac || textos.tierras.panel.noConsta}</dd></div>
          <div><dt className="panel__dato-etiqueta">${textos.alta.superficie}</dt><dd className="panel__dato-valor">${ficha.superficie_ha === null || ficha.superficie_ha === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(ficha.superficie_ha)} ${textos.tierras.panel.hectareas}`}</dd></div>
          <div><dt className="panel__dato-etiqueta">${textos.alta.pendiente}</dt><dd className="panel__dato-valor">${ficha.pendiente_pct === null || ficha.pendiente_pct === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(ficha.pendiente_pct, 1)} %`}</dd></div>
        </dl>
        <button type="button" className="boton boton--principal" data-anadir-recinto onClick=${anadirEste}>
          ${textos.alta.anadirEsta}
        </button>
      </div>`
    : null;

  const estados = [];
  if (estado === "buscando") estados.push(html`<p key="buscando" className="estado__texto" role="status">${textos.comun.cargando}</p>`);
  if (estado === "error") estados.push(html`<p key="error" className="estado__texto">${textos.alta.noSePudoBuscar}</p>`);
  if (estado === "sin-permiso") estados.push(html`<p key="permiso" className="estado__texto">${textos.comun.sinPermiso}</p>`);
  if (aviso) estados.push(html`<p key="aviso" className="panel__aviso">${aviso}</p>`);

  // Lo que se ha buscado y no se puede dibujar se dice: no se pinta un cuadro en su lugar.
  const buscadosSinDibujo = (Array.isArray(buscados) ? buscados : []).filter(
    (recinto) => !(Array.isArray(recinto.puntos) && recinto.puntos.length >= 3),
  );
  if (deLaBusqueda.length && buscadosSinDibujo.length) {
    estados.push(html`<p key="parcial" className="panel__aviso">
      <${Icono} nombre="aviso" tamano=${20} />
      ${textos.alta.sinForma}
    </p>`);
  }
  if (Array.isArray(buscados) && buscados.length && !deLaBusqueda.length) {
    estados.push(html`<p key="sin-puntos" className="panel__aviso" data-sin-puntos>
      <${Icono} nombre="aviso" tamano=${20} />
      ${textos.alta.sinPuntos}
    </p>`);
  }
  const cuentaEnElMapa = deLaBusqueda.length
    ? html`<p className="pagina__dato">${textoRelleno(textos.alta.recintosEnElMapa, { n: deLaBusqueda.length })}</p>`
    : null;

  return html`<section className="tarjeta ventana-sigpac" aria-labelledby="ventana-titulo">
    <div className="pagina__fila">
      <h2 className="tarjeta__titulo" id="ventana-titulo">${textos.alta.ventana}</h2>
      <div className="mapa__zoom">
        <button type="button" className="boton boton--icono" data-zoom="mas" aria-label=${textos.tierras.zoomMas} onClick=${() => alZoom("mas")}>
          <${Icono} nombre="mas" tamano=${20} />
        </button>
        <button type="button" className="boton boton--icono" data-zoom="menos" aria-label=${textos.tierras.zoomMenos} onClick=${() => alZoom("menos")}>
          <${Icono} nombre="menos" tamano=${20} />
        </button>
        <button type="button" className="boton boton--icono" data-zoom="todo" aria-label=${textos.tierras.zoomTodo} onClick=${() => alZoom("todo")}>
          <${Icono} nombre="centrar" tamano=${20} />
        </button>
      </div>
    </div>
    <p className="pagina__dato">${textos.alta.ventanaAyuda}</p>
    ${contenido}
    ${cuentaEnElMapa}
    ${estados}
    ${fichaDeLaTierra}
  </section>`;
}

function ResultadoDeImportacion({ estado, resultado, alOtro, alVerTierras }) {
  if (estado === "subiendo") {
    return html`<div className="estado" role="status"><p className="estado__texto">${textos.alta.importando}</p></div>`;
  }
  if (estado === "sin-permiso") {
    return html`<div className="estado">
      <p className="estado__texto">${textos.comun.sinPermiso}</p>
      <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
    </div>`;
  }
  if (estado === "error") {
    return html`<div className="estado estado--fallo" role="alert">
      <p className="estado__texto">${textos.alta.noSeImporto}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" onClick=${alOtro}>${textos.alta.otroFichero}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </div>`;
  }
  if (estado !== "traido" || !resultado) return null;

  const filas = [];
  if (resultado.titular) {
    filas.push(html`<div key="titular"><dt className="panel__dato-etiqueta">${textos.alta.titular}</dt><dd className="panel__dato-valor">${resultado.titular}</dd></div>`);
  }
  if (resultado.anio !== null) {
    filas.push(html`<div key="anio"><dt className="panel__dato-etiqueta">${textos.alta.anio}</dt><dd className="panel__dato-valor">${resultado.anio}</dd></div>`);
  }
  if (resultado.tierrasEnElCuaderno !== null) {
    filas.push(html`<div key="tierras"><dt className="panel__dato-etiqueta">${textos.alta.tierrasEnElCuaderno}</dt><dd className="panel__dato-valor">${resultado.tierrasEnElCuaderno}</dd></div>`);
  }
  if (resultado.creadas !== null) {
    filas.push(html`<div key="creadas"><dt className="panel__dato-etiqueta">${textos.alta.creadas}</dt><dd className="panel__dato-valor">${resultado.creadas}</dd></div>`);
  }
  if (resultado.yaEstaban !== null) {
    filas.push(html`<div key="estaban"><dt className="panel__dato-etiqueta">${textos.alta.yaEstaban}</dt><dd className="panel__dato-valor">${resultado.yaEstaban}</dd></div>`);
  }
  if (resultado.sinApuntar !== null) {
    filas.push(html`<div key="sin"><dt className="panel__dato-etiqueta">${textos.alta.sinApuntar}</dt><dd className="panel__dato-valor">${resultado.sinApuntar}</dd></div>`);
  }

  const falta = resultado.falta.map((fila, indice) => html`<li key=${`falta-import-${indice}`}>
    <span className="que-falta__que">${fila.que}</span>
    <span className="que-falta__donde">${fila.donde || textos.hoy.abrirAppVieja}</span>
  </li>`);
  const bloqueFalta = falta.length ? html`<ul className="que-falta">${falta}</ul>` : null;

  return html`<div data-importar-resultado="listo">
    <h4 className="panel__subtitulo">${textos.alta.importado}</h4>
    <dl className="panel__datos">${filas}</dl>
    ${bloqueFalta}
    <div className="estado__acciones">
      <button type="button" className="boton boton--principal" onClick=${alVerTierras}>${textos.nav.tierras}</button>
      <button type="button" className="boton" onClick=${alOtro}>${textos.alta.otroFichero}</button>
    </div>
  </div>`;
}

function VistaAlta({ estadoVista, datos, alReintentar, alAnadirTierras, alIrATierras }) {
  const tierras = (datos && datos.tierras) || [];
  const municipios = (datos && datos.municipios) || [];

  const [campos, setCampos] = useState({ provincia: "", municipio: "", agregado: "0", zona: "0", poligono: "", parcela: "", recinto: "" });
  const [pegadas, setPegadas] = useState("");
  const [busqueda, setBusqueda] = useState({ estado: "quieto", recintos: [], mensaje: null, municipio: null });
  const [marcados, setMarcados] = useState([]);
  const [alta, setAlta] = useState({ estado: "quieto", texto: null });
  const [importacion, setImportacion] = useState({ estado: "inicial", resultado: null });
  const [numeroDeVeces, setNumeroDeVeces] = useState(0);
  const [ventana, setVentana] = useState(false);
  const [vecesBuscado, setVecesBuscado] = useState(0);
  const entradaDeFichero = useRef(null);

  const cajaInicial = useMemo(() => cajaDeLasTierras(tierras, municipios), [tierras, municipios, numeroDeVeces]);

  const cambiar = (nombre, valor) => setCampos((previos) => ({ ...previos, [nombre]: valor }));

  const buscar = async () => {
    setBusqueda({ estado: "buscando", recintos: [], mensaje: null, municipio: null });
    setMarcados([]);
    setVecesBuscado((n) => n + 1);
    const referencia = referenciasDeTexto(pegadas);
    if (referencia.length && !campos.poligono && !campos.parcela) {
      // Se han pegado referencias y no hay casillas: se traen por la puerta de varias.
      const creadas = await pedir(RUTA_PARCELAS_VARIAS, conCuerpoJson({ referencias: referencia }));
      if (creadas.estado === "ok") {
        setAlta({ estado: "hecho", texto: textoRelleno(textos.alta.anadidas, { n: creadas.datos.cuantas ?? creadas.datos.creadas?.length ?? 0 }) });
        setNumeroDeVeces((n) => n + 1);
        alReintentar();
        return;
      }
      setBusqueda({ estado: creadas.estado === "sin-permiso" ? "sin-permiso" : "error", recintos: [], mensaje: null, municipio: null });
      return;
    }

    const cuerpo = {
      referencia: referencia.length === 1 ? referencia[0] : null,
      provincia: campos.provincia.trim() || null,
      municipio: campos.municipio.trim() || null,
      agregado: campos.agregado === "" ? null : Number(campos.agregado),
      zona: campos.zona === "" ? null : Number(campos.zona),
      poligono: campos.poligono === "" ? null : Number(campos.poligono),
      parcela: campos.parcela === "" ? null : Number(campos.parcela),
    };

    const resultado = await pedir(RUTA_BUSCAR, conCuerpoJson(cuerpo));
    if (resultado.estado === "ok") {
      const encontrados = resultado.datos.recintos || [];
      // El recinto es opcional: el SIGPAC busca por parcela y devuelve sus trozos; si el agricultor
      // ha escrito el número de uno, se queda con ese.
      const buscado = String(campos.recinto || "").trim();
      const recintos = buscado
        ? encontrados.filter((recinto) => String(recinto.recinto) === buscado)
        : encontrados;
      setBusqueda({
        estado: recintos.length ? "listo" : "vacio",
        recintos,
        mensaje: resultado.datos.mensaje || null,
        municipio: resultado.datos.municipio || null,
      });
      setMarcados(recintos.map((recinto) => recinto.recinto));
      return;
    }
    setBusqueda({
      estado: resultado.estado === "sin-permiso" ? "sin-permiso" : resultado.estado === "ok" ? "listo" : "error",
      recintos: [],
      mensaje: null,
      municipio: null,
    });
  };

  const alMarcar = (recinto) => {
    setMarcados((previos) =>
      previos.includes(recinto) ? previos.filter((uno) => uno !== recinto) : [...previos, recinto],
    );
  };

  const anadirLosMarcados = async () => {
    const elegidos = busqueda.recintos.filter((recinto) => marcados.includes(recinto.recinto));
    if (!elegidos.length) return;
    setAlta({ estado: "anadiendo", texto: null });
    const resultado = await pedir(
      RUTA_PARCELAS_VARIAS,
      conCuerpoJson({
        referencias: elegidos.map((recinto) => recinto.referencia),
        provincia: campos.provincia.trim() || null,
        municipio: busqueda.municipio?.nombre || campos.municipio.trim() || null,
      }),
    );
    if (resultado.estado === "ok") {
      const cuantas = resultado.datos.cuantas ?? (resultado.datos.creadas || []).length;
      const fallos = (resultado.datos.fallos || []).length;
      const texto = fallos
        ? `${textoRelleno(textos.alta.anadidas, { n: cuantas })} · ${textoRelleno(textos.alta.conFallos, { n: fallos })}`
        : textoRelleno(textos.alta.anadidas, { n: cuantas });
      setAlta({ estado: "hecho", texto });
      setNumeroDeVeces((n) => n + 1);
      alReintentar();
      return;
    }
    setAlta({
      estado: resultado.estado === "sin-permiso" ? "sin-permiso" : "fallo",
      texto: resultado.estado === "sin-permiso" ? textos.comun.sinPermiso : textos.alta.noSePudoBuscar,
    });
  };

  const anadirUno = async (ficha) => {
    const resultado = await pedir(
      RUTA_PARCELA_UNA,
      conCuerpoJson({
        ref_sigpac: ficha.referencia,
        provincia: ficha.municipio?.provincia || campos.provincia.trim() || null,
        municipio: ficha.municipio?.nombre || campos.municipio.trim() || null,
      }),
    );
    if (resultado.estado === "ok") {
      setNumeroDeVeces((n) => n + 1);
      alReintentar();
      return "ok";
    }
    return resultado.estado;
  };

  const subir = async (evento) => {
    const fichero = evento.target.files && evento.target.files[0];
    if (!fichero) return;
    setImportacion({ estado: "subiendo", resultado: null });
    const resultado = await subirCuaderno(fichero);
    if (resultado.estado === "ok") {
      setImportacion({ estado: "traido", resultado: normalizaImportacion(resultado.datos) });
      setNumeroDeVeces((n) => n + 1);
      alReintentar();
      return;
    }
    setImportacion({
      estado: resultado.estado === "sin-permiso" ? "sin-permiso" : "error",
      resultado: null,
    });
  };

  const pedirOtroFichero = () => {
    setImportacion({ estado: "inicial", resultado: null });
    if (entradaDeFichero.current) {
      entradaDeFichero.current.value = "";
      entradaDeFichero.current.focus();
    }
  };

  if (estadoVista === "cargando") return html`<${EstadoCargando} mensaje=${textos.comun.cargando} />`;
  if (estadoVista === "error") return html`<${EstadoFallo} mensaje=${textos.comun.fallo} alReintentar=${alReintentar} />`;
  if (estadoVista === "sin-permiso") return html`<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} />`;

  const avisoDeAlta = alta.texto
    ? html`<p className=${alta.estado === "fallo" ? "panel__aviso" : "panel__aviso panel__aviso--bien"} data-alta-resultado>
        ${alta.texto}
      </p>`
    : null;

  return html`<div className="pantalla-alta">
    <header className="pagina__cabecera">
      <div className="pagina__fila">
        <div>
          <h1 className="pagina__titulo">${textos.alta.titulo}</h1>
          <p className="pagina__dato">${textos.alta.intro}</p>
        </div>
        <button type="button" className="boton" onClick=${alIrATierras} data-accion="anadir-tierras">
          <${Icono} nombre="tierras" tamano=${20} />
          ${textos.nav.tierras}
        </button>
      </div>
    </header>

    <div className="alta-columnas">
      <section className="tarjeta" aria-labelledby="por-codigo-titulo">
        <h2 className="tarjeta__titulo" id="por-codigo-titulo">${textos.alta.porCodigo}</h2>
        <p className="pagina__dato">${textos.alta.porCodigoAyuda}</p>
        <div className="rejilla-campos">
          <${CampoDeCodigo} etiqueta=${textos.alta.provincia} nombre="provincia" valor=${campos.provincia} alCambiar=${cambiar} numerico=${false} obligatorio=${false} />
          <${CampoDeCodigo} etiqueta=${textos.alta.municipio} nombre="municipio" valor=${campos.municipio} alCambiar=${cambiar} numerico=${false} obligatorio=${false} />
          <${CampoDeCodigo} etiqueta=${textos.alta.agregado} nombre="agregado" valor=${campos.agregado} alCambiar=${cambiar} pista="0" />
          <${CampoDeCodigo} etiqueta=${textos.alta.zona} nombre="zona" valor=${campos.zona} alCambiar=${cambiar} pista="0" />
          <${CampoDeCodigo} etiqueta=${textos.alta.poligono} nombre="poligono" valor=${campos.poligono} alCambiar=${cambiar} obligatorio=${false} />
          <${CampoDeCodigo} etiqueta=${textos.alta.parcela} nombre="parcela" valor=${campos.parcela} alCambiar=${cambiar} obligatorio=${false} />
          <${CampoDeCodigo} etiqueta=${textos.alta.recintoFiltro} nombre="recinto" valor=${campos.recinto} alCambiar=${cambiar} obligatorio=${false} />
        </div>
        <label className="campo">
          <span>${textos.alta.referenciasPegadas}</span>
          <textarea className="campo__control campo__control--alto" rows="3" placeholder=${textos.alta.referenciasPista} value=${pegadas} onChange=${(evento) => setPegadas(evento.target.value)}></textarea>
        </label>
        <div className="estado__acciones">
          <button type="button" className="boton boton--principal" data-buscar-codigos onClick=${buscar}>
            <${Icono} nombre="buscar" tamano=${20} />
            ${textos.alta.buscar}
          </button>
          <button type="button" className="boton" onClick=${buscar} disabled=${!referenciasDeTexto(pegadas).length}>
            ${textos.alta.traerPegadas}
          </button>
          <button type="button" className="boton" data-abrir-ventana-sigpac onClick=${() => setVentana(true)}>
            ${textos.ventana.titulo}
          </button>
        </div>
        ${avisoDeAlta}
        <${ListaDeRecintos}
          estado=${busqueda.estado}
          recintos=${busqueda.recintos}
          marcados=${marcados}
          alMarcar=${alMarcar}
          alAnadir=${anadirLosMarcados}
          mensaje=${busqueda.mensaje}
        />
      </section>

      <${VentanaSigpac}
        key=${`ventana-${vecesBuscado}`}
        cajaInicial=${cajaInicial}
        buscados=${busqueda.recintos}
        alAnadir=${anadirUno}
        alRefrescar=${() => setNumeroDeVeces((n) => n + 1)}
      />

      <section className="tarjeta" aria-labelledby="importar-titulo">
        <h2 className="tarjeta__titulo" id="importar-titulo">${textos.alta.importar}</h2>
        <p className="pagina__dato">${textos.alta.importarAyuda}</p>
        <label className="campo">
          <span>${textos.alta.elegirFichero}</span>
          <input
            className="campo__control"
            type="file"
            accept=".xlsx"
            data-importar-cuaderno
            ref=${entradaDeFichero}
            onChange=${subir}
          />
        </label>
        <${ResultadoDeImportacion}
          estado=${importacion.estado}
          resultado=${importacion.resultado}
          alOtro=${pedirOtroFichero}
          alVerTierras=${alIrATierras}
        />
      </section>
    </div>

    <${VentanaDelSigpac}
      abierta=${ventana}
      modo="alta"
      alCerrar=${() => setVentana(false)}
      alRefrescar=${alReintentar}
      alVerTierras=${alIrATierras}
      alUsada=${(modoUsado) => {
        setVentana(false);
        // La ventana puede acabar aplicando el contorno a una tierra que ya existía (si se elige en
        // la lista de las que se quedaron sin códigos), no siempre añadiendo una nueva: se dice lo
        // que ha pasado de verdad.
        setAlta({
          estado: "hecho",
          texto: modoUsado === "tierra" ? textos.ventana.aplicada : textos.ventana.anadida,
        });
        setNumeroDeVeces((n) => n + 1);
        alReintentar();
      }}
    />
  </div>`;
}

// ---------------------------------------------------------------- la tierra

function pedirFormulario(ruta, formulario) {
  const token = leerToken();
  if (!token) return Promise.resolve({ estado: "sin-permiso" });
  return fetch(urlDeLaApi(ruta), { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formulario })
    .then(async (respuesta) => {
      if (respuesta.status === 401 || respuesta.status === 403) {
        borrarToken();
        return { estado: "sin-permiso" };
      }
      if (respuesta.status === 404 || respuesta.status === 405) return { estado: "no-disponible" };
      if (!respuesta.ok) return { estado: "error", codigo: respuesta.status };
      try {
        return { estado: "ok", datos: await respuesta.json() };
      } catch (fallo) {
        return { estado: "ok", datos: null };
      }
    })
    .catch(() => ({ estado: "error" }));
}

function cajaDeLaTierra(tierra) {
  const anillo = tierra && Array.isArray(tierra.anillo) ? tierra.anillo : [];
  if (anillo.length >= 3) {
    const lons = anillo.map((punto) => punto[0]);
    const lats = anillo.map((punto) => punto[1]);
    return cajaQueSePuedePedir([Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]);
  }
  const centro = tierra && Array.isArray(tierra.centro) ? tierra.centro : null;
  if (!centro) return null;
  const medio = 0.002;
  return cajaQueSePuedePedir([centro[0] - medio, centro[1] - medio, centro[0] + medio, centro[1] + medio]);
}

function FilaDeTrabajo({ trabajo, conTierra = true }) {
  const detalles = [];
  if (conTierra && trabajo.tierra) detalles.push(trabajo.tierra);
  if (conTierra && trabajo.municipio) detalles.push(trabajo.municipio);
  if (trabajo.hectareas !== null) {
    detalles.push(`${formateaNumero(trabajo.hectareas)} ${textos.tierras.panel.hectareas}`);
  }
  if (trabajo.cantidad !== null) {
    detalles.push(`${formateaNumero(trabajo.cantidad)}${trabajo.unidad ? ` ${trabajo.unidad}` : ""}`);
  }

  return html`<li className="trabajo">
    <span className="trabajo__fecha">${fechaDe(trabajo.fecha)}</span>
    <span className="trabajo__titulo">${trabajo.etiqueta}</span>
    ${detalles.length ? html`<span className="trabajo__detalle">${detalles.join(" · ")}</span>` : null}
  </li>`;
}

function BloqueDeHoy({ estado, trabajos, alReintentar }) {
  if (estado === "cargando") {
    return html`<section className="tarjeta" data-trabajo-de-hoy aria-labelledby="hoy-tierra-titulo">
      <h2 className="tarjeta__titulo" id="hoy-tierra-titulo">${textos.tierra.hoy}</h2>
      <p className="estado__texto">${textos.tierra.cargandoHoy}</p>
    </section>`;
  }
  if (estado === "sin-permiso") {
    return html`<section className="tarjeta" data-trabajo-de-hoy>
      <h2 className="tarjeta__titulo">${textos.tierra.hoy}</h2>
      <p className="estado__texto">${textos.comun.sinPermiso}</p>
      <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
    </section>`;
  }
  if (estado === "error" || estado === "no-disponible") {
    return html`<section className="tarjeta" data-trabajo-de-hoy>
      <h2 className="tarjeta__titulo">${textos.tierra.hoy}</h2>
      <p className="estado__texto">${textos.comun.todaviaNo}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${alReintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </section>`;
  }

  const filas = trabajos.map((trabajo, indice) => html`<${FilaDeTrabajo} key=${`hoy-${indice}`} trabajo=${trabajo} conTierra=${false} />`);
  return html`<section className="tarjeta" data-trabajo-de-hoy=${trabajos.length} aria-labelledby="hoy-tierra-titulo">
    <h2 className="tarjeta__titulo" id="hoy-tierra-titulo">${textos.tierra.hoy}</h2>
    ${trabajos.length ? html`<ul className="trabajos-lista">${filas}</ul>` : html`<p className="estado__texto">${textos.tierra.sinHoy}</p>`}
  </section>`;
}

function BloqueDeHistorial({ estado, anios, alReintentar }) {
  const cabecera = html`<h2 className="tarjeta__titulo" id="historial-titulo">${textos.tierra.historial}</h2>`;

  if (estado === "cargando") {
    return html`<section className="tarjeta" data-historial aria-labelledby="historial-titulo">
      ${cabecera}
      <p className="estado__texto">${textos.tierra.cargandoHistorial}</p>
    </section>`;
  }
  if (estado === "sin-permiso") {
    return html`<section className="tarjeta" data-historial>
      ${cabecera}
      <p className="estado__texto">${textos.comun.sinPermiso}</p>
      <a className="boton boton--principal" data-entrar href="/">${textos.comun.entrar}</a>
    </section>`;
  }
  if (estado === "error" || estado === "no-disponible") {
    return html`<section className="tarjeta" data-historial>
      ${cabecera}
      <p className="estado__texto">${textos.tierra.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${alReintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </section>`;
  }

  const bloques = anios.map((anio) => {
    const delAnio = [anio.cultivo, anio.variedad].filter(Boolean).join(" · ");
    const superficie = anio.superficie_ha === null || anio.superficie_ha === undefined
      ? null
      : `${formateaNumero(anio.superficie_ha)} ${textos.tierras.panel.hectareas}`;
    return html`<section key=${`anio-${anio.anio}`} data-historial-anio=${anio.anio} className="historial__anio">
      <h3 className="grupo__cabecera">
        <span className="grupo__nombre">${anio.anio}</span>
        <span className="grupo__cuenta">${[delAnio, superficie].filter(Boolean).join(" · ")}</span>
      </h3>
      ${anio.filas.map((fila, indice) => html`<article className="historial__fila" key=${`fila-${anio.anio}-${indice}`}>
        <span className="trabajo__titulo">${fila.etiqueta}</span>
        ${fila.detalles.length ? html`<span className="trabajo__detalle">${fila.detalles.join(" · ")}</span>` : null}
      </article>`)}
    </section>`;
  });

  // La comparativa: una fila por año, con lo que se puede comparar de un vistazo. Lo que no
  // consta se dice «no consta»: no se rellena con un cero.
  const comparativa = comparativaDeAnios(anios);
  const noConsta = textos.historial.noConsta;
  const filasDeLaComparativa = comparativa.map((fila) => html`<tr key=${`comparativa-${fila.anio}`} data-historial-fila-anio=${fila.anio}>
    <th scope="row">${fila.anio}</th>
    <td>${[fila.cultivo, fila.variedad].filter(Boolean).join(" · ") || noConsta}</td>
    <td>${fila.superficie_ha === null ? noConsta : `${formateaNumero(fila.superficie_ha)} ${textos.tierras.panel.hectareas}`}</td>
    <td>${fila.abonoKgHa === null ? noConsta : `${formateaNumero(fila.abonoKgHa)} kg/ha`}</td>
    <td>${fila.meses || noConsta}</td>
    <td>${fila.cosechaKgHa === null ? noConsta : `${formateaNumero(fila.cosechaKgHa)} kg/ha`}</td>
    <td>${fila.labores === null ? noConsta : fila.labores}</td>
  </tr>`);

  const tablaComparativa = comparativa.length
    ? html`<div className="tabla-envoltura">
        <table className="tabla" data-historial-comparativa>
          <caption>${textos.historial.comparativa}</caption>
          <thead>
            <tr>
              <th scope="col">${textos.historial.anio}</th>
              <th scope="col">${textos.historial.cultivo}</th>
              <th scope="col">${textos.historial.superficie}</th>
              <th scope="col">${textos.historial.abono}</th>
              <th scope="col">${textos.historial.mesesDeAbono}</th>
              <th scope="col">${textos.historial.cosecha}</th>
              <th scope="col">${textos.historial.labores}</th>
            </tr>
          </thead>
          <tbody>${filasDeLaComparativa}</tbody>
        </table>
      </div>`
    : html`<p className="estado__texto">${textos.historial.sinAnios}</p>`;

  return html`<section className="tarjeta" data-historial=${anios.length} aria-labelledby="historial-titulo">
    ${cabecera}
    ${tablaComparativa}
    ${anios.length ? bloques : html`<p className="estado__texto">${textos.tierra.sinHistorial}</p>`}
  </section>`;
}

// ---------------------------------------------------------------- apuntar

let cacheDelEsquema = null;

/** Si la puerta de siempre admite ya el apero; se pregunta una vez y se recuerda. */
async function elAperoCabeEnLabores() {
  if (cacheDelEsquema === null) {
    cacheDelEsquema = pedir(RUTA_OPENAPI).then((respuesta) =>
      respuesta.estado === "ok" ? elAperoSeGuardaEnLabores(respuesta.datos) : false,
    );
  }
  return cacheDelEsquema;
}

/** Los aperos que ofrece el servidor: primero su puerta nueva y, si no está, la lista de siempre. */
function usarOpcionesDeTrabajo() {
  const [estado, setEstado] = useState("cargando");
  const [aperos, setAperos] = useState([]);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const token = leerToken();
    if (!token) {
      setEstado("sin-permiso");
      return undefined;
    }
    let vivo = true;
    const control = new AbortController();
    setEstado("cargando");

    const peticion = (ruta) =>
      fetch(urlDeLaApi(ruta), { headers: { Authorization: `Bearer ${token}` }, signal: control.signal })
        .then(async (respuesta) => (respuesta.ok ? respuesta.json().catch(() => null) : null))
        .catch(() => null);

    (async () => {
      const deLaPuertaNueva = normalizaAperos(await peticion(RUTA_OPCIONES_DE_TRABAJOS));
      if (!vivo) return;
      if (deLaPuertaNueva.length) {
        setAperos(deLaPuertaNueva);
        setEstado("listo");
        return;
      }
      const deSiempre = normalizaAperos(await peticion(RUTA_QUE_FALTA_DE_TRABAJOS));
      if (!vivo) return;
      setAperos(deSiempre);
      setEstado(deSiempre.length ? "listo" : "vacio");
    })();

    return () => {
      vivo = false;
      control.abort();
    };
  }, [intento]);

  return { estado, aperos, reintentar: () => setIntento((n) => n + 1) };
}

/**
 * La miniatura del contorno.
 *
 * **Si la tierra no tiene forma, no se pinta nada** (09/11/2026): `DESIGN.md` dice que un
 * cuadro inventado sería peor que no dibujar, porque parecería la parcela. Antes se pintaba un
 * recuadro discontinuo con «sin mapa» en cada fila —66 veces en una lista de 64 tierras— y la
 * misma idea se repetía otra vez en el detalle. La falta se dice una sola vez, en el detalle.
 */
function Miniatura({ tierra, sinForma = false }) {
  const [fallo, setFallo] = useState(false);
  if (sinForma || fallo) return null;
  return html`<img
    className="miniatura"
    data-miniatura-tierra=${tierra.id}
    src=${urlDeMiniatura(tierra.id, 160, 120)}
    alt=${textos.apuntar.miniatura}
    loading="lazy"
    onError=${() => setFallo(true)}
  />`;
}

function Fragmento({ children }) {
  return children;
}

/**
 * **El apunte rápido**: parcela, tipo, producto con su dosis y fecha, en cuatro pasos (11/11/2026).
 *
 * Existe por una razón concreta: en el campo, con el móvil en una mano, el agricultor no quiere
 * recorrer el asistente entero para apuntar un tratamiento. Cuatro pasos, y si no hay cobertura el
 * apunte **se guarda igual** con el estado «pendiente de sincronizar» y se manda cuando vuelva.
 *
 * No inventa nada: la superficie tratada sale de la parcela (o del recinto del SIGPAC), la dosis y
 * el plazo de seguridad salen de la etiqueta del producto, y el motivo lo escribe él (lo pide la
 * Junta). El plazo de seguridad se enseña calculado, no se guarda aparte: el servidor lo vuelve a
 * calcular con la fecha.
 */
function ApunteRapido({ tierras, campana, productos, alGuardado }) {
  // En la demo los apuntes se guardan en el navegador: la confirmación lo dice, no lo inventa.
  const esDemo = typeof window !== "undefined" && window.CUEDIGITAL_DEMO === true;
  const [paso, setPaso] = useState(1);
  const [tierraId, setTierraId] = useState(() => (tierras[0] ? tierras[0].id : null));
  const [productoId, setProductoId] = useState(null);
  const [dosis, setDosis] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState(() => fechaDeHoyISO());
  const [aviso, setAviso] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [pendientes, setPendientes] = useState(() => (almacenDelNavegador() ? apuntesPendientes(almacenDelNavegador()).length : 0));
  const [busquedaParcela, setBusquedaParcela] = useState("");

  // La cola vive en el navegador y la enseña también la barra de arriba: cuando cambia se avisa
  // para que las dos digan lo mismo. Un evento del navegador, no un estado compartido: la barra no
  // es hija de esta tarjeta.
  const avisarDeLaCola = () => {
    try {
      window.dispatchEvent(new CustomEvent("cuedigital-cola"));
    } catch (error) {
      /* Si el navegador no deja lanzar eventos, la tarjeta sigue diciendo la verdad. */
    }
  };

  const tierra = (tierras || []).find((una) => una.id === tierraId) || null;
  const producto = (productos || []).find((uno) => uno.id === productoId) || null;
  const plazo = producto && producto.plazo !== null && producto.plazo !== undefined
    ? fechaDePlazo(fecha, producto.plazo)
    : null;

  useEffect(() => {
    if (producto && producto.dosisMaxima !== null && producto.dosisMaxima !== undefined) {
      setDosis(String(producto.dosisMaxima));
    }
  }, [productoId]);

  const cuerpoDelApunteRapido = () => ({
    campana_id: campana ? campana.id : null,
    fecha,
    tipo: "parcela",
    parcela_id: tierraId,
    producto_id: productoId,
    dosis: numeroDe(dosis),
    unidad_dosis: (producto && producto.unidad) || "L/ha",
    // La superficie que se ha tratado: la de la parcela, que es el dato que el agricultor tiene
    // delante y el que no hay que volver a teclear.
    superficie_tratada_ha: tierra && tierra.superficie_ha !== null && tierra.superficie_ha !== undefined
      ? tierra.superficie_ha
      : null,
    justificacion: motivo.trim(),
  });

  const validar = () => {
    if (!tierra) return textos.enCuatroPasos.faltaParcela;
    if (!producto) return textos.enCuatroPasos.faltaProducto;
    if (numeroDe(dosis) === null || numeroDe(dosis) <= 0) return textos.enCuatroPasos.faltaDosis;
    if (!motivo.trim()) return textos.enCuatroPasos.faltaMotivo;
    return null;
  };

  const guardar = async () => {
    const falta = validar();
    if (falta) {
      setAviso(falta);
      return;
    }
    setAviso(null);
    const cuerpo = cuerpoDelApunteRapido();
    const almacen = almacenDelNavegador();
    // **Sin cobertura no se pierde lo apuntado**: se queda en el navegador con su estado.
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      if (almacen) setPendientes(encolarApunte(almacen, cuerpo).length);
      setResultado("pendiente");
      avisarDeLaCola();
      return;
    }
    const respuesta = await pedir(RUTA_TRATAMIENTOS, conCuerpoJson(cuerpo));
    if (respuesta.estado === "ok") {
      setResultado("guardado");
      if (alGuardado) alGuardado();
      return;
    }
    if (respuesta.estado === "error" && almacen && !respuesta.detalle) {
      // La petición no ha llegado (sin red de verdad): se guarda para mandarla luego.
      setPendientes(encolarApunte(almacen, cuerpo).length);
      setResultado("pendiente");
      avisarDeLaCola();
      return;
    }
    const avisos = mensajesDeLaRespuesta(respuesta.detalle);
    setAviso(avisos.length ? avisos.join(" · ") : textos.apuntar.noSeGuardo);
  };

  const mandarLosPendientes = async () => {
    const almacen = almacenDelNavegador();
    const { enviados, restantes } = await mandarLosApuntesPendientes(almacen, (apunte) =>
      pedir(RUTA_TRATAMIENTOS, conCuerpoJson(apunte)),
    );
    setPendientes(restantes);
    avisarDeLaCola();
    if (enviados) {
      setResultado("guardado");
      if (alGuardado) alGuardado();
    }
  };

  // **Un paso a la vez, con su cuenta y su barra** (encargo de UI, 13/11/2026). Metido en la
  // pantalla de apuntar, este flujo tenía los cuatro pasos sin decir en cuál se estaba; con el
  // móvil en una mano, saber que quedan dos pasos es lo que evita abandonar a la mitad.
  const pasoEnTexto = textoRelleno(textos.enCuatroPasos.pasoDe, { n: paso });
  const rotulosDeLosPasos = [
    textos.enCuatroPasos.parcela,
    textos.enCuatroPasos.tipo,
    textos.enCuatroPasos.producto,
    textos.enCuatroPasos.fecha,
  ];
  const textoBuscadoParcela = busquedaParcela.trim().toLowerCase();
  const tierrasVisibles = (tierras || []).filter(
    (una) => !textoBuscadoParcela
      || String(una.alias || "").toLowerCase().includes(textoBuscadoParcela)
      || String(una.municipio || "").toLowerCase().includes(textoBuscadoParcela),
  );
  const tramosDeLaBarra = [1, 2, 3, 4].map((numero) => html`<span
    key=${`tramo-${numero}`}
    className=${"apunte-rapido__tramo" + (paso >= numero ? " apunte-rapido__tramo--hecho" : "")}
  ></span>`);
  const resumenDeLaParcela = tierra
    ? html`<p className="apunte-rapido__resumen" data-apunte-rapido-resumen>
        <span className="apunte-rapido__resumen-etiqueta">${textos.enCuatroPasos.parcelaElegida}</span>
        <span>${tierra.alias}${tierra.superficie_ha === null || tierra.superficie_ha === undefined
          ? ""
          : ` · ${formateaNumero(tierra.superficie_ha)} ${textos.tierras.panel.hectareas}`}</span>
      </p>`
    : null;
  const botonAtras = (destino) => html`<button
    type="button"
    className="boton"
    data-apunte-rapido-atras
    onClick=${() => {
      setPaso(destino);
      setAviso(null);
    }}
  >${textos.enCuatroPasos.atras}</button>`;

  return html`<section className="tarjeta apunte-rapido" aria-labelledby="apunte-rapido-titulo" data-apunte-rapido>
    <div className="apunte-rapido__cabecera">
      <div className="apunte-rapido__fila">
        <h2 className="tarjeta__titulo" id="apunte-rapido-titulo">${textos.enCuatroPasos.titulo}</h2>
        <p className="apunte-rapido__progreso" data-paso-de=${paso} aria-live="polite">${pasoEnTexto}</p>
      </div>
      <div className="apunte-rapido__barra" aria-hidden="true">${tramosDeLaBarra}</div>
    </div>

    ${resultado
      ? html`<p className="panel__aviso panel__aviso--bien" data-apunte-rapido-guardado>
          ${textoDeLoGuardado({
            guardados: apuntesGuardadosAqui(almacenDelNavegador()),
            pendientes,
            demo: esDemo,
          })}
        </p>`
      : null}
    ${resultado === "pendiente"
      ? html`<p className="panel__aviso" data-apunte-rapido-pendiente>${textos.enCuatroPasos.pendiente}</p>`
      : null}
    ${pendientes > 0
      ? html`<p className="panel__aviso" data-apunte-rapido-cola>
          ${textoRelleno(textos.enCuatroPasos.pendientes, { n: pendientes })}
          <button type="button" className="boton" data-apunte-rapido-reintentar onClick=${mandarLosPendientes}>
            ${textos.enCuatroPasos.reintentar}
          </button>
        </p>`
      : null}

    ${resumenDeLaParcela}

    <div className="apunte-rapido__paso apunte-rapido__paso--aqui" data-apunte-rapido-paso=${paso}>
      <p className="apunte-rapido__rotulo" data-apunte-rapido-rotulo>${rotulosDeLosPasos[paso - 1]}</p>
        ${paso === 1
          ? html`<div className="apunte-rapido__cuerpo" id="apunte-rapido-paso-1">
              ${(tierras || []).length > 8
                ? html`<label className="buscador">
                    <span>${textos.enCuatroPasos.buscarParcela}</span>
                    <input
                      className="buscador__campo"
                      type="search"
                      enterKeyHint="search"
                      data-apunte-rapido-buscar
                      value=${busquedaParcela}
                      placeholder=${textos.enCuatroPasos.pistaDeBusqueda}
                      onChange=${(evento) => setBusquedaParcela(evento.target.value)}
                    />
                  </label>`
                : null}
              ${tierrasVisibles.length
                ? html`<ul className="apunte-rapido__lista">
                    ${tierrasVisibles.map(
                      (una) => html`<li key=${una.id}>
                        <button
                          type="button"
                          className=${"apunte-rapido__opcion" + (una.id === tierraId ? " apunte-rapido__opcion--elegida" : "")}
                          data-apunte-rapido-tierra=${una.id}
                          aria-pressed=${una.id === tierraId}
                          onClick=${() => {
                            setTierraId(una.id);
                            setPaso(2);
                          }}
                        >
                          <span className="apunte-rapido__opcion-nombre">${una.alias}</span>
                          <span className="apunte-rapido__opcion-detalle">
                            ${una.superficie_ha === null || una.superficie_ha === undefined
                              ? una.municipio || ""
                              : `${formateaNumero(una.superficie_ha)} ${textos.tierras.panel.hectareas}`}
                          </span>
                        </button>
                      </li>`
                    )}
                  </ul>`
                : html`<p className="estado__texto">${textos.tierras.vacio}</p>`}
            </div>`
          : null}

        ${paso === 2
          ? html`<div className="apunte-rapido__cuerpo" id="apunte-rapido-paso-2">
              <div className="apunte-rapido__acciones">
                ${botonAtras(1)}
                <button type="button" className="boton boton--principal" data-apunte-rapido-tipo="tratamiento" onClick=${() => setPaso(3)}>
                  ${textos.enCuatroPasos.tipoTratamiento}
                </button>
              </div>
            </div>`
          : null}

        ${paso === 3
          ? html`<div className="apunte-rapido__cuerpo" id="apunte-rapido-paso-3">
              <div className="campo">
                <label className="campo__etiqueta" for="apunte-rapido-producto">${textos.enCuatroPasos.producto}</label>
                <select
                  className="campo__control"
                  id="apunte-rapido-producto"
                  data-apunte-rapido-producto
                  onChange=${(evento) => setProductoId(numeroDe(evento.target.value))}
                >
                  <option value="">${textos.enCuatroPasos.faltaProducto}</option>
                  ${(productos || []).map(
                    (uno) => html`<option key=${uno.id} value=${uno.id} selected=${uno.id === productoId}>
                      ${uno.nombre}
                    </option>`
                  )}
                </select>
              </div>
              <div className="campo">
                <label className="campo__etiqueta" for="apunte-rapido-dosis">${textos.enCuatroPasos.dosis}${producto && producto.unidad ? ` (${producto.unidad})` : ""}</label>
                <input
                  className="campo__control"
                  id="apunte-rapido-dosis"
                  data-apunte-rapido-dosis
                  type="text"
                  inputMode="decimal"
                  enterKeyHint="next"
                  value=${dosis}
                  onChange=${(evento) => setDosis(evento.target.value)}
                />
              </div>
              <div className="campo">
                <label className="campo__etiqueta" for="apunte-rapido-motivo">${textos.enCuatroPasos.motivo}</label>
                <input
                  className="campo__control"
                  id="apunte-rapido-motivo"
                  data-apunte-rapido-motivo
                  type="text"
                  placeholder=${textos.enCuatroPasos.motivoPista}
                  enterKeyHint="next"
                  value=${motivo}
                  onChange=${(evento) => setMotivo(evento.target.value)}
                />
              </div>
              <div className="apunte-rapido__acciones">
                ${botonAtras(2)}
                <button type="button" className="boton boton--principal" data-apunte-rapido-siguiente onClick=${() => { setPaso(4); setAviso(null); }}>
                  ${textos.enCuatroPasos.siguiente}
                </button>
              </div>
            </div>`
          : null}

        ${paso === 4
          ? html`<div className="apunte-rapido__cuerpo" id="apunte-rapido-paso-4">
              <div className="campo">
                <label className="campo__etiqueta" for="apunte-rapido-fecha">${textos.enCuatroPasos.fecha}</label>
                <input
                  className="campo__control"
                  id="apunte-rapido-fecha"
                  data-apunte-rapido-fecha
                  type="date"
                  value=${fecha}
                  onChange=${(evento) => setFecha(evento.target.value)}
                />
              </div>
              <p className="tarjeta__texto" data-apunte-rapido-plazo>
                ${plazo
                  ? textoRelleno(textos.enCuatroPasos.plazo, { fecha: fechaValidezEnTexto(plazo) })
                  : textos.enCuatroPasos.sinPlazo}
              </p>
              <div className="apunte-rapido__acciones">
                ${botonAtras(3)}
                <button type="button" className="boton boton--principal" data-apunte-rapido-guardar onClick=${guardar}>
                  ${textos.enCuatroPasos.guardar}
                </button>
              </div>
            </div>`
          : null}
    </div>

    ${aviso ? html`<p className="panel__aviso" data-apunte-rapido-aviso>${aviso}</p>` : null}
  </section>`;
}


// El almacén del navegador, con cuidado: en un navegador que lo tiene prohibido (modo privado de
// algunos) no se puede guardar la cola, y la pantalla tiene que seguir funcionando.
function almacenDelNavegador() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch (error) {
    return null;
  }
}

function VistaApuntar({ tierras, campana, tierraInicial, alEstado, alGuardado, alVerLaTierra, alIr }) {
  const opciones = usarOpcionesDeTrabajo();
  const catalogoProductos = usarPantalla(RUTA_PRODUCTOS, true);
  const catalogoAbonos = usarPantalla(RUTA_FERTILIZANTES, true);
  const catalogoSemillas = usarPantalla(RUTA_SEMILLAS, true);
  const productos = normalizaProductos(catalogoProductos.estado === "listo" ? catalogoProductos.datos : null);
  const abonos = normalizaAbonos(catalogoAbonos.estado === "listo" ? catalogoAbonos.datos : null);
  const semillas = normalizaSemillas(catalogoSemillas.estado === "listo" ? catalogoSemillas.datos : null);

  const [pestana, setPestana] = useState("labor");
  const [tierraId, setTierraId] = useState(tierraInicial || (tierras[0] ? tierras[0].id : null));
  const [busquedaTierra, setBusquedaTierra] = useState("");
  const [fecha, setFecha] = useState(() => fechaDeHoyISO());
  const [hectareas, setHectareas] = useState("");
  const [fase, setFase] = useState("inicial");
  const [aviso, setAviso] = useState(null);
  const [guardado, setGuardado] = useState(null);

  const [apero, setApero] = useState(null);
  const [notaLabor, setNotaLabor] = useState("");

  const [productoId, setProductoId] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [dosisTratamiento, setDosisTratamiento] = useState("");
  const [plaga, setPlaga] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [notaTratamiento, setNotaTratamiento] = useState("");

  const [fertilizanteId, setFertilizanteId] = useState(null);
  const [busquedaAbono, setBusquedaAbono] = useState("");
  const [modoAbono, setModoAbono] = useState("por_hectarea");
  const [dosisAbono, setDosisAbono] = useState("");
  const [kilosAbono, setKilosAbono] = useState("");
  const [notaAbono, setNotaAbono] = useState("");

  const [semillaId, setSemillaId] = useState(null);
  const [busquedaSemilla, setBusquedaSemilla] = useState("");
  const [dosisSiembra, setDosisSiembra] = useState("");
  const [notaSiembra, setNotaSiembra] = useState("");
  const [siembraDelCuaderno, setSiembraDelCuaderno] = useState(false);
  const [cultivoCuaderno, setCultivoCuaderno] = useState("");
  const [variedadCuaderno, setVariedadCuaderno] = useState("");

  const tierra = (tierras || []).find((una) => una.id === tierraId) || null;
  const producto = productos.find((uno) => uno.id === productoId) || null;
  const fertilizante = abonos.find((uno) => uno.id === fertilizanteId) || null;
  const semilla = semillas.find((una) => una.id === semillaId) || null;
  const sinSemillas = catalogoSemillas.estado === "listo" && semillas.length === 0;

  useEffect(() => {
    if (tierraInicial) setTierraId(tierraInicial);
  }, [tierraInicial]);

  useEffect(() => {
    if (!tierra) {
      setHectareas("");
      return;
    }
    setHectareas(
      tierra.superficie_ha === null || tierra.superficie_ha === undefined ? "" : formateaNumero(tierra.superficie_ha),
    );
  }, [tierraId, tierras]);

  useEffect(() => {
    if (!apero && opciones.aperos.length) setApero(opciones.aperos[0].clave);
  }, [apero, opciones.aperos]);

  useEffect(() => {
    if (sinSemillas) setSiembraDelCuaderno(true);
  }, [sinSemillas]);

  useEffect(() => {
    if (productoId === null) return;
    const elegido = productos.find((uno) => uno.id === productoId);
    if (elegido && elegido.dosisMaxima !== null && elegido.dosisMaxima !== undefined) {
      setDosisTratamiento(String(elegido.dosisMaxima));
    }
  }, [productoId]);

  useEffect(() => {
    if (semillaId === null) return;
    const elegida = semillas.find((una) => una.id === semillaId);
    if (elegida && elegida.dosisRecomendada !== null && elegida.dosisRecomendada !== undefined) {
      setDosisSiembra(String(elegida.dosisRecomendada));
    }
  }, [semillaId]);

  useEffect(() => {
    if (!alEstado) return;
    const sinPermiso =
      opciones.estado === "sin-permiso" ||
      catalogoProductos.estado === "sin-permiso" ||
      catalogoAbonos.estado === "sin-permiso" ||
      catalogoSemillas.estado === "sin-permiso" ||
      fase === "sin-permiso";
    const cargando =
      opciones.estado === "cargando" ||
      catalogoProductos.estado === "cargando" ||
      catalogoAbonos.estado === "cargando" ||
      catalogoSemillas.estado === "cargando" ||
      fase === "guardando";
    if (sinPermiso) alEstado("sin-permiso");
    else if (cargando) alEstado("cargando");
    else if (opciones.estado === "error") alEstado("error");
    else alEstado("listo");
  }, [opciones.estado, catalogoProductos.estado, catalogoAbonos.estado, catalogoSemillas.estado, fase, alEstado]);

  const textoDeTotal = (calculo) =>
    calculo ? `${formateaNumero(calculo.cantidad)}${calculo.unidad ? ` ${calculo.unidad}` : ""}` : textos.tierras.panel.noConsta;

  const totalTratamiento = totalDeLaAplicacion(dosisTratamiento, hectareas, producto ? producto.unidad : "L/ha");
  const totalAbono =
    modoAbono === "total"
      ? numeroDe(kilosAbono) === null
        ? null
        : { cantidad: numeroDe(kilosAbono), unidad: "kg" }
      : totalDeLaAplicacion(dosisAbono, hectareas, "kg/ha");
  const totalSiembra = siembraDelCuaderno
    ? totalDeLaAplicacion(dosisSiembra, hectareas, "kg/ha")
    : totalDeLaAplicacion(dosisSiembra, hectareas, "kg/ha");

  const enviar = async (ruta, cuerpo, textoGuardado) => {
    setFase("guardando");
    setAviso(null);
    const respuesta = await pedir(ruta, conCuerpoJson(cuerpo));
    if (respuesta.estado === "ok") {
      setFase("guardado");
      setGuardado({ texto: textoGuardado, fecha, tierra: tierra ? tierra.alias : "" });
      if (alGuardado) alGuardado();
      return;
    }
    if (respuesta.estado === "sin-permiso") {
      setFase("sin-permiso");
      return;
    }
    const avisos = mensajesDeLaRespuesta(respuesta.detalle);
    setFase("error");
    setAviso(avisos.length ? avisos.join(" · ") : textos.apuntar.noSeGuardo);
  };

  const guardarLabor = async () => {
    if (!tierra) {
      setAviso(textos.apuntar.sinTierra);
      return;
    }
    const avisoDeNota = avisoDeLaNota(apero, notaLabor);
    setAviso(avisoDeNota);
    const cuerpo = cuerpoDelApunte({
      campanaId: campana ? campana.id : null,
      apero,
      fecha,
      tierraId,
      hectareas,
      nota: notaLabor,
    });
    const conApero = await elAperoCabeEnLabores();
    await enviar(conApero ? RUTA_LABORES : RUTA_TRABAJO_HECHO, cuerpo, textos.apuntar.guardado);
  };

  const guardarTratamiento = async () => {
    if (!tierra) {
      setAviso(textos.apuntar.sinTierra);
      return;
    }
    if (!producto) {
      setAviso(textos.apuntar.producto.sinProducto);
      return;
    }
    if (!String(dosisTratamiento).trim()) {
      setAviso(textos.apuntar.producto.sinDosis);
      return;
    }
    if (!String(hectareas).trim()) {
      setAviso(textos.apuntar.producto.sinSuperficie);
      return;
    }
    if (!String(justificacion).trim()) {
      setAviso(textos.apuntar.producto.sinJustificacion);
      return;
    }
    await enviar(
      RUTA_TRATAMIENTOS,
      cuerpoDelTratamiento({
        campanaId: campana ? campana.id : null,
        tierraId,
        fecha,
        productoId: producto.id,
        dosis: dosisTratamiento,
        unidadDosis: producto.unidad || "L/ha",
        hectareas,
        plaga,
        justificacion,
        nota: notaTratamiento,
      }),
      textos.apuntar.producto.guardado,
    );
  };

  const guardarAbono = async () => {
    if (!tierra) {
      setAviso(textos.apuntar.sinTierra);
      return;
    }
    if (!fertilizante) {
      setAviso(textos.apuntar.abono.sinAbono);
      return;
    }
    if (!String(hectareas).trim()) {
      setAviso(textos.apuntar.abono.sinSuperficie);
      return;
    }
    if (modoAbono === "total") {
      if (!String(kilosAbono).trim()) {
        setAviso(textos.apuntar.abono.sinTotales);
        return;
      }
    } else if (!String(dosisAbono).trim()) {
      setAviso(textos.apuntar.abono.sinDosis);
      return;
    }
    await enviar(
      RUTA_FERTILIZACIONES,
      cuerpoDelAbono({
        campanaId: campana ? campana.id : null,
        tierraId,
        fecha,
        fertilizanteId: fertilizante.id,
        modo: modoAbono,
        dosisPorHa: dosisAbono,
        kilosTotales: kilosAbono,
        hectareas,
        nota: notaAbono,
      }),
      textos.apuntar.abono.guardado,
    );
  };

  const guardarSiembra = async () => {
    if (!tierra) {
      setAviso(textos.apuntar.sinTierra);
      return;
    }
    if (!String(hectareas).trim()) {
      setAviso(textos.apuntar.siembra.sinSuperficie);
      return;
    }
    if (siembraDelCuaderno) {
      if (!String(cultivoCuaderno).trim()) {
        setAviso(textos.apuntar.siembra.sinCultivo);
        return;
      }
      await enviar(
        RUTA_LABORES,
        cuerpoDeLaSiembraDelCuaderno({
          campanaId: campana ? campana.id : null,
          tierraId,
          fecha,
          cultivo: cultivoCuaderno,
          variedad: variedadCuaderno,
          dosisKgHa: dosisSiembra,
          hectareas,
          nota: notaSiembra,
        }),
        textos.apuntar.siembra.guardado,
      );
      return;
    }
    if (!semilla) {
      setAviso(textos.apuntar.siembra.sinSemilla);
      return;
    }
    if (!String(dosisSiembra).trim()) {
      setAviso(textos.apuntar.siembra.sinDosis);
      return;
    }
    await enviar(
      RUTA_SIEMBRAS,
      cuerpoDeLaSiembra({ tierraId, fecha, semillaId: semilla.id, dosisPorHa: dosisSiembra, hectareas, nota: notaSiembra }),
      textos.apuntar.siembra.guardado,
    );
  };

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.apuntar.titulo}</h1>
    <p className="pagina__dato">${textos.apuntar.intro}</p>
  </header>`;

  if (opciones.estado === "sin-permiso" || fase === "sin-permiso") {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }
  if (opciones.estado === "cargando") {
    return html`<div>${cabecera}<${EstadoCargando} mensaje=${textos.apuntar.cargando} /></div>`;
  }
  if (opciones.estado === "error") {
    return html`<div>
      ${cabecera}
      <p className="estado__texto">${textos.apuntar.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${opciones.reintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </div>`;
  }
  if (opciones.estado === "vacio") {
    // Las pestañas se siguen enseñando: aunque no haya aperos, el día a día se apunta igual,
    // y el estado vacío de la labor se dice dentro de su pestaña.
  }

  // **La tierra se busca, no se recorre** (medido el 09/11/2026): con 64 tierras, la lista
  // era una caja con 9.426 px de scroll dentro de la página y el formulario quedaba fuera de
  // la primera pantalla. Aquí se filtra por nombre o municipio, la tierra ya elegida sigue
  // arriba (aunque no case con la búsqueda) y la lista se desplaza con la página.
  const textoBuscado = busquedaTierra.trim().toLowerCase();
  const casan = tierras.filter((una) => !textoBuscado
    || String(una.alias || "").toLowerCase().includes(textoBuscado)
    || String(una.municipio || "").toLowerCase().includes(textoBuscado));
  if (tierra && !casan.some((una) => una.id === tierra.id)) casan.unshift(tierra);

  const opcionesDeTierra = casan.map((una) => {
    const activa = una.id === tierraId;
    const sinForma = sinMapa(una);
    const clase = [
      activa ? "tierra tierra--elegida" : "tierra",
      sinForma ? "tierra--sin-miniatura" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return html`<button
      type="button"
      key=${`apuntar-tierra-${una.id}`}
      className=${clase}
      data-apuntar-tierra=${una.id}
      aria-pressed=${activa}
      onClick=${() => setTierraId(una.id)}
    >
      <${Miniatura} tierra=${una} sinForma=${sinForma} />
      <span className="tierra__alias">${una.alias}</span>
      <span className="tierra__detalle">${una.municipio || textos.tierras.sinMunicipio}</span>
    </button>`;
  });

  const botonesDeApero = opciones.aperos.map((uno) => html`<button
    type="button"
    key=${`apero-${uno.clave}`}
    className=${apero === uno.clave ? "pastilla pastilla--activa" : "pastilla"}
    data-apuntar-apero=${uno.clave}
    aria-pressed=${apero === uno.clave}
    onClick=${() => setApero(uno.clave)}
  >${uno.etiqueta}</button>`);

  const buscado = (texto, campos) =>
    !texto.trim() || campos.some((campo) => String(campo || "").toLowerCase().includes(texto.trim().toLowerCase()));

  const filasDeProductos = productos
    .filter((uno) => buscado(busquedaProducto, [uno.nombre, uno.materiaActiva]))
    .map((uno) => {
      const activo = uno.id === productoId;
      return html`<li key=${`producto-${uno.id}`}>
        <button type="button" className=${activo ? "tierra tierra--elegida" : "tierra"} data-apuntar-producto=${uno.id} aria-pressed=${activo} onClick=${() => setProductoId(uno.id)}>
          <span className="tierra__alias">${uno.nombre}</span>
          <span className="tierra__detalle">
            ${uno.materiaActiva ? `${textos.apuntar.producto.materia}: ${uno.materiaActiva} · ` : ""}
            ${textos.apuntar.producto.dosisMaxima}: ${dosisMaximaEnTexto(uno) || textos.tierras.panel.noConsta}
            ${uno.plazo !== null ? ` · ${textos.apuntar.producto.plazo}: ${formateaNumero(uno.plazo)} ${textos.apuntar.producto.dias}` : ""}
          </span>
        </button>
      </li>`;
    });

  const filasDeAbonos = abonos
    .filter((uno) => buscado(busquedaAbono, [uno.nombre]))
    .map((uno) => {
      const activo = uno.id === fertilizanteId;
      return html`<li key=${`abono-${uno.id}`}>
        <button type="button" className=${activo ? "tierra tierra--elegida" : "tierra"} data-apuntar-fertilizante=${uno.id} aria-pressed=${activo} onClick=${() => setFertilizanteId(uno.id)}>
          <span className="tierra__alias">${uno.nombre}</span>
          <span className="tierra__detalle">${textos.apuntar.abono.riqueza}: ${riquezaEnTexto(uno) || textos.tierras.panel.noConsta}</span>
        </button>
      </li>`;
    });

  const filasDeSemillas = semillas
    .filter((una) => buscado(busquedaSemilla, [una.nombre, una.variedad]))
    .map((una) => {
      const activa = una.id === semillaId;
      return html`<li key=${`semilla-${una.id}`}>
        <button type="button" className=${activa ? "tierra tierra--elegida" : "tierra"} data-apuntar-semilla=${una.id} aria-pressed=${activa} onClick=${() => setSemillaId(una.id)}>
          <span className="tierra__alias">${una.nombre}${una.variedad ? ` · ${una.variedad}` : ""}</span>
          <span className="tierra__detalle">
            ${textos.apuntar.siembra.dosis}: ${una.dosisRecomendada === null ? textos.tierras.panel.noConsta : `${formateaNumero(una.dosisRecomendada)} kg/ha`}
          </span>
        </button>
      </li>`;
    });

  const pestanas = [
    { clave: "labor", etiqueta: textos.apuntar.pestanaLabor },
    { clave: "tratamiento", etiqueta: textos.apuntar.pestanaTratamiento },
    { clave: "abono", etiqueta: textos.apuntar.pestanaAbono },
    { clave: "siembra", etiqueta: textos.apuntar.pestanaSiembra },
  ];
  const botonesDePestana = pestanas.map((una) => html`<button
    type="button"
    key=${`pestana-${una.clave}`}
    className=${pestana === una.clave ? "pastilla pastilla--activa" : "pastilla"}
    data-apuntar-tab=${una.clave}
    role="tab"
    aria-selected=${pestana === una.clave}
    onClick=${() => {
      setPestana(una.clave);
      setAviso(null);
      setGuardado(null);
    }}
  >${una.etiqueta}</button>`);

  let formulario = null;
  if (pestana === "labor") {
    formulario = opciones.aperos.length
      ? html`<${React.Fragment}>
      <div className="filtros" role="group" aria-label=${textos.apuntar.apero}>${botonesDeApero}</div>
      <label className="campo">
        <span>${textos.apuntar.nota}</span>
        <textarea className="campo__control campo__control--alto" rows="2" data-apuntar-nota placeholder=${textos.apuntar.pistaDeLaNota} value=${notaLabor} onChange=${(evento) => setNotaLabor(evento.target.value)}></textarea>
      </label>
      <button type="button" className="boton boton--principal" data-apuntar-guardar onClick=${guardarLabor} disabled=${fase === "guardando"}>
        ${fase === "guardando" ? textos.apuntar.guardando : textos.apuntar.guardar}
      </button>
    <//>`
      : html`<p className="estado__texto">${textos.apuntar.sinAperos}</p>`;
  } else if (pestana === "tratamiento") {
    formulario = productos.length
      ? html`<${React.Fragment}>
          <label className="campo">
            <span>${textos.apuntar.producto.buscar}</span>
            <input className="campo__control" type="search" enterKeyHint="search" value=${busquedaProducto} placeholder=${textos.apuntar.producto.pistaBuscar} onChange=${(evento) => setBusquedaProducto(evento.target.value)} />
          </label>
          <ul className="lista-tierras">${filasDeProductos}</ul>
          ${producto
            ? html`<${React.Fragment}>
                <div className="rejilla-campos">
                  <label className="campo">
                    <span>${textos.apuntar.producto.dosis}</span>
                    <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-dosis value=${dosisTratamiento} onChange=${(evento) => setDosisTratamiento(evento.target.value)} />
                  </label>
                  <label className="campo">
                    <span>${textos.apuntar.producto.plaga}</span>
                    <input className="campo__control" type="text" data-apuntar-plaga value=${plaga} onChange=${(evento) => setPlaga(evento.target.value)} />
                  </label>
                </div>
                <label className="campo">
                  <span>${textos.apuntar.producto.justificacion}</span>
                  <input className="campo__control" type="text" data-apuntar-justificacion placeholder=${textos.apuntar.producto.pistaJustificacion} value=${justificacion} onChange=${(evento) => setJustificacion(evento.target.value)} />
                </label>
                <p className="pagina__dato" data-apuntar-total=${textoDeTotal(totalTratamiento)}>${textos.apuntar.producto.total}: ${textoDeTotal(totalTratamiento)}</p>
                <label className="campo">
                  <span>${textos.apuntar.producto.nota}</span>
                  <textarea className="campo__control campo__control--alto" rows="2" data-apuntar-nota value=${notaTratamiento} onChange=${(evento) => setNotaTratamiento(evento.target.value)}></textarea>
                </label>
                <button type="button" className="boton boton--principal" data-apuntar-guardar onClick=${guardarTratamiento} disabled=${fase === "guardando"}>
                  ${fase === "guardando" ? textos.apuntar.guardando : textos.apuntar.producto.guardar}
                </button>
              <//>`
            : html`<p className="estado__texto">${textos.apuntar.producto.sinProducto}</p>`}
        <//>`
      : html`<div className="estado">
          <p className="estado__texto">${textos.apuntar.producto.sinProductos}</p>
          <button type="button" className="boton" onClick=${() => alIr("productos")}>${textos.apuntar.producto.irAProductos}</button>
        </div>`;
  } else if (pestana === "abono") {
    formulario = abonos.length
      ? html`<${React.Fragment}>
          <label className="campo">
            <span>${textos.apuntar.abono.buscar}</span>
            <input className="campo__control" type="search" enterKeyHint="search" value=${busquedaAbono} onChange=${(evento) => setBusquedaAbono(evento.target.value)} />
          </label>
          <ul className="lista-tierras">${filasDeAbonos}</ul>
          ${fertilizante
            ? html`<${React.Fragment}>
                <div className="filtros" role="group" aria-label=${textos.apuntar.abono.modo}>
                  <button type="button" className=${modoAbono === "por_hectarea" ? "pastilla pastilla--activa" : "pastilla"} data-apuntar-modo="por_hectarea" aria-pressed=${modoAbono === "por_hectarea"} onClick=${() => setModoAbono("por_hectarea")}>${textos.apuntar.abono.porHectarea}</button>
                  <button type="button" className=${modoAbono === "total" ? "pastilla pastilla--activa" : "pastilla"} data-apuntar-modo="total" aria-pressed=${modoAbono === "total"} onClick=${() => setModoAbono("total")}>${textos.apuntar.abono.kilosTotales}</button>
                </div>
                ${modoAbono === "total"
                  ? html`<label className="campo">
                      <span>${textos.apuntar.abono.totales}</span>
                      <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-dosis value=${kilosAbono} onChange=${(evento) => setKilosAbono(evento.target.value)} />
                    </label>`
                  : html`<label className="campo">
                      <span>${textos.apuntar.abono.dosis}</span>
                      <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-dosis value=${dosisAbono} onChange=${(evento) => setDosisAbono(evento.target.value)} />
                    </label>`}
                <p className="pagina__dato" data-apuntar-total=${textoDeTotal(totalAbono)}>${textos.apuntar.abono.total}: ${textoDeTotal(totalAbono)}</p>
                <label className="campo">
                  <span>${textos.apuntar.abono.nota}</span>
                  <textarea className="campo__control campo__control--alto" rows="2" data-apuntar-nota value=${notaAbono} onChange=${(evento) => setNotaAbono(evento.target.value)}></textarea>
                </label>
                <button type="button" className="boton boton--principal" data-apuntar-guardar onClick=${guardarAbono} disabled=${fase === "guardando"}>
                  ${fase === "guardando" ? textos.apuntar.guardando : textos.apuntar.abono.guardar}
                </button>
              <//>`
            : html`<p className="estado__texto">${textos.apuntar.abono.sinAbono}</p>`}
        <//>`
      : html`<div className="estado">
          <p className="estado__texto">${textos.apuntar.abono.sinAbonos}</p>
          <button type="button" className="boton" onClick=${() => alIr("productos")}>${textos.apuntar.abono.irAAbonos}</button>
        </div>`;
  } else {
    formulario = html`<${React.Fragment}>
      ${sinSemillas || siembraDelCuaderno
        ? html`<${React.Fragment}>
            ${sinSemillas ? html`<p className="panel__aviso">${textos.apuntar.siembra.sinSemillas}</p>` : null}
            <p className="pagina__dato">${textos.apuntar.siembra.explicacion}</p>
            <div className="rejilla-campos">
              <label className="campo">
                <span>${textos.apuntar.siembra.cultivo}</span>
                <input className="campo__control" type="text" data-apuntar-cultivo value=${cultivoCuaderno} onChange=${(evento) => setCultivoCuaderno(evento.target.value)} />
              </label>
              <label className="campo">
                <span>${textos.apuntar.siembra.variedad}</span>
                <input className="campo__control" type="text" value=${variedadCuaderno} onChange=${(evento) => setVariedadCuaderno(evento.target.value)} />
              </label>
              <label className="campo">
                <span>${textos.apuntar.siembra.dosis}</span>
                <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-dosis value=${dosisSiembra} onChange=${(evento) => setDosisSiembra(evento.target.value)} />
              </label>
            </div>
            <p className="pagina__dato" data-apuntar-total=${textoDeTotal(totalSiembra)}>${textos.apuntar.siembra.total}: ${textoDeTotal(totalSiembra)}</p>
            <label className="campo">
              <span>${textos.apuntar.siembra.nota}</span>
              <textarea className="campo__control campo__control--alto" rows="2" data-apuntar-nota value=${notaSiembra} onChange=${(evento) => setNotaSiembra(evento.target.value)}></textarea>
            </label>
            <button type="button" className="boton boton--principal" data-apuntar-guardar onClick=${guardarSiembra} disabled=${fase === "guardando"}>
              ${fase === "guardando" ? textos.apuntar.guardando : textos.apuntar.siembra.guardarCuaderno}
            </button>
          <//>`
        : html`<${React.Fragment}>
            <label className="campo">
              <span>${textos.apuntar.siembra.buscar}</span>
              <input className="campo__control" type="search" enterKeyHint="search" value=${busquedaSemilla} onChange=${(evento) => setBusquedaSemilla(evento.target.value)} />
            </label>
            <ul className="lista-tierras">${filasDeSemillas}</ul>
            ${semilla
              ? html`<${React.Fragment}>
                  <div className="rejilla-campos">
                    <label className="campo">
                      <span>${textos.apuntar.siembra.dosis}</span>
                      <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-dosis value=${dosisSiembra} onChange=${(evento) => setDosisSiembra(evento.target.value)} />
                    </label>
                  </div>
                  <p className="pagina__dato" data-apuntar-total=${textoDeTotal(totalSiembra)}>${textos.apuntar.siembra.total}: ${textoDeTotal(totalSiembra)}</p>
                  <label className="campo">
                    <span>${textos.apuntar.siembra.nota}</span>
                    <textarea className="campo__control campo__control--alto" rows="2" data-apuntar-nota value=${notaSiembra} onChange=${(evento) => setNotaSiembra(evento.target.value)}></textarea>
                  </label>
                  <button type="button" className="boton boton--principal" data-apuntar-guardar onClick=${guardarSiembra} disabled=${fase === "guardando"}>
                    ${fase === "guardando" ? textos.apuntar.guardando : textos.apuntar.siembra.guardar}
                  </button>
                <//>`
              : html`<p className="estado__texto">${textos.apuntar.siembra.sinSemilla}</p>`}
            <button type="button" className="boton" onClick=${() => setSiembraDelCuaderno(true)}>${textos.apuntar.siembra.delCuaderno}</button>
          <//>`}
    <//>`;
  }

  const bloqueGuardado = guardado
    ? html`<section className="tarjeta" data-apuntar-resultado="guardado" aria-labelledby="apuntar-guardado">
        <h2 className="tarjeta__titulo" id="apuntar-guardado">${guardado.texto}</h2>
        <p className="pagina__dato">${[guardado.tierra, fechaDe(guardado.fecha)].filter(Boolean).join(" · ")}</p>
        <div className="estado__acciones">
          <${BotonSiguiente} texto=${textos.siguiente.verHoy} alPulsar=${() => alVerLaTierra && alVerLaTierra(tierraId)} />
          <${BotonSiguiente} texto=${textos.siguiente.verCalendario} alPulsar=${() => alIr("calendario")} />
        </div>
      </section>`
    : null;

  return html`<div className="pantalla-apuntar">
    ${cabecera}

    <${ApunteRapido}
      tierras=${tierras}
      campana=${campana}
      productos=${productos}
      alGuardado=${alGuardado}
    />

    <section className="tarjeta" aria-labelledby="apuntar-tierra-titulo">
      <h2 className="tarjeta__titulo" id="apuntar-tierra-titulo">${textos.apuntar.tierra}</h2>
      ${tierras.length > 8
        ? html`<label className="buscador">
            <span>${textos.tierras.buscador}</span>
            <input
              className="buscador__campo"
              type="search"
              data-apuntar-buscar-tierra
              enterKeyHint="search"
              value=${busquedaTierra}
              placeholder=${textos.tierras.buscadorPista}
              onChange=${(evento) => setBusquedaTierra(evento.target.value)}
            />
          </label>`
        : null}
      ${tierras.length
        ? html`<div className="lista-tierras">${opcionesDeTierra}</div>`
        : html`<p className="estado__texto">${textos.apuntar.sinTierra}</p>`}
    </section>

    <section className="tarjeta" aria-labelledby="apuntar-formulario-titulo">
      <h2 className="tarjeta__titulo" id="apuntar-formulario-titulo">${textos.apuntar.pestanas}</h2>
      <div className="pestanas" role="tablist" aria-label=${textos.apuntar.pestanas}>${botonesDePestana}</div>
      <div className="rejilla-campos">
        <label className="campo">
          <span>${textos.apuntar.fecha}</span>
          <input className="campo__control" type="date" data-apuntar-fecha value=${fecha} onChange=${(evento) => setFecha(evento.target.value)} />
        </label>
        <label className="campo">
          <span>${textos.apuntar.hectareas}</span>
          <input className="campo__control" type="tel" inputMode="decimal" data-apuntar-hectareas value=${hectareas} onChange=${(evento) => setHectareas(evento.target.value)} />
        </label>
      </div>
      ${aviso ? html`<p className="panel__aviso" data-apuntar-aviso>${aviso}</p>` : null}
      ${formulario}
    </section>

    ${bloqueGuardado}
  </div>`;
}


// ---------------------------------------------------------------- ventana del SIGPAC

function BotonSiguiente({ texto, alPulsar }) {
  return html`<button type="button" className="boton boton--principal" data-siguiente-paso=${texto} onClick=${alPulsar}>${texto}</button>`;
}

/**
 * **Descargar el cuaderno en PDF** (11/11/2026): el servidor escribe el cuaderno con las tierras y
 * sus apuntes. La descarga se pide con el vale de la cuenta (no es un enlace a pelo: la puerta pide
 * permiso) y se entrega como fichero, sin salir de la pantalla.
 */
function DescargarElCuaderno() {
  const [aviso, setAviso] = useState(null);
  const [bajando, setBajando] = useState(false);

  const descargar = async () => {
    setAviso(null);
    setBajando(true);
    try {
      const token = leerToken();
      const respuesta = await fetch(urlDeLaApi("/api/cuaderno/pdf"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!respuesta.ok) {
        setAviso(textos.cuaderno.noSePudoBajar);
        return;
      }
      const blob = await respuesta.blob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = "cuaderno-de-campo.pdf";
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (fallo) {
      setAviso(textos.cuaderno.noSePudoBajar);
    } finally {
      setBajando(false);
    }
  };

  return html`<section className="tarjeta" data-descargar-cuaderno>
    <h2 className="tarjeta__titulo">${textos.cuaderno.descargar}</h2>
    <p className="tarjeta__texto">${textos.cuaderno.descargarExplica}</p>
    <div className="estado__acciones">
      <button
        type="button"
        className="boton boton--principal"
        data-descargar-cuaderno-pdf
        onClick=${descargar}
        disabled=${bajando}
      >
        ${bajando ? textos.cuaderno.bajando : textos.cuaderno.descargarPdf}
      </button>
    </div>
    ${aviso ? html`<p className="panel__aviso" data-descargar-cuaderno-aviso>${aviso}</p>` : null}
  </section>`;
}

function VistaCuaderno({ alEstado, alIr, campana = null, pendientes = 0, demo = false }) {
  const pantalla = usarPantalla(RUTA_QUE_FALTA, true);
  // **Las últimas labores, para poder comprobar que el trabajo quedó registrado** (revisión
  // externa, 13/11/2026). La pantalla decía «completo» y no enseñaba ni una labor.
  const pantallaTrabajos = usarPantalla(queryDeTrabajos(), true);
  // Este hook va antes de cualquier return: si vive detrás de los estados de carga, React ve
  // más hooks que en el render anterior y revienta (error #310).
  const [soloRellenables, setSoloRellenables] = useState(true);
  const items = normalizaQueFalta(pantalla.estado === "listo" ? pantalla.datos : null);
  const secciones = agruparLoQueFalta(items);
  const resumen = resumenDeLoQueFalta(items);
  const delServidor = pantalla.estado === "listo" && pantalla.datos ? pantalla.datos.faltan : null;
  const cuantas = typeof delServidor === "number" ? delServidor : resumen.faltan;
  const primero = empezarPorLoPrimero(items);
  // Si el servidor dice que faltan cosas pero no las lista con su pantalla, se ofrece al menos la
  // primera sección que sí sepa dónde se arregla: nunca se deja al agricultor sin salida.
  const destinoDelPrimero = primero
    ? primero.destino
    : (secciones.find((seccion) => destinoDeLaSeccion(seccion.donde)) || null)
      ? destinoDeLaSeccion((secciones.find((seccion) => destinoDeLaSeccion(seccion.donde)) || {}).donde)
      : null;

  const labores = normalizaTrabajos(
    pantallaTrabajos.estado === "listo" ? pantallaTrabajos.datos : null,
    [],
  ).trabajos;
  const guardadosAqui = demo ? labores.length : 0;
  const estadoDeLoGuardado = html`<${EstadoDeLoGuardado} guardados=${guardadosAqui} pendientes=${pendientes} demo=${demo} />`;
  const campanaEnTexto = campana && campana.anio
    ? textoRelleno(textos.cuaderno.campana, { campana: campana.anio })
    : textos.cuaderno.campanaSinAnio;

  const ultimas = html`<section className="tarjeta" data-cuaderno-ultimos aria-labelledby="cuaderno-ultimos-titulo">
    <h2 className="tarjeta__titulo" id="cuaderno-ultimos-titulo">${textos.cuaderno.ultimasLabores}</h2>
    ${pantallaTrabajos.estado === "cargando"
      ? html`<p className="estado__texto">${textos.trabajos.cargando}</p>`
      : labores.length
        ? html`<ul className="cuaderno__labores">
            ${labores.slice(0, 5).map((trabajo, indice) => html`<li
              className="cuaderno__labor"
              key=${`cuaderno-labor-${indice}`}
              data-cuaderno-labor
              data-cuaderno-labor-fecha=${trabajo.fecha || ""}
            >
              <span className="cuaderno__labor-fecha">${fechaDe(trabajo.fecha)}</span>
              <span className="cuaderno__labor-que">${trabajo.etiqueta}</span>
              <span className="cuaderno__labor-tierra">${trabajo.tierra || textos.tierras.panel.noConsta}</span>
            </li>`)}
          </ul>`
        : html`<p className="estado__texto">${textos.cuaderno.sinLabores}</p>`}
    <div className="estado__acciones">
      ${labores.length
        ? html`<button type="button" className="boton boton--principal boton--grande" data-cuaderno-ver-todos onClick=${() => alIr("trabajos")}>${textos.cuaderno.verTodosLosApuntes}</button>`
        : html`<button type="button" className="boton boton--principal boton--grande" data-cuaderno-apuntar onClick=${() => alIr("apuntar")}>${textos.cuaderno.apuntarUnTrabajo}</button>`}
    </div>
  </section>`;

  const resumenCompleto = html`<section className="tarjeta cuaderno__resumen" data-cuaderno-resumen-completo aria-labelledby="cuaderno-completo-titulo">
    <h2 className="tarjeta__titulo" id="cuaderno-completo-titulo">${textos.cuaderno.titulo}</h2>
    <p className="cuaderno__resumen-texto">${textos.cuaderno.completo}</p>
    <p className="pagina__dato" data-cuaderno-campana>${campanaEnTexto}</p>
    <p className="cuaderno__resumen-bloqueo">
      <span className="chip" data-cuaderno-pendientes-cuenta=${cuantas}>${textos.cuaderno.pendientesCero}</span>
    </p>
    <p className="pagina__dato">${textos.cuaderno.alDia}</p>
  </section>`;

  useEffect(() => {
    if (!alEstado) return;
    if (pantalla.estado === "sin-permiso") alEstado("sin-permiso");
    else if (pantalla.estado === "cargando") alEstado("cargando");
    else if (pantalla.estado === "error" || pantalla.estado === "no-disponible") alEstado("error");
    else alEstado("listo");
  }, [pantalla.estado, alEstado]);

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.cuaderno.titulo}</h1>
    <p className="pagina__dato">${textos.cuaderno.intro}</p>
    ${pantalla.estado === "listo" && cuantas > 0
      ? html`<p className="pagina__dato" data-que-falta-cuenta>
          ${cuantas === 1 ? textos.cuaderno.faltaUna : textoRelleno(textos.cuaderno.faltan, { n: cuantas })}
        </p>`
      : null}
  </header>`;

  if (pantalla.estado === "sin-permiso") {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }
  if (pantalla.estado === "cargando") {
    return html`<div>${cabecera}<${EstadoCargando} mensaje=${textos.cuaderno.cargando} /></div>`;
  }
  if (pantalla.estado === "error" || pantalla.estado === "no-disponible") {
    return html`<div>
      ${cabecera}
      <p className="estado__texto">${textos.cuaderno.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${pantalla.reintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.cuaderno.abrirJv}</a>
      </div>
    </div>`;
  }
  if (!items.length) {
    return html`<div>
      ${cabecera}
      ${estadoDeLoGuardado}
      ${resumenCompleto}
      ${ultimas}
      <${DescargarElCuaderno} />
      <p><a className="boton" href="/">${textos.cuaderno.abrirJv}</a></p>
    </div>`;
  }

  const textoDelResumen = cuantas === 1
    ? textos.cuaderno.resumenUna
    : textoRelleno(textos.cuaderno.resumenVarias, { n: cuantas });
  const textoDeBloqueo = resumen.bloquean === 0
    ? textos.cuaderno.bloqueanNinguna
    : resumen.bloquean === 1
      ? textos.cuaderno.bloqueanUna
      : textoRelleno(textos.cuaderno.bloqueanVarias, { k: resumen.bloquean });
  const textoDeSinListar = textoDeFaltasSinListar(items.length, cuantas);
  const rellenables = faltasRellenables(items);
  const tecnicas = tecnicasDeLoQueFalta(items);
  const seccionesVisibles = soloRellenables ? seccionesRellenables(secciones) : secciones;
  const primerBloqueo = primerBloqueoDeLoQueFalta(items);
  const primerRellenable = empezarPorLoPrimero(items);
  const destinoParaEmpezar = primerRellenable ? primerRellenable.destino : null;

  const avisoDeLoQueBloquea = resumen.bloquean > 0
    ? html`<section className="tarjeta cuaderno__aviso" data-cuaderno-aviso aria-labelledby="cuaderno-aviso-titulo">
        <h2 className="tarjeta__titulo" id="cuaderno-aviso-titulo">${textos.cuaderno.avisoTitulo}</h2>
        <p className="cuaderno__aviso-texto" data-cuaderno-aviso-cuenta=${resumen.bloquean}>${textoDelAvisoDeBloqueo(resumen.bloquean)}</p>
        ${primerBloqueo
          ? html`<p className="pagina__dato" data-cuaderno-bloqueo-tecnico>
              ${textos.cuaderno.bloqueoTecnico} ${primerBloqueo.item.donde || textos.cuaderno.seArreglaFuera}
            </p>`
          : null}
        ${primerRellenable
          ? html`<p className="cuaderno__aviso-primero" data-cuaderno-primero>${textos.cuaderno.loPrimeroRellenable} «${primerRellenable.item.que}».</p>
              <p className="pagina__dato" data-cuaderno-primero-donde=${primerRellenable.item.donde || textos.cuaderno.seArreglaFuera}>
                ${textos.cuaderno.dondeSeArregla}: ${primerRellenable.item.donde || textos.cuaderno.seccion}
              </p>`
          : null}
        ${destinoParaEmpezar
          ? html`<div className="estado__acciones">
              <button type="button" className="boton boton--principal boton--grande" data-cuaderno-empezar onClick=${() => alIr(destinoParaEmpezar)}>${textos.cuaderno.empezarPorElCuaderno}</button>
            </div>`
          : null}
      </section>`
    : null;

  const resumenDelCuaderno = html`<section className="tarjeta cuaderno__resumen" data-cuaderno-resumen aria-labelledby="cuaderno-resumen-titulo">
    <h2 className="tarjeta__titulo" id="cuaderno-resumen-titulo">${textos.cuaderno.titulo}</h2>
    <p className="cuaderno__resumen-texto" data-cuaderno-resumen-texto>${textoDelResumen}</p>
    <p className="pagina__dato cuaderno__rellenables" data-cuaderno-rellenables=${rellenables}>${textoDeLasRellenables(rellenables)}</p>
    <label className="cuaderno__filtro">
      <input type="checkbox" data-cuaderno-filtro checked=${soloRellenables} onChange=${(evento) => setSoloRellenables(evento.target.checked)} />
      <span>${textos.cuaderno.filtro}</span>
    </label>
    ${soloRellenables && tecnicas > 0
      ? html`<p className="pagina__dato cuaderno__tecnicas" data-cuaderno-tecnicas=${tecnicas}>
          ${textoDeLasTecnicas(tecnicas)}
          <button type="button" className="boton" data-cuaderno-ver-tecnicas onClick=${() => setSoloRellenables(false)}>${textos.cuaderno.verTecnicas}</button>
        </p>`
      : null}
    <p className="cuaderno__resumen-bloqueo">
      <span className=${resumen.bloquean ? "chip chip--aviso" : "chip"} data-cuaderno-bloquean>${textoDeBloqueo}</span>
    </p>
    ${textoDeSinListar ? html`<p className="pagina__dato" data-cuaderno-faltas-sin-listar>${textoDeSinListar}</p>` : null}
    ${resumen.bloquean === 0 && destinoDelPrimero
      ? html`<div className="estado__acciones">
          <button type="button" className="boton boton--principal" data-cuaderno-empezar onClick=${() => alIr(destinoDelPrimero)}>${textos.cuaderno.empezar}</button>
        </div>`
      : null}
  </section>`;

  const bloques = seccionesVisibles.map((seccion) => {
    const destino = destinoDeLaSeccion(seccion.donde);
    const cuenta = cuentaDeUnaSeccion(seccion.items.length);
    const filas = seccion.items.map((item, indice) => html`<li className="que-falta__fila" key=${`falta-${indice}`} data-que-falta-item=${item.que} data-que-falta-item-bloquea=${item.bloquea ? "true" : "false"}>
      <span className="que-falta__que">${item.que}</span>
      ${item.bloquea ? html`<span className="chip chip--aviso">${textos.cuaderno.bloquea}</span>` : null}
      <span className="que-falta__donde">${textos.cuaderno.dondeSeArregla}: ${item.donde || textos.cuaderno.seccion}</span>
      ${destino
        ? html`<button type="button" className="boton" onClick=${() => alIr(destino)}>${textos.cuaderno.arreglar}</button>`
        : html`<a className="boton" href="/">${textos.cuaderno.arreglar}</a>`}
    </li>`);
    return html`<section className="tarjeta" key=${`seccion-${seccion.donde}`} data-que-falta-seccion=${seccion.donde} data-que-falta-seccion-bloquea=${seccion.bloquea ? "true" : "false"} data-que-falta-seccion-destino=${destino || ""} aria-labelledby=${`seccion-${seccion.donde}`}>
      <div className="cuaderno__cabecera">
        <h2 className="tarjeta__titulo" id=${`seccion-${seccion.donde}`}>${seccion.donde}</h2>
        <span className="chip" data-que-falta-seccion-cuenta=${cuenta}>${cuenta}</span>
      </div>
      <ul className="que-falta">${filas}</ul>
    </section>`;
  });

  return html`<div className="pantalla-cuaderno">
    ${cabecera}
    ${estadoDeLoGuardado}
    ${avisoDeLoQueBloquea}
    ${resumenDelCuaderno}
    ${bloques}
    ${ultimas}
    <${DescargarElCuaderno} />
    <p><a className="boton" href="/">${textos.cuaderno.abrirJv}</a></p>
  </div>`;
}

function VistaProductos({ tierras, campana, alEstado, alIr, alVerTierra }) {
  const listaProductos = usarPantalla(RUTA_PRODUCTOS, true);
  const listaAbonos = usarPantalla(RUTA_FERTILIZANTES, true);
  const productos = normalizaProductos(listaProductos.estado === "listo" ? listaProductos.datos : null);
  const abonos = normalizaAbonos(listaAbonos.estado === "listo" ? listaAbonos.datos : null);

  const [tab, setTab] = useState("productos");
  const [busqueda, setBusqueda] = useState("");
  const [elegido, setElegido] = useState(null);
  const [tierraId, setTierraId] = useState(null);
  const [fecha, setFecha] = useState(() => fechaDeHoyISO());
  const [hectareas, setHectareas] = useState("");
  const [dosis, setDosis] = useState("");
  const [fase, setFase] = useState("inicial");
  const [aviso, setAviso] = useState(null);
  const [resultado, setResultado] = useState(null);

  const cargando = listaProductos.estado === "cargando" || listaAbonos.estado === "cargando";
  const fallo = listaProductos.estado === "error" || listaProductos.estado === "no-disponible";
  const sinPermiso = listaProductos.estado === "sin-permiso";

  useEffect(() => {
    if (!alEstado) return;
    if (sinPermiso) alEstado("sin-permiso");
    else if (cargando || fase === "guardando") alEstado("cargando");
    else if (fallo && !productos.length) alEstado("error");
    else alEstado("listo");
  }, [sinPermiso, cargando, fallo, fase, productos.length, alEstado]);

  useEffect(() => {
    if (!tierraId && tierras && tierras.length) setTierraId(tierras[0].id);
  }, [tierraId, tierras]);

  useEffect(() => {
    if (tierraId === null) return;
    const tierra = (tierras || []).find((una) => una.id === tierraId);
    if (tierra && tierra.superficie_ha !== null && tierra.superficie_ha !== undefined) {
      setHectareas(formateaNumero(tierra.superficie_ha));
    }
  }, [tierraId, tierras]);

  const abrirAplicador = (tipo, dato) => {
    setElegido({
      tipo,
      id: dato.id,
      nombre: dato.nombre,
      unidad: tipo === "producto" ? dato.unidad : "kg",
      dosisMaxima: tipo === "producto" ? dato.dosisMaxima : null,
    });
    setDosis(tipo === "producto" && dato.dosisMaxima !== null && dato.dosisMaxima !== undefined ? String(dato.dosisMaxima) : "");
    setFase("inicial");
    setAviso(null);
    setResultado(null);
  };

  const cerrarAplicador = () => {
    setElegido(null);
    setAviso(null);
  };

  const total = elegido ? totalDeLaAplicacion(dosis, hectareas, elegido.unidad) : null;
  const textoDelTotal = total ? `${formateaNumero(total.cantidad)}${total.unidad ? ` ${total.unidad}` : ""}` : textos.tierras.panel.noConsta;

  const guardar = async () => {
    if (!elegido) return;
    if (!tierraId) {
      setAviso(textos.productos.sinTierra);
      return;
    }
    if (!dosis.trim()) {
      setAviso(textos.productos.sinDosis);
      return;
    }
    if (!hectareas.trim()) {
      setAviso(textos.productos.sinSuperficie);
      return;
    }
    setFase("guardando");
    setAviso(null);
    const cuerpo =
      elegido.tipo === "abono"
        ? cuerpoDeLaFertilizacion({
            campanaId: campana ? campana.id : null,
            tierraId,
            fecha,
            fertilizanteId: elegido.id,
            hectareas,
            dosisPorHa: dosis,
            unidad: elegido.unidad || "kg",
          })
        : cuerpoDelTratamiento({
            campanaId: campana ? campana.id : null,
            tierraId,
            fecha,
            productoId: elegido.id,
            dosis,
            unidadDosis: elegido.unidad || "L/ha",
            hectareas,
          });
    const respuesta = await pedir(rutaDeLaAplicacion(elegido.tipo), conCuerpoJson(cuerpo));
    if (respuesta.estado === "ok") {
      const tierra = (tierras || []).find((una) => una.id === tierraId);
      setResultado({ tipo: elegido.tipo, nombre: elegido.nombre, total: textoDelTotal, tierra: tierra ? tierra.alias : "", tierraId });
      setFase("guardado");
      setElegido(null);
      return;
    }
    if (respuesta.estado === "sin-permiso") {
      setFase("sin-permiso");
      return;
    }
    const avisosDelServidor = mensajesDeLaRespuesta(respuesta.detalle);
    setFase("error");
    setAviso(avisosDelServidor.length ? avisosDelServidor.join(" · ") : textos.productos.noSeGuardo);
  };

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.productos.titulo}</h1>
    <p className="pagina__dato">${textos.productos.intro}</p>
  </header>`;

  if (sinPermiso) {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }
  if (cargando) {
    return html`<div>${cabecera}<${EstadoCargando} mensaje=${textos.productos.cargando} /></div>`;
  }
  if (fallo && !productos.length && !abonos.length) {
    return html`<div>
      ${cabecera}
      <p className="estado__texto">${textos.productos.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${listaProductos.reintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </div>`;
  }

  const buscado = busqueda.trim().toLowerCase();
  const productosVisibles = productos.filter(
    (producto) => !buscado || producto.nombre.toLowerCase().includes(buscado) || String(producto.materiaActiva || "").toLowerCase().includes(buscado),
  );
  const abonosVisibles = abonos.filter((abono) => !buscado || abono.nombre.toLowerCase().includes(buscado));

  const filasDeProductos = productosVisibles.map((producto) => html`<li className="trabajo" key=${`producto-${producto.id}`} data-producto-id=${producto.id}>
    <span className="trabajo__titulo">${producto.nombre}</span>
    ${producto.materiaActiva ? html`<span className="trabajo__detalle">${textos.productos.materiaActiva}: ${producto.materiaActiva}</span>` : null}
    <span className="trabajo__detalle">
      ${textos.productos.dosisMaxima}: ${dosisMaximaEnTexto(producto) || textos.tierras.panel.noConsta}
      ${producto.plazo !== null ? ` · ${textos.productos.plazo}: ${formateaNumero(producto.plazo)} ${textos.productos.dias}` : ""}
    </span>
    <button type="button" className="boton" data-aplicar-producto data-producto-id=${producto.id} onClick=${() => abrirAplicador("producto", producto)}>
      ${textos.productos.aplicar}
    </button>
  </li>`);

  const filasDeAbonos = abonosVisibles.map((abono) => html`<li className="trabajo" key=${`abono-${abono.id}`} data-fertilizante-id=${abono.id}>
    <span className="trabajo__titulo">${abono.nombre}</span>
    <span className="trabajo__detalle">${textos.productos.riqueza}: ${riquezaEnTexto(abono) || textos.tierras.panel.noConsta}</span>
    <button type="button" className="boton" data-aplicar-producto data-fertilizante-id=${abono.id} onClick=${() => abrirAplicador("abono", abono)}>
      ${textos.productos.aplicar}
    </button>
  </li>`);

  const lista = tab === "productos" ? productosVisibles : abonosVisibles;
  const filas = tab === "productos" ? filasDeProductos : filasDeAbonos;

  const aplicador = elegido
    ? html`<section className="tarjeta" aria-labelledby="aplicador-titulo">
        <h2 className="tarjeta__titulo" id="aplicador-titulo">${elegido.nombre}</h2>
        <div className="rejilla-campos">
          <label className="campo">
            <span>${textos.productos.tierra}</span>
            <select className="campo__control" data-aplicar-tierra value=${tierraId ?? ""} onChange=${(evento) => setTierraId(Number(evento.target.value))}>
              ${(tierras || []).map((tierra) => html`<option key=${tierra.id} value=${tierra.id}>${tierra.alias}</option>`)}
            </select>
          </label>
          <label className="campo">
            <span>${textos.productos.fecha}</span>
            <input className="campo__control" type="date" data-aplicar-fecha value=${fecha} onChange=${(evento) => setFecha(evento.target.value)} />
          </label>
          <label className="campo">
            <span>${textos.productos.hectareas}</span>
            <input className="campo__control" type="tel" inputMode="decimal" data-aplicar-hectareas value=${hectareas} onChange=${(evento) => setHectareas(evento.target.value)} />
          </label>
          <label className="campo">
            <span>${textos.productos.dosis}</span>
            <input className="campo__control" type="tel" inputMode="decimal" data-aplicar-dosis value=${dosis} onChange=${(evento) => setDosis(evento.target.value)} />
          </label>
        </div>
        <p className="pagina__dato" data-aplicar-total=${textoDelTotal}>${textos.productos.total}: ${textoDelTotal}</p>
        ${aviso ? html`<p className="panel__aviso">${aviso}</p>` : null}
        <div className="estado__acciones">
          <button type="button" className="boton boton--principal" data-aplicar-guardar onClick=${guardar} disabled=${fase === "guardando"}>
            ${fase === "guardando" ? textos.productos.guardando : textos.productos.guardar}
          </button>
          <button type="button" className="boton" onClick=${cerrarAplicador}>${textos.productos.cerrar}</button>
        </div>
      </section>`
    : null;

  const guardado = resultado
    ? html`<section className="tarjeta" data-aplicar-resultado="guardado" aria-labelledby="aplicado-titulo">
        <h2 className="tarjeta__titulo" id="aplicado-titulo">${textos.productos.guardado}</h2>
        <p className="pagina__dato">${[resultado.nombre, resultado.tierra, resultado.total].filter(Boolean).join(" · ")}</p>
        <${BotonSiguiente} texto=${textos.siguiente.verDelDia} alPulsar=${() => alVerTierra(resultado.tierraId)} />
      </section>`
    : null;

  return html`<div className="pantalla-productos">
    ${cabecera}
    <div className="filtros" role="tablist" aria-label=${textos.productos.titulo}>
      <button type="button" className=${tab === "productos" ? "pastilla pastilla--activa" : "pastilla"} data-producto-tab="productos" aria-selected=${tab === "productos"} onClick=${() => setTab("productos")}>
        ${textos.productos.productos} · ${productos.length}
      </button>
      <button type="button" className=${tab === "abonos" ? "pastilla pastilla--activa" : "pastilla"} data-producto-tab="abonos" aria-selected=${tab === "abonos"} onClick=${() => setTab("abonos")}>
        ${textos.productos.abonos} · ${abonos.length}
      </button>
    </div>
    <label className="buscador">
      <span>${textos.productos.buscar}</span>
      <input className="buscador__campo" type="search" enterKeyHint="search" data-producto-buscar value=${busqueda} placeholder=${textos.productos.buscarPista} onChange=${(evento) => setBusqueda(evento.target.value)} />
    </label>
    ${lista.length
      ? html`<ul className="trabajos-lista">${filas}</ul>`
      : html`<div className="estado">
          <p className="estado__texto">${buscado ? textos.productos.sinCoincidencias : tab === "productos" ? textos.productos.sinProductos : textos.productos.sinAbonos}</p>
          <a className="boton" href="/">${textos.hoy.abrirAppVieja}</a>
        </div>`}
    ${aplicador}
    ${guardado}
  </div>`;
}

/**
 * **El cuaderno guiado**: qué toca hacer en esta tierra y a partir de cuándo.
 *
 * El servidor manda códigos y fechas (`guia` de la ficha); el texto sale de `textos.guia`, que es
 * la regla de la casa. Nunca dice qué producto usar ni cuándo fumigar: dice cuándo termina un plazo
 * que ya está apuntado.
 */
function BloqueDeLaGuia({ estado, avisos }) {
  const lista = Array.isArray(avisos) ? avisos : [];
  const textoDe = (aviso) => {
    if (aviso.codigo === "cultivo") return textos.guia.cultivo;
    const clave = `${aviso.codigo}_${aviso.estado}`;
    const texto = textos.guia[clave] || "";
    return textoRelleno(texto, {
      fecha: aviso.fecha ? fechaValidezEnTexto(aviso.fecha) : "",
      dias: aviso.dias === null ? "" : String(aviso.dias),
    });
  };
  // «Corre prisa» es para lo que está a punto de terminar (hoy o en los próximos días). Un plazo
  // **vencido** ya se puede hacer: se dice, pero no se le pone la etiqueta de prisa.
  const esAviso = (aviso) => ["hoy", "proximo"].includes(aviso.estado);
  return html`<section className="tarjeta" aria-labelledby="guia-titulo" data-guia>
    <h2 className="tarjeta__titulo" id="guia-titulo">${textos.guia.titulo}</h2>
    ${estado === "cargando"
      ? html`<p className="estado__texto">${textos.comun.cargando}</p>`
      : lista.length === 0
      ? html`<p className="estado__texto">${textos.guia.nada}</p>`
      : html`<ul className="lista-avisos" data-guia-lista>
          ${lista.map(
            (aviso) => html`<li
              key=${aviso.codigo + "-" + aviso.estado}
              className=${"lista-avisos__fila" + (esAviso(aviso) ? " lista-avisos__fila--prisa" : "")}
              data-guia-aviso=${aviso.codigo}
              data-guia-estado=${aviso.estado}
            >
              <span className="lista-avisos__punto" aria-hidden="true">${esAviso(aviso) ? "!" : "·"}</span>
              <span className="lista-avisos__texto">
                ${textoDe(aviso)}
                ${esAviso(aviso) ? html`<span className="lista-avisos__nota">${textos.guia.prisa}</span>` : null}
                ${aviso.codigo === "cultivo"
                  ? html`<span className="lista-avisos__nota">${textos.guia.cultivo_explica}</span>`
                  : null}
              </span>
            </li>`
          )}
        </ul>`}
  </section>`;
}

function VistaTierra({ tierraId, tierras, alVolver, alReintentar, alEstado, alApuntar, alIr, alVerTierra = null }) {
  const tierra = (tierras || []).find((una) => una.id === tierraId) || null;
  const ficha = usarPantalla(RUTA_TIERRA(tierraId), Boolean(tierraId));
  const [usaElServidor, setUsaElServidor] = useState(true);
  const [ventana, setVentana] = useState(false);
  const [avisoContorno, setAvisoContorno] = useState(null);
  const datos = normalizaTierra(ficha.estado === "listo" ? ficha.datos : null, tierras);

  useEffect(() => {
    if (!alEstado) return;
    if (ficha.estado === "sin-permiso") alEstado("sin-permiso");
    else if (ficha.estado === "cargando") alEstado("cargando");
    else if (ficha.estado === "error") alEstado("error");
    else alEstado(tierra ? "listo" : "vacio");
  }, [ficha.estado, tierra, alEstado]);

  if (!tierra) {
    return html`<div>
      <button type="button" className="boton" data-volver onClick=${alVolver}>${textos.tierra.volver}</button>
      <div className="estado"><p className="estado__texto">${textos.tierras.sinResultados}</p></div>
    </div>`;
  }

  const caja = cajaDeLaTierra(tierra);
  const nombreDelMunicipio = tierra.municipio || textos.tierras.sinMunicipio;

  const mapaDelCliente = caja
    ? html`<div className="mapa__lienzo">
        <img className="mapa__foto" data-mapa-imagen src=${urlDelMapa(caja, ANCHO_MAPA, ALTO_MAPA)} alt=${textos.tierra.mapa} />
        <svg className="mapa__dibujo" viewBox=${`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`} preserveAspectRatio="none" aria-hidden="true">
          ${rutaDeAnillo(tierra.anillo, caja, ANCHO_MAPA, ALTO_MAPA)
            ? html`<path className="mapa__anillo" d=${rutaDeAnillo(tierra.anillo, caja, ANCHO_MAPA, ALTO_MAPA)} style=${{ stroke: "var(--brand-bright)" }} />`
            : null}
        </svg>
      </div>`
    : html`<p className="estado__texto">${textos.tierra.sinMapa}</p>`;

  const mapa = usaElServidor && caja
    ? html`<div className="mapa__lienzo">
        <img className="mapa__foto" data-mapa-imagen src=${urlDeLaApi(RUTA_MAPA_TIERRA(tierra.id, ANCHO_MAPA, ALTO_MAPA))} alt=${textos.tierra.mapa} onError=${() => setUsaElServidor(false)} />
      </div>`
    : mapaDelCliente;

  return html`<div className="pantalla-tierra" data-tierra-id=${tierra.id}>
    <header className="pagina__cabecera">
      <div className="pagina__fila">
        <div>
          <button type="button" className="boton" data-volver onClick=${alVolver}>${textos.tierra.volver}</button>
          <h1 className="pagina__titulo">${tierra.alias}</h1>
          <p className="pagina__dato">
            ${nombreDelMunicipio}
            ${tierra.superficie_ha === null || tierra.superficie_ha === undefined ? "" : ` · ${formateaNumero(tierra.superficie_ha)} ${textos.tierras.panel.hectareas}`}
          </p>
        </div>
      </div>
    </header>

    <section className="tarjeta" aria-labelledby="mapa-tierra-titulo">
      <h2 className="tarjeta__titulo" id="mapa-tierra-titulo">${textos.tierra.mapa}</h2>
      ${mapa}
      ${usaElServidor && caja
        ? html`<p className="estado__acciones">
            <a className="boton" data-guardar-imagen-tierra href=${urlDeLaApi(RUTA_MAPA_TIERRA(tierra.id, ANCHO_MAPA, ALTO_MAPA))} download=${`tierra-${tierra.id}.png`}>${textos.apuntar.guardarImagen}</a>
          </p>`
        : null}
      <div className="estado__acciones">
        <button type="button" className="boton boton--principal" data-accion="apuntar-trabajo" onClick=${alApuntar}>
          <${Icono} nombre="apuntar" tamano=${20} />
          ${textos.apuntar.titulo}
        </button>
        <button type="button" className="boton" data-abrir-ventana-sigpac-tierra onClick=${() => setVentana(true)}>${textos.ventana.elegirEnLaTierra}</button>
      </div>
      ${avisoContorno ? html`<p className="panel__aviso panel__aviso--bien" data-contorno-aplicado>${avisoContorno}</p>` : null}
    </section>

    <${BloqueDeLaGuia} estado=${ficha.estado} avisos=${datos.guia} />

    <${Panel} tierra=${tierra} alCerrar=${alVolver} alGuardar=${alReintentar} />

    <section className="tarjeta" aria-label=${textos.siguiente.verCalendario}>
      <div className="estado__acciones">
        <${BotonSiguiente} texto=${textos.siguiente.verCalendario} alPulsar=${() => alIr("calendario")} />
        <${BotonSiguiente} texto=${textos.siguiente.verTrabajos} alPulsar=${() => alIr("trabajos")} />
      </div>
    </section>

    <${BloqueDeHoy} estado=${ficha.estado} trabajos=${datos.trabajoDeHoy} alReintentar=${ficha.reintentar} />
    <${BloqueDeHistorial} estado=${ficha.estado} anios=${datos.historial} alReintentar=${ficha.reintentar} />

    <${VentanaDelSigpac}
      abierta=${ventana}
      modo="tierra"
      tierra=${tierra}
      alCerrar=${() => setVentana(false)}
      alRefrescar=${ficha.reintentar}
      alVerTierras=${alVolver}
      alVerTierra=${(id) => { if (alVerTierra) alVerTierra(id); }}
      alUsada=${() => {
        setVentana(false);
        setAvisoContorno(textos.ventana.aplicada);
        ficha.reintentar();
        if (alReintentar) alReintentar();
      }}
    />
  </div>`;
}

function VistaCalendario({ tierras, alEstado }) {
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [elegido, setElegido] = useState(() => textoDeHoy(hoy));

  const desde = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const hasta = `${anio}-${String(mes).padStart(2, "0")}-${String(new Date(anio, mes, 0).getDate()).padStart(2, "0")}`;
  const pantalla = usarPantalla(RUTA_CALENDARIO(desde, hasta), true);
  const datos = normalizaCalendario(pantalla.estado === "listo" ? pantalla.datos : null, tierras);

  useEffect(() => {
    if (!alEstado) return;
    if (pantalla.estado === "sin-permiso") alEstado("sin-permiso");
    else if (pantalla.estado === "cargando") alEstado("cargando");
    else if (pantalla.estado === "error" || pantalla.estado === "no-disponible") alEstado("error");
    else alEstado("listo");
  }, [pantalla.estado, alEstado]);

  const porFecha = new Map(datos.dias.map((dia) => [dia.fecha, dia]));
  const celdas = rejillaDelMes(anio, mes);
  const diaElegido = elegido ? porFecha.get(elegido) || null : null;
  const hoyISO = fechaDeHoyISO();
  const totalesDelMes = totalesDeTrabajos(datos.dias.flatMap((dia) => dia.trabajos));
  const textoDelMes = textoDeTotales(totalesDelMes);

  const cambiarMes = (paso) => {
    const fecha = new Date(anio, mes - 1 + paso, 1);
    setAnio(fecha.getFullYear());
    setMes(fecha.getMonth() + 1);
    setElegido(null);
  };

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.calendario.titulo}</h1>
    <div className="calendario__barra">
      <button type="button" className="boton" data-mes-anterior aria-label=${textos.calendario.anterior} onClick=${() => cambiarMes(-1)}><${Icono} nombre="menos" tamano=${20} /></button>
      <p className="pagina__dato" data-mes-en-palabras>${nombreDeMes(anio, mes)}</p>
      <button type="button" className="boton" data-mes-siguiente aria-label=${textos.calendario.siguiente} onClick=${() => cambiarMes(1)}><${Icono} nombre="mas" tamano=${20} /></button>
    </div>
    <p className="pagina__dato" data-calendario-totales=${textoDelMes}>${textoDelMes}</p>
  </header>`;

  if (pantalla.estado === "sin-permiso") {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }
  if (pantalla.estado === "error" || pantalla.estado === "no-disponible") {
    return html`<div>
      ${cabecera}
      <p className="estado__texto">${textos.calendario.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${pantalla.reintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </div>`;
  }

  const nombresDeDias = ["L", "M", "X", "J", "V", "S", "D"];
  const celdasPintadas = celdas.map((celda, indice) => {
    if (!celda.delMes) return html`<div className="calendario__hueco" key=${`hueco-${indice}`}></div>`;
    const delDia = porFecha.get(celda.fecha);
    const cuantos = delDia ? delDia.n : 0;
    const esHoy = celda.fecha === hoyISO;
    const clase = ["calendario__dia", cuantos ? "calendario__dia--con-trabajo" : "", elegido === celda.fecha ? "calendario__dia--elegido" : "", esHoy ? "calendario__dia--hoy" : ""].filter(Boolean).join(" ");
    const palabra = cuantos === 1 ? "1 trabajo" : `${cuantos} trabajos`;
    const totalesDelDia = delDia ? totalesDeTrabajos(delDia.trabajos) : null;
    const textoDelDia = totalesDelDia && cuantos ? textoDeTotales(totalesDelDia) : "";
    const hectareasDelDia = totalesDelDia && totalesDelDia.hectareas ? `${formateaNumero(totalesDelDia.hectareas)} ha` : null;
    return html`<button type="button" key=${`dia-${celda.fecha}`} className=${clase} data-dia-calendario=${celda.fecha} data-dia-total=${textoDelDia} aria-pressed=${elegido === celda.fecha} aria-label=${`${celda.dia} · ${palabra}${hectareasDelDia ? ` · ${hectareasDelDia}` : ""}`} onClick=${() => setElegido(celda.fecha)}>
      <span className="calendario__numero">${celda.dia}</span>
      ${esHoy ? html`<span className="calendario__hoy">${textos.historial.hoy}</span>` : null}
      ${delDia ? html`<span className="calendario__cuenta">${cuantos}</span>${hectareasDelDia ? html`<span className="calendario__hectareas">${hectareasDelDia}</span>` : null}` : null}
    </button>`;
  });

  const filasDelDia = diaElegido && diaElegido.trabajos.length
    ? diaElegido.trabajos.map((trabajo, indice) => html`<${FilaDeTrabajo} key=${`dia-trabajo-${indice}`} trabajo=${trabajo} conTierra=${true} />`)
    : null;

  return html`<div className="pantalla-calendario">
    ${cabecera}
    <section className="tarjeta tarjeta--calendario" aria-label=${textos.calendario.titulo}>
      <div className="calendario__semana">${nombresDeDias.map((nombre) => html`<span className="calendario__nombre-dia" key=${nombre}>${nombre}</span>`)}</div>
      <div className="calendario__rejilla">${celdasPintadas}</div>
      ${datos.dias.length ? null : html`<p className="estado__texto">${textos.calendario.sinNada}</p>`}
    </section>

    <section className="tarjeta" data-trabajo-del-dia=${elegido || ""} aria-labelledby="dia-titulo">
      <h2 className="tarjeta__titulo" id="dia-titulo">${textos.calendario.trabajosDelDia}</h2>
      ${elegido ? html`<p className="pagina__dato">${fechaDe(elegido)}</p>` : null}
      ${filasDelDia ? html`<ul className="trabajos-lista">${filasDelDia}</ul>` : html`<p className="estado__texto">${elegido ? textos.calendario.sinTrabajo : textos.calendario.eligeDia}</p>`}
    </section>
  </div>`;
}

function VistaTrabajos({ tierras, alEstado, alIr }) {
  const [tipo, setTipo] = useState(null);
  const [tierraId, setTierraId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const ruta = queryDeTrabajos({ tipo, tierraId, desde, hasta });
  const pantalla = usarPantalla(ruta, true);
  const datos = normalizaTrabajos(pantalla.estado === "listo" ? pantalla.datos : null, tierras);

  useEffect(() => {
    if (!alEstado) return;
    if (pantalla.estado === "sin-permiso") alEstado("sin-permiso");
    else if (pantalla.estado === "cargando") alEstado("cargando");
    else if (pantalla.estado === "error") alEstado("error");
    else alEstado("listo");
  }, [pantalla.estado, alEstado]);

  const visibles = datos.trabajos.filter((trabajo) => {
    if (tierraId !== "" && Number(trabajo.tierraId) !== Number(tierraId)) return false;
    if (desde && trabajo.fecha && trabajo.fecha < desde) return false;
    if (hasta && trabajo.fecha && trabajo.fecha > hasta) return false;
    return true;
  });
  const totales = totalesDeTrabajos(visibles);
  const textoDelResumen = textoDeTotales(totales);
  const notaSinSuperficie = totales.sinSuperficie ? ` · ${totales.sinSuperficie} ${textos.trabajos.sinSuperficie}` : "";

  const descargar = () => {
    if (!visibles.length) return;
    const csv = "\uFEFF" + csvDeTrabajos(visibles);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "trabajos.csv";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  };

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.trabajos.titulo}</h1>
    <p className="pagina__dato" data-trabajos-resumen=${textoDelResumen}>${textoDelResumen}${notaSinSuperficie}</p>
    <div className="estado__acciones">
      <button type="button" className="boton" data-descargar-trabajos onClick=${descargar} disabled=${!visibles.length}>${textos.trabajos.descargar}</button>
    </div>
  </header>`;

  if (pantalla.estado === "sin-permiso") {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }
  // **La carga también se dice** (encargo de UI, 13/11/2026): antes se pintaban los filtros con
  // la lista vacía y el agricultor leía «no hay trabajos» mientras los trabajos venían de camino.
  if (pantalla.estado === "cargando") {
    return html`<div>${cabecera}<${EstadoCargando} mensaje=${textos.trabajos.cargando} /></div>`;
  }
  if (pantalla.estado === "error" || pantalla.estado === "no-disponible") {
    const avisoDelServidor = mensajesDeLaRespuesta(pantalla.detalle).join(" · ");
    return html`<div>
      ${cabecera}
      <p className="estado__texto">${avisoDelServidor || textos.trabajos.noDisponible}</p>
      <div className="estado__acciones">
        <button type="button" className="boton" data-reintentar onClick=${pantalla.reintentar}>${textos.comun.reintentar}</button>
        <a className="boton boton--principal" href="/">${textos.hoy.abrirAppVieja}</a>
      </div>
    </div>`;
  }

  const filtros = [{ clave: null, etiqueta: textos.trabajos.todos, n: datos.tipos.reduce((suma, uno) => suma + (Number(uno.n) || 0), 0) }].concat(datos.tipos);
  const botonesDeFiltro = filtros.map((filtro) => {
    const activo = (tipo || null) === (filtro.clave || null);
    return html`<button type="button" key=${`filtro-${filtro.clave || "todos"}`} className=${activo ? "pastilla pastilla--activa" : "pastilla"} data-filtro-tipo=${filtro.clave || ""} aria-pressed=${activo} onClick=${() => setTipo(filtro.clave || null)}>
      ${filtro.etiqueta} · ${filtro.n}
    </button>`;
  });

  const opcionesDeTierra = [{ id: "", alias: textos.trabajos.todas }].concat(tierras || []);
  const filtrosDeTierraYFechas = html`<div className="rejilla-campos">
    <label className="campo">
      <span>${textos.trabajos.filtroTierra}</span>
      <select className="campo__control" data-filtro-tierra value=${tierraId} onChange=${(evento) => setTierraId(evento.target.value)}>
        ${opcionesDeTierra.map((tierra) => html`<option key=${`tierra-${tierra.id}`} value=${tierra.id}>${tierra.alias}</option>`)}
      </select>
    </label>
    <label className="campo">
      <span>${textos.trabajos.desde}</span>
      <input className="campo__control" type="date" data-filtro-desde value=${desde} onChange=${(evento) => setDesde(evento.target.value)} />
    </label>
    <label className="campo">
      <span>${textos.trabajos.hasta}</span>
      <input className="campo__control" type="date" data-filtro-hasta value=${hasta} onChange=${(evento) => setHasta(evento.target.value)} />
    </label>
  </div>`;

  const porTipo = new Map();
  for (const trabajo of visibles) {
    const clave = claveDeTipo(trabajo);
    if (!porTipo.has(clave)) porTipo.set(clave, []);
    porTipo.get(clave).push(trabajo);
  }
  const tarjetasDeResumen = [...porTipo.entries()].map(([clave, suyos]) => {
    const tipoConocido = datos.tipos.find((uno) => uno.clave === clave) || null;
    return html`<article className="tarjeta-dato" key=${`resumen-${clave}`} data-resumen-tipo=${clave}>
      <h3 className="tarjeta-dato__titulo">${tipoConocido ? tipoConocido.etiqueta : suyos[0].etiqueta}</h3>
      <p className="tarjeta-dato__cifra">${suyos.length}</p>
      <p className="tarjeta-dato__nota">${textoDeTotales(totalesDeTrabajos(suyos))}</p>
    </article>`;
  });

  const filas = visibles.map((trabajo, indice) => {
    const detalles = [
      trabajo.tierra || null,
      trabajo.municipio || null,
      trabajo.hectareas === null ? null : `${formateaNumero(trabajo.hectareas)} ${textos.tierras.panel.hectareas}`,
      trabajo.cantidad === null ? null : `${formateaNumero(trabajo.cantidad)}${trabajo.unidad ? ` ${trabajo.unidad}` : ""}`,
    ].filter(Boolean);
    return html`<li className="trabajo" data-trabajo-fila key=${`trabajo-${indice}`}>
      <span className="trabajo__fecha">${fechaDe(trabajo.fecha)}</span>
      <span className="trabajo__titulo">${trabajo.etiqueta}</span>
      ${detalles.length ? html`<span className="trabajo__detalle">${detalles.join(" · ")}</span>` : null}
    </li>`;
  });

  return html`<div className="pantalla-trabajos">
    ${cabecera}
    <div className="filtros" role="group" aria-label=${textos.trabajos.filtro}>${botonesDeFiltro}</div>
    ${filtrosDeTierraYFechas}
    ${tarjetasDeResumen.length ? html`<div className="tarjetas" aria-label=${textos.trabajos.resumenPorTipo}>${tarjetasDeResumen}</div>` : null}
    ${visibles.length
      ? html`<ul className="trabajos-lista">${filas}</ul>`
      : html`<div className="estado estado--vacio" data-trabajos-vacio=${visibles.length}>
          <p className="estado__texto">${datos.trabajos.length ? textos.trabajos.sinTrabajos : textos.trabajos.sinDatos}</p>
          <div className="estado__acciones">
            ${datos.trabajos.length
              ? html`<button type="button" className="boton" data-trabajos-quitar-filtros onClick=${() => { setTipo(null); setTierraId(""); setDesde(""); setHasta(""); }}>
                  ${textos.trabajos.quitarFiltros}
                </button>`
              : html`<button type="button" className="boton boton--principal" data-trabajos-apuntar onClick=${() => alIr && alIr("apuntar")}>
                  ${textos.trabajos.apuntarUno}
                </button>`}
          </div>
        </div>`}
  </div>`;
}

function VistaFacturas({ alEstado, alIr }) {
  const lista = usarPantalla(RUTA_FACTURAS, true);
  const [fotos, setFotos] = useState([]);
  const [propuesta, setPropuesta] = useState(null);
  const [fase, setFase] = useState("inicial");
  const [aviso, setAviso] = useState(null);
  const [resultado, setResultado] = useState(null);
  const urls = useRef([]);

  useEffect(() => () => urls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  useEffect(() => {
    if (!alEstado) return;
    if (fase === "sin-permiso") alEstado("sin-permiso");
    else if (fase === "leyendo" || fase === "guardando" || lista.estado === "cargando") alEstado("cargando");
    else alEstado("listo");
  }, [fase, lista.estado, alEstado]);

  const anadirFotos = (evento) => {
    const ficheros = Array.from(evento.target.files || []);
    if (!ficheros.length) return;
    const nuevas = ficheros.map((fichero) => {
      const url = URL.createObjectURL(fichero);
      urls.current.push(url);
      return { id: `${fichero.name}-${fichero.lastModified}-${Math.random().toString(36).slice(2)}`, fichero, url };
    });
    setFotos((previas) => [...previas, ...nuevas]);
    setAviso(null);
    evento.target.value = "";
  };

  const quitarFoto = (id) => setFotos((previas) => previas.filter((foto) => foto.id !== id));

  const leer = async () => {
    if (!fotos.length) {
      setAviso(textos.facturas.sinFotos);
      return;
    }
    setFase("leyendo");
    setAviso(null);
    const formulario = new FormData();
    formulario.append("fichero", fotos[0].fichero);
    const respuesta = await pedirFormulario(RUTA_FACTURAS_LEER, formulario);
    if (respuesta.estado === "ok") {
      setPropuesta(normalizaPropuestaDeFactura(respuesta.datos));
      setFase("revisando");
      return;
    }
    if (respuesta.estado === "sin-permiso") {
      setFase("sin-permiso");
      return;
    }
    setPropuesta(normalizaPropuestaDeFactura({}));
    setFase("revisando");
    setAviso(textos.facturas.noSeLeyo);
  };

  const escribirAMano = () => {
    setPropuesta(normalizaPropuestaDeFactura({}));
    setFase("revisando");
    setAviso(null);
  };

  const cambiarPropuesta = (clave, valor) => setPropuesta((previa) => ({ ...(previa || {}), [clave]: valor }));
  const cambiarLinea = (indice, clave, valor) =>
    setPropuesta((previa) => {
      const lineas = (previa.lineas || []).map((linea, suyo) => (suyo === indice ? { ...linea, [clave]: clave === "descripcion" ? valor : numeroDe(valor) } : linea));
      return { ...previa, lineas };
    });

  const guardar = async () => {
    if (!propuesta) return;
    setFase("guardando");
    setAviso(null);
    const formulario = new FormData();
    formulario.append("datos", JSON.stringify(cuerpoDeLaFactura(propuesta)));
    if (fotos.length) formulario.append("fichero", fotos[0].fichero);
    const respuesta = await pedirFormulario(RUTA_FACTURAS, formulario);
    if (respuesta.estado !== "ok") {
      setFase(respuesta.estado === "sin-permiso" ? "sin-permiso" : "error");
      setAviso(textos.facturas.noSeGuardo);
      return;
    }
    const guardada = respuesta.datos || {};
    let extras = 0;
    let extrasQueNo = 0;
    for (const foto of fotos.slice(1)) {
      const numero = guardada.numero_factura || guardada.id || "";
      const documento = await pedir(RUTA_DOCUMENTOS, conCuerpoJson({ titulo: `Foto de la factura ${numero}`.trim(), tipo: "factura", notas: "Foto guardada al apuntar la factura", fecha: guardada.fecha || null }));
      if (documento.estado !== "ok" || !documento.datos || !documento.datos.id) {
        extrasQueNo += 1;
        continue;
      }
      const formularioDelDocumento = new FormData();
      formularioDelDocumento.append("fichero", foto.fichero);
      const subida = await pedirFormulario(RUTA_DOCUMENTO_FICHERO(documento.datos.id), formularioDelDocumento);
      if (subida.estado === "ok") extras += 1;
      else extrasQueNo += 1;
    }
    setResultado({ factura: guardada, extras, extrasQueNo, yaEstaba: Boolean(guardada.ya_estaba) });
    setFase("guardada");
    setPropuesta(null);
    setAviso(null);
    if (lista.reintentar) lista.reintentar();
  };

  const cabecera = html`<header className="pagina__cabecera">
    <h1 className="pagina__titulo">${textos.facturas.titulo}</h1>
    <p className="pagina__dato">${textos.facturas.intro}</p>
  </header>`;

  if (fase === "sin-permiso") {
    return html`<div>${cabecera}<${EstadoSinPermiso} mensaje=${textos.comun.sinPermiso} /></div>`;
  }

  const previas = fotos.map((foto, indice) => html`<li className="foto" key=${foto.id}>
    <img className="foto__imagen" src=${foto.url} alt=${`${textos.facturas.fotos} ${indice + 1}`} />
    <button type="button" className="boton boton--icono" aria-label=${textos.facturas.quitar} onClick=${() => quitarFoto(foto.id)}><${Icono} nombre="cerrar" tamano=${20} /></button>
  </li>`);

  const campos = propuesta
    ? html`<div className="rejilla-campos">
        <label className="campo"><span>${textos.facturas.proveedor}</span><input className="campo__control" type="text" value=${propuesta.proveedor || ""} onChange=${(evento) => cambiarPropuesta("proveedor", evento.target.value)} /></label>
        <label className="campo"><span>${textos.facturas.nif}</span><input className="campo__control" type="text" value=${propuesta.nif || ""} onChange=${(evento) => cambiarPropuesta("nif", evento.target.value)} /></label>
        <label className="campo"><span>${textos.facturas.numero}</span><input className="campo__control" type="text" value=${propuesta.numero || ""} onChange=${(evento) => cambiarPropuesta("numero", evento.target.value)} /></label>
        <label className="campo"><span>${textos.facturas.fecha}</span><input className="campo__control" type="date" value=${propuesta.fecha || ""} onChange=${(evento) => cambiarPropuesta("fecha", evento.target.value)} /></label>
        <label className="campo"><span>${textos.facturas.base}</span><input className="campo__control" type="text" inputMode="decimal" value=${propuesta.base === null ? "" : String(propuesta.base)} onChange=${(evento) => cambiarPropuesta("base", numeroDe(evento.target.value))} /></label>
        <label className="campo"><span>${textos.facturas.iva}</span><input className="campo__control" type="text" inputMode="decimal" value=${propuesta.iva === null ? "" : String(propuesta.iva)} onChange=${(evento) => cambiarPropuesta("iva", numeroDe(evento.target.value))} /></label>
        <label className="campo"><span>${textos.facturas.total}</span><input className="campo__control" type="text" inputMode="decimal" value=${propuesta.total === null ? "" : String(propuesta.total)} onChange=${(evento) => cambiarPropuesta("total", numeroDe(evento.target.value))} /></label>
      </div>`
    : null;

  const lineas = propuesta && propuesta.lineas.length
    ? html`<div>
        <h3 className="panel__subtitulo">${textos.facturas.lineas}</h3>
        <ul className="trabajos-lista">
          ${propuesta.lineas.map((linea, indice) => html`<li className="trabajo" key=${`linea-${indice}`}>
            <input className="campo__control" type="text" value=${linea.descripcion || ""} aria-label=${textos.facturas.lineas} onChange=${(evento) => cambiarLinea(indice, "descripcion", evento.target.value)} />
            <span className="trabajo__detalle">
              ${linea.cantidad === null ? "" : `${formateaNumero(linea.cantidad)} ${linea.unidad || ""}`}
              ${linea.importe === null ? "" : `${textos.facturas.total}: ${formateaNumero(linea.importe)} €`}
            </span>
          </li>`)}
        </ul>
      </div>`
    : propuesta
      ? html`<p className="estado__texto">${textos.facturas.sinLineas}</p>`
      : null;

  const revisar = propuesta
    ? html`<section className="tarjeta" data-factura-propuesta aria-labelledby="propuesta-titulo">
        <h2 className="tarjeta__titulo" id="propuesta-titulo">${textos.facturas.propuesta}</h2>
        <p className="pagina__dato">${textos.facturas.propuestaAyuda}</p>
        ${(propuesta.avisos || []).map((texto, indice) => html`<p className="panel__aviso" key=${`aviso-${indice}`}>${texto}</p>`)}
        ${campos}
        ${lineas}
        <button type="button" className="boton boton--principal" data-factura-guardar onClick=${guardar} disabled=${fase === "guardando"}>
          ${fase === "guardando" ? textos.facturas.guardando : textos.facturas.guardar}
        </button>
        ${aviso ? html`<p className="panel__aviso">${aviso}</p>` : null}
      </section>`
    : null;

  let bloqueDelResultado = null;
  if (resultado) {
    const partes = [resultado.factura.numero_factura || textos.facturas.guardada, resultado.factura.total === null ? null : `${formateaNumero(resultado.factura.total)} €`].filter(Boolean);
    bloqueDelResultado = html`<section className="tarjeta" data-factura-resultado="guardada" aria-labelledby="resultado-titulo">
      <h2 className="tarjeta__titulo" id="resultado-titulo">${textos.facturas.guardada}</h2>
      <p className="pagina__dato">${partes.join(" · ")}</p>
      ${resultado.yaEstaba ? html`<p className="panel__aviso">${textos.facturas.yaEstaba}</p>` : null}
      ${resultado.extras ? html`<p className="pagina__dato">${resultado.extras} fotos guardadas en Documentos</p>` : null}
      ${resultado.extrasQueNo ? html`<p className="panel__aviso">${resultado.extrasQueNo} fotos no se han podido guardar</p>` : null}
      ${resultado.extras || resultado.extrasQueNo ? html`<p className="panel__nota">${textos.facturas.fotosDeMas}</p>` : null}
      <div className="estado__acciones"><${BotonSiguiente} texto=${textos.siguiente.eligeTierra} alPulsar=${() => alIr && alIr("tierras")} /></div>
    </section>`;
  }

  let bloqueDeFacturas = null;
  if (lista.estado === "cargando") {
    bloqueDeFacturas = html`<p className="estado__texto">${textos.facturas.cargando}</p>`;
  } else if (lista.estado === "sin-permiso") {
    bloqueDeFacturas = html`<p className="estado__texto">${textos.comun.sinPermiso}</p>`;
  } else if (lista.estado === "error" || lista.estado === "no-disponible") {
    bloqueDeFacturas = html`<p className="estado__texto">${textos.facturas.noDisponible}</p>`;
  } else {
    const facturas = Array.isArray(lista.datos) ? lista.datos : [];
    bloqueDeFacturas = facturas.length
      ? html`<ul className="trabajos-lista">${facturas.slice(0, 10).map((factura) => html`<li className="trabajo" key=${`factura-${factura.id}`}>
          <span className="trabajo__fecha">${fechaDe(factura.fecha)}</span>
          <span className="trabajo__titulo">${factura.proveedor || textos.tierras.panel.noConsta}</span>
          <span className="trabajo__detalle">
            ${factura.numero_factura ? `${factura.numero_factura} · ` : ""}
            ${factura.total === null || factura.total === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(factura.total)} €`}
            ${factura.anulada ? ` · ${textos.facturas.anulada}` : ""}
          </span>
        </li>`)}</ul>`
      : html`<p className="estado__texto">${textos.facturas.sinFacturas}</p>`;
  }

  return html`<div className="pantalla-facturas">
    ${cabecera}
    <div className="estado__acciones">
      <label className="boton boton--principal boton--grande">
        <${Icono} nombre="apuntar" />
        ${textos.facturas.foto}
        <input className="ojo-solo" type="file" accept="image/*" capture="environment" multiple data-factura-foto onChange=${anadirFotos} />
      </label>
      <label className="boton">
        ${textos.facturas.archivo}
        <input className="ojo-solo" type="file" accept="image/*,application/pdf" multiple data-factura-archivo onChange=${anadirFotos} />
      </label>
    </div>
    ${fotos.length ? html`<ul className="fotos" aria-label=${textos.facturas.fotos}>${previas}</ul>` : html`<p className="estado__texto">${textos.facturas.sinFotos}</p>`}
    <div className="estado__acciones">
      <button type="button" className="boton boton--principal" data-factura-leer onClick=${leer} disabled=${fase === "leyendo"}>${fase === "leyendo" ? textos.facturas.leyendo : textos.facturas.leer}</button>
      <button type="button" className="boton" onClick=${escribirAMano}>${textos.facturas.aMano}</button>
    </div>
    ${aviso && !propuesta ? html`<p className="panel__aviso">${aviso}</p>` : null}
    ${bloqueDelResultado}
    ${revisar}
    <section className="tarjeta" aria-labelledby="ultimas-titulo">
      <h2 className="tarjeta__titulo" id="ultimas-titulo">${textos.facturas.ultimas}</h2>
      ${bloqueDeFacturas}
    </section>
  </div>`;
}

function VistaMas({ ir }) {
  const opciones = [
    { clave: "facturas", etiqueta: textos.mas.facturas, texto: textos.facturas.intro },
    { clave: "trabajos", etiqueta: textos.mas.trabajos, texto: textos.trabajos.filtro },
    { clave: "productos", etiqueta: textos.nav.productos, texto: textos.productos.intro },
    { clave: "cuaderno", etiqueta: textos.nav.cuaderno, texto: textos.cuaderno.intro },
  ];
  return html`<div className="pantalla-mas">
    <header className="pagina__cabecera">
      <h1 className="pagina__titulo">${textos.mas.titulo}</h1>
      <p className="pagina__dato">${textos.mas.intro}</p>
    </header>
    <div className="tarjetas">
      ${opciones.map((opcion) => html`<button type="button" className="tarjeta tarjeta--boton" key=${opcion.clave} onClick=${() => ir(opcion.clave)} data-accion=${`ir-${opcion.clave}`}>
        <h2 className="tarjeta__titulo">${opcion.etiqueta}</h2>
        <p className="tarjeta-dato__nota">${opcion.texto}</p>
      </button>`)}
      <a className="tarjeta tarjeta--boton" href="/">
        <h2 className="tarjeta__titulo">${textos.mas.ajustes}</h2>
        <p className="tarjeta-dato__nota">${textos.hoy.abrirAppVieja}</p>
      </a>
    </div>
  </div>`;
}

function VentanaDelSigpac({ abierta, modo, tierra, alCerrar, alUsada, alRefrescar = null, alVerTierras = null, alVerTierra = null }) {
  const [referencia, setReferencia] = useState("");
  const [textoMunicipio, setTextoMunicipio] = useState("");
  const [opcionesMunicipio, setOpcionesMunicipio] = useState([]);
  const [elegido, setElegido] = useState(null);
  const [agregado, setAgregado] = useState("0");
  const [zona, setZona] = useState("0");
  const [poligono, setPoligono] = useState("");
  const [parcela, setParcela] = useState("");
  const [estado, setEstado] = useState("inicial");
  const [recintos, setRecintos] = useState([]);
  const [caja, setCaja] = useState(null);
  const [elegidoRecintoId, setElegidoRecintoId] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [usando, setUsando] = useState(false);
  const dialogo = useRef(null);
  const temporizador = useRef(null);
  // La tierra que se ha elegido en la lista de las que no se han podido poner: la ventana se
  // rellena con ella y busca sola, **por el mismo camino que al abrirla desde la ficha**
  // (`modo = "tierra"`). `vecesQueSeElige` fuerza a repetir la búsqueda si se pulsa dos veces
  // la misma tierra, que si no la clave de apertura no cambiaría.
  const [tierraParaElegir, setTierraParaElegir] = useState(null);
  const [vecesQueSeElige, setVecesQueSeElige] = useState(0);
  const tierraDeLaVentana = tierraParaElegir || tierra;
  const modoDeLaVentana = tierraParaElegir ? "tierra" : modo;
  // Lo que la tierra ya tiene (referencia o códigos), del servidor: la lista no trae esos códigos.
  const parcelaGuardada = usarPantalla(
    RUTA_PARCELA(tierraDeLaVentana && tierraDeLaVentana.id ? tierraDeLaVentana.id : 0),
    abierta && modoDeLaVentana === "tierra" && Boolean(tierraDeLaVentana && tierraDeLaVentana.id),
  );
  const [autoBusqueda, setAutoBusqueda] = useState(false);
  const claveDeApertura = useRef(null);
  const claveBuscada = useRef(null);

  const recinto = recintoElegido(recintos, elegidoRecintoId);

  // Los mapas de provincia que ya están guardados en este ordenador. Se pregunta al abrir la
  // ventana; si no hay ninguno se dice y **no se dispara ninguna descarga grande**.
  const cache = usarPantalla(RUTA_CACHE_SIGPAC, abierta);
  const estadoDeLaCache = normalizaCacheSigpac(cache.estado === "listo" ? cache.datos : null);
  const provinciasDelMapa = estadoDeLaCache.provincias;
  const [provinciaCache, setProvinciaCache] = useState(null);
  const [faseCache, setFaseCache] = useState("inicial");
  const [avisoCache, setAvisoCache] = useState(null);
  const [resultadoCache, setResultadoCache] = useState(null);
  // Refrescar las tierras al cerrar: si se hace en el momento, la pantalla de debajo se pone a
  // cargar, la ventana se desmonta y el resultado que acaba de salir desaparece de la vista.
  const refrescarAlCerrar = useRef(false);
  const refrescarDeVerdad = useRef(alRefrescar);

  useEffect(() => {
    refrescarDeVerdad.current = alRefrescar;
  }, [alRefrescar]);

  useEffect(() => () => {
    if (refrescarAlCerrar.current && refrescarDeVerdad.current) refrescarDeVerdad.current();
  }, []);

  useEffect(() => {
    if (!provinciasDelMapa.length) {
      setProvinciaCache(null);
      return;
    }
    if (!provinciasDelMapa.some((ficha) => ficha.provincia === provinciaCache)) {
      setProvinciaCache(provinciasDelMapa[0].provincia);
    }
  }, [provinciasDelMapa.length]);

  useEffect(() => {
    if (!abierta) {
      setFaseCache("inicial");
      setAvisoCache(null);
      setResultadoCache(null);
    }
  }, [abierta]);

  const traerLosContornos = async () => {
    const ficha = provinciasDelMapa.find((una) => una.provincia === provinciaCache) || null;
    if (!ficha) return;
    const ruta = rutaDeLosContornos(ficha.provincia, ficha.campana);
    if (!ruta) {
      setAvisoCache(textos.ventana.cache.noSePudo);
      return;
    }
    setFaseCache("trayendo");
    setAvisoCache(null);
    setResultadoCache(null);
    const respuesta = await pedirConDetalle(ruta, { method: "POST" });
    if (respuesta.estado === "ok") {
      const datosDeLosContornos = respuesta.datos || {};
      setFaseCache("listo");
      setResultadoCache({
        lineas: lineasDeLosContornos(datosDeLosContornos),
        actualizadas: actualizadasDeLosContornos(datosDeLosContornos),
        // Las que no se han podido poner, con su motivo tal cual: la ventana ya no lo tira.
        sinCodigos: sinCodigosDeLosContornos(datosDeLosContornos),
      });
      refrescarAlCerrar.current = true;
      return;
    }
    setFaseCache("error");
    if (respuesta.estado === "sin-permiso") setAvisoCache(textos.comun.sinPermiso);
    else if (respuesta.codigo === 404) setAvisoCache(textos.ventana.cache.noHayMapa);
    else if (respuesta.codigo === 409) setAvisoCache(textos.ventana.cache.faltaElFichero);
    else setAvisoCache(textos.ventana.cache.noSePudo);
  };

  // Al abrir: el foco dentro de la ventana, para poder cerrarla con el teclado.
  useEffect(() => {
    if (!abierta) return undefined;
    const foco = setTimeout(() => {
      if (dialogo.current) dialogo.current.focus();
    }, 0);
    const alPulsar = (evento) => {
      if (evento.key === "Escape") {
        evento.stopPropagation();
        alCerrar();
      }
    };
    document.addEventListener("keydown", alPulsar);
    return () => {
      clearTimeout(foco);
      document.removeEventListener("keydown", alPulsar);
    };
  }, [abierta, alCerrar]);

  // El pueblo se busca en la lista oficial: escribirlo a mano no sirve.
  useEffect(() => {
    if (!abierta) return undefined;
    clearTimeout(temporizador.current);
    const texto = textoMunicipio.trim();
    if (texto.length < 2) {
      setOpcionesMunicipio([]);
      return undefined;
    }
    temporizador.current = setTimeout(async () => {
      const respuesta = await pedir(`${RUTA_MUNICIPIOS}?buscar=${encodeURIComponent(texto)}`);
      if (respuesta.estado === "ok") setOpcionesMunicipio(normalizaMunicipios(respuesta.datos));
    }, 250);
    return () => clearTimeout(temporizador.current);
  }, [abierta, textoMunicipio]);

  useEffect(() => {
    if (!abierta) {
      setEstado("inicial");
      setRecintos([]);
      setCaja(null);
      setElegidoRecintoId(null);
      setAviso(null);
      setResultado(null);
      setReferencia("");
      setTextoMunicipio("");
      setOpcionesMunicipio([]);
      setElegido(null);
      setPoligono("");
      setParcela("");
      setAgregado("0");
      setZona("0");
      setAutoBusqueda(false);
      setTierraParaElegir(null);
      setVecesQueSeElige(0);
      claveDeApertura.current = null;
      claveBuscada.current = null;
    }
  }, [abierta]);

  /** El cuerpo de la búsqueda a partir de unos campos ya calculados (sin leer estados). */
  const cuerpoDeLosCampos = (campos) => {
    if (campos.referencia) return { cuerpo: cuerpoDeBusquedaPorReferencia(campos.referencia), recinto: campos.recinto };
    const cuerpo = cuerpoDeBusquedaPorMunicipio({
      elegido: campos.municipio && campos.provincia ? { nombre: campos.municipio, provincia: campos.provincia } : null,
      agregado: campos.agregado,
      zona: campos.zona,
      poligono: campos.poligono,
      parcela: campos.parcela,
    });
    return cuerpo ? { cuerpo, recinto: campos.recinto } : null;
  };

  useEffect(() => {
    const clave = `${abierta ? "abierta" : "cerrada"}|${modoDeLaVentana}|${tierraDeLaVentana && tierraDeLaVentana.id ? tierraDeLaVentana.id : ""}|${vecesQueSeElige}`;
    const esDeTierra = abierta && modoDeLaVentana === "tierra" && Boolean(tierraDeLaVentana && tierraDeLaVentana.id);
    if (!esDeTierra) {
      if (claveDeApertura.current !== clave) {
        claveDeApertura.current = clave;
        claveBuscada.current = null;
        setAutoBusqueda(false);
      }
      return;
    }
    if (claveDeApertura.current === clave) return;
    // Se espera a los datos del servidor para no precargar con la lista, que no trae los códigos.
    if (parcelaGuardada.estado === "cargando" || parcelaGuardada.estado === "inicial") return;
    // **Y se espera a que los datos sean de ESTA tierra.** Al elegir otra desde la lista de las que
    // se quedaron sin códigos, el estado puede seguir un instante en «listo» con los datos de la
    // tierra anterior; rellenar con esos buscaría la parcela equivocada. Solo se espera cuando el
    // objetivo ha cambiado así: la apertura desde la ficha ya nace en «cargando».
    if (tierraParaElegir && parcelaGuardada.estado === "listo") {
      const deQuienSon = parcelaGuardada.datos && parcelaGuardada.datos.id;
      // Si la respuesta no trae su identificador (no debería), no se espera: antes se rellena con
      // lo que hay que quedarse mirando la ventana vacía para siempre.
      if (deQuienSon !== null && deQuienSon !== undefined && String(deQuienSon) !== String(tierraDeLaVentana && tierraDeLaVentana.id)) return;
    }
    claveDeApertura.current = clave;
    const campos = camposInicialesDelSigpac(tierraDeLaVentana, parcelaGuardada.estado === "listo" ? parcelaGuardada.datos : null);
    setReferencia(campos.referencia);
    setTextoMunicipio(campos.municipio);
    setElegido(campos.municipio && campos.provincia ? { nombre: campos.municipio, provincia: campos.provincia } : null);
    setAgregado(campos.agregado);
    setZona(campos.zona);
    setPoligono(campos.poligono);
    setParcela(campos.parcela);
    const previsto = cuerpoDeLosCampos(campos);
    if (previsto && claveBuscada.current !== clave) {
      claveBuscada.current = clave;
      setAutoBusqueda(true);
      buscar(previsto.recinto, previsto.cuerpo);
    }
  }, [abierta, modoDeLaVentana, tierraDeLaVentana && tierraDeLaVentana.id, vecesQueSeElige, parcelaGuardada.estado, parcelaGuardada.datos]);

  const buscar = async (recintoPreferido = null, cuerpoDeLaVez = null) => {
    const cuerpo = cuerpoDeLaVez || (referencia.trim()
      ? cuerpoDeBusquedaPorReferencia(referencia)
      : cuerpoDeBusquedaPorMunicipio({ elegido, agregado, zona, poligono, parcela }));
    if (!cuerpo) {
      setAviso(referencia.trim() ? textos.ventana.sinBusqueda : textos.ventana.sinMunicipioElegido);
      return;
    }
    setEstado("buscando");
    setAviso(null);
    setResultado(null);
    const respuesta = await pedir(RUTA_BUSCAR, conCuerpoJson(cuerpo));
    if (respuesta.estado !== "ok") {
      setEstado(respuesta.estado === "sin-permiso" ? "sin-permiso" : "error");
      return;
    }
    const encontrados = (respuesta.datos && respuesta.datos.recintos) || [];
    setRecintos(encontrados);
    const conDibujo = recintosConPuntos(encontrados);
    setCaja(cajaDeLosRecintos(conDibujo));
    const primeroConForma = encontrados.find((uno) => puedeUsarseElRecinto(uno));
    const preferido = recintoPreferido !== null && encontrados.some((uno) => String(uno.recinto) === String(recintoPreferido))
      ? recintoPreferido
      : null;
    setElegidoRecintoId(preferido !== null ? preferido : (primeroConForma ? primeroConForma.recinto : encontrados[0] ? encontrados[0].recinto : null));
    setEstado(encontrados.length ? "listo" : "vacio");
  };

  const usar = async () => {
    if (!recinto) return;
    const avisoDeForma = avisoSinForma(recinto);
    if (avisoDeForma) {
      setAviso(avisoDeForma);
      return;
    }
    setUsando(true);
    setAviso(null);
    let respuesta = null;
    if (modoDeLaVentana === "tierra" && tierraDeLaVentana) {
      respuesta = await pedir(RUTA_CONTORNO(tierraDeLaVentana.id), conCuerpoJson(cuerpoDelContorno(recinto)));
      if (respuesta.estado === "no-disponible") {
        setUsando(false);
        setAviso(textos.ventana.contornoNoDisponible);
        return;
      }
    } else {
      respuesta = await pedir(
        RUTA_PARCELA_UNA,
        conCuerpoJson({
          ref_sigpac: recinto.referencia,
          provincia: (recinto.municipio && recinto.municipio.provincia) || null,
          municipio: (recinto.municipio && recinto.municipio.nombre) || null,
        }),
      );
    }
    setUsando(false);
    if (respuesta.estado === "ok") {
      setResultado(modoDeLaVentana === "tierra" ? textos.ventana.aplicada : textos.ventana.anadida);
      if (alUsada) alUsada(modoDeLaVentana);
      alCerrar();
      return;
    }
    if (respuesta.estado === "sin-permiso") {
      setEstado("sin-permiso");
      return;
    }
    setAviso(textos.ventana.noSePudo);
  };

  /**
   * **Abre esta misma ventana rellena con una tierra que se ha quedado sin códigos.**
   *
   * Es el camino que ya existe al abrirla desde la ficha (`modo = "tierra"`): la ventana pide los
   * datos de la tierra al servidor, rellena la referencia y los códigos y busca una vez. No hay
   * otra ventana ni otra búsqueda: se cambia a qué tierra apunta esta.
   */
  const elegirElRecintoDeLaTierra = (tierra) => {
    if (!tierra || tierra.id === null || tierra.id === undefined) return;
    setTierraParaElegir({ id: tierra.id, alias: tierra.alias });
    setVecesQueSeElige((veces) => veces + 1);
    // Lo de la búsqueda anterior se tira: lo que salga tiene que ser de esta tierra.
    setRecintos([]);
    setCaja(null);
    setElegidoRecintoId(null);
    setEstado("inicial");
    setAviso(null);
    setResultado(null);
    if (dialogo.current) dialogo.current.scrollTop = 0;
  };

  if (!abierta) return null;

  const dibujos = [];
  const elegirRecintoDelMapa = (uno) => setElegidoRecintoId(uno.recinto);
  const teclaDelRecinto = (evento, uno) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      elegirRecintoDelMapa(uno);
    }
  };
  if (caja) {
    // Primero las zonas de toque (detrás) y después el trazo visible y la etiqueta: así el dedo
    // acierta en un recinto pequeño y las etiquetas no se comen el toque.
    for (const uno of recintosConPuntos(recintos)) {
      const caminoParaTocar = rutaDeAnillo(uno.puntos, caja, ANCHO_MAPA, ALTO_MAPA);
      if (!caminoParaTocar) continue;
        dibujos.push(html`<path
          key=${`toque-${uno.recinto}`}
          className="mapa__anillo mapa__anillo--toque"
          d=${caminoParaTocar}
          data-mapa-toque=${uno.recinto}
          aria-hidden="true"
          onClick=${() => elegirRecintoDelMapa(uno)}
        />`);
    }
    for (const uno of recintosConPuntos(recintos)) {
      const camino = rutaDeAnillo(uno.puntos, caja, ANCHO_MAPA, ALTO_MAPA);
      if (!camino) continue;
      const elegidoAqui = String(uno.recinto) === String(elegidoRecintoId);
      const estilo = elegidoAqui
        ? { stroke: uno.color, strokeWidth: 6, fill: "var(--brand-tint)" }
        : { stroke: uno.color };
      dibujos.push(html`<path
        key=${`ventana-${uno.recinto}`}
        className=${elegidoAqui ? "mapa__anillo mapa__anillo--recinto mapa__anillo--elegido" : "mapa__anillo mapa__anillo--recinto"}
        d=${camino}
        style=${estilo}
        data-sigpac-dibujo-recinto=${uno.recinto}
        role="button"
        tabIndex="0"
        aria-label=${etiquetaDelRecintoEnElMapa(uno)}
        aria-pressed=${elegidoAqui}
        onClick=${() => elegirRecintoDelMapa(uno)}
        onKeyDown=${(evento) => teclaDelRecinto(evento, uno)}
      >
        <title>${`${textos.ventana.recinto} ${uno.recinto} · ${uno.uso || ""}`}</title>
      </path>`);
      const proyectado = proyeccionDeAnillo(uno.puntos, caja, ANCHO_MAPA, ALTO_MAPA);
      const punto = proyectado && proyectado.length ? proyectado[0] : null;
      if (punto) {
        dibujos.push(html`<text key=${`etiqueta-${uno.recinto}`} x=${punto[0] + 6} y=${punto[1] - 6} aria-hidden="true" style=${{ fill: "var(--ink)", fontSize: "16px", fontWeight: "600", paintOrder: "stroke", stroke: "var(--surface-card)", strokeWidth: "3", pointerEvents: "none" }}>${uno.recinto}</text>`);
      }
    }
  }

  const mapa = caja
    ? html`<div className="mapa__lienzo">
        <img className="mapa__foto" data-mapa-imagen src=${urlDelMapa(caja, ANCHO_MAPA, ALTO_MAPA)} alt=${textos.ventana.titulo} />
        <svg className="mapa__dibujo" viewBox=${`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`} preserveAspectRatio="none" role="group" aria-label=${textos.ventana.resultados}>${dibujos}</svg>
      </div>`
    : html`<p className="estado__texto">${textos.ventana.sinMapa}</p>`;

  const opciones = opcionesMunicipio.map((municipio) => html`<li key=${`municipio-${municipio.etiqueta}`}>
    <button type="button" className="opcion" data-sigpac-municipio-opcion=${municipio.etiqueta} onClick=${() => { setElegido(municipio); setTextoMunicipio(municipio.etiqueta); setOpcionesMunicipio([]); }}>
      ${municipio.etiqueta}
    </button>
  </li>`);

  const filasRecintos = recintos.map((uno) => {
    const activo = String(uno.recinto) === String(elegidoRecintoId);
    const detalles = [
      `${textos.ventana.superficie}: ${uno.superficie_ha === null || uno.superficie_ha === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(uno.superficie_ha)} ${textos.tierras.panel.hectareas}`}`,
      `${textos.ventana.uso}: ${uno.uso || uno.uso_sigpac || textos.tierras.panel.noConsta}`,
      `${textos.ventana.pendiente}: ${uno.pendiente_pct === null || uno.pendiente_pct === undefined ? textos.tierras.panel.noConsta : `${formateaNumero(uno.pendiente_pct, 1)} %`}`,
      `${textos.ventana.coeficiente}: ${uno.coeficiente_regadio === null || uno.coeficiente_regadio === undefined ? textos.tierras.panel.noConsta : formateaNumero(uno.coeficiente_regadio)}`,
      `${textos.ventana.region}: ${uno.region || textos.tierras.panel.noConsta}`,
      `${textos.ventana.admisibilidad}: ${uno.admisibilidad === null || uno.admisibilidad === undefined ? textos.tierras.panel.noConsta : uno.admisibilidad}`,
    ];
    return html`<li key=${`recinto-${uno.recinto}`}>
      <button
        type="button"
        className=${activo ? "tierra tierra--elegida" : "tierra"}
        data-sigpac-recinto-id=${uno.recinto}
        aria-pressed=${activo}
        onClick=${() => setElegidoRecintoId(uno.recinto)}
      >
        <span className="tierra__alias">${textos.ventana.recinto} ${uno.recinto}</span>
        <span className="tierra__detalle">${detalles.join(" · ")}</span>
      </button>
    </li>`;
  });

  const avisoDeForma = recinto ? avisoSinForma(recinto) : null;

  return html`<div className="modal" data-ventana-sigpac data-sigpac-autobusqueda=${autoBusqueda ? "true" : undefined} role="dialog" aria-modal="true" aria-labelledby="ventana-titulo">
    <div className="modal__fondo" aria-hidden="true"></div>
    <div className="modal__caja" tabIndex="-1" ref=${dialogo}>
      <div className="modal__cabecera">
        <h2 className="tarjeta__titulo" id="ventana-titulo">${textos.ventana.titulo}</h2>
        <button type="button" className="boton boton--icono" data-ventana-cerrar aria-label=${textos.ventana.cerrar} onClick=${alCerrar}>
          <${Icono} nombre="cerrar" tamano=${20} />
        </button>
      </div>
      <p className="pagina__dato">${textos.ventana.intro}</p>

      <div className="sigpac__formas">
        <label className="campo">
          <span>${textos.ventana.porReferencia}</span>
          <input className="campo__control" type="tel" inputMode="decimal" enterKeyHint="search" data-sigpac-buscar-referencia placeholder=${textos.ventana.pistaReferencia} value=${referencia} onChange=${(evento) => setReferencia(evento.target.value)} />
        </label>
        <label className="campo">
          <span>${textos.ventana.porMunicipio}</span>
          <input className="campo__control" type="search" enterKeyHint="search" data-sigpac-buscar-municipio placeholder=${textos.ventana.pistaMunicipio} value=${textoMunicipio} onChange=${(evento) => { setTextoMunicipio(evento.target.value); setElegido(null); }} />
        </label>
        ${opciones.length ? html`<ul className="opciones">${opciones}</ul>` : null}
        <div className="rejilla-campos">
          <label className="campo"><span>${textos.ventana.agregado}</span>
            <input className="campo__control" type="number" min="0" inputMode="numeric" data-sigpac-agregado value=${agregado} onChange=${(evento) => setAgregado(evento.target.value)} />
          </label>
          <label className="campo"><span>${textos.ventana.zona}</span>
            <input className="campo__control" type="number" min="0" inputMode="numeric" data-sigpac-zona value=${zona} onChange=${(evento) => setZona(evento.target.value)} />
          </label>
          <label className="campo"><span>${textos.ventana.poligono}</span>
            <input className="campo__control" type="number" min="0" inputMode="numeric" data-sigpac-poligono value=${poligono} onChange=${(evento) => setPoligono(evento.target.value)} />
          </label>
          <label className="campo"><span>${textos.ventana.parcela}</span>
            <input className="campo__control" type="number" min="0" inputMode="numeric" data-sigpac-parcela value=${parcela} onChange=${(evento) => setParcela(evento.target.value)} />
          </label>
        </div>
        <div className="estado__acciones">
          <button type="button" className="boton boton--principal" data-sigpac-buscar onClick=${buscar} disabled=${estado === "buscando"}>
            ${estado === "buscando" ? textos.ventana.buscando : textos.ventana.buscar}
          </button>
        </div>
      </div>

      ${estado === "sin-permiso"
        ? html`<p className="estado__texto">${textos.comun.sinPermiso}</p>`
        : null}
      ${estado === "error" ? html`<p className="estado__texto">${textos.ventana.noSePudo}</p>` : null}
      ${aviso ? html`<p className="panel__aviso" data-sigpac-resultado=${aviso}>${aviso}</p>` : null}

      ${estado === "vacio" ? html`<p className="estado__texto">${textos.ventana.sinRecintos}</p>` : null}

      ${recintos.length
        ? html`<div className="sigpac__resultados">
            <h3 className="panel__subtitulo">${textos.ventana.resultados}</h3>
            ${mapa}
            <ul className="lista-recintos">${filasRecintos}</ul>
            ${avisoDeForma ? html`<p className="panel__aviso">${avisoDeForma}</p>` : null}
            <div className="estado__acciones">
              <button type="button" className="boton boton--principal" data-sigpac-usar onClick=${usar} disabled=${usando || Boolean(avisoDeForma)}>
                ${usando ? textos.ventana.usando : textos.ventana.usar}
              </button>
              <button type="button" className="boton" onClick=${alCerrar}>${textos.ventana.cerrar}</button>
            </div>
          </div>`
        : html`<p className="estado__texto">${textos.ventana.sinBusqueda}</p>`}

      ${resultado ? html`<p className="panel__aviso panel__aviso--bien" data-sigpac-resultado=${resultado}>${resultado}</p>` : null}

      <section className="sigpac__cache" data-sigpac-cache aria-labelledby="sigpac-cache-titulo">
        <h3 className="panel__subtitulo" id="sigpac-cache-titulo">${textos.ventana.cache.titulo}</h3>
        <p className="pagina__dato">${textos.ventana.cache.intro}</p>

        ${cache.estado === "cargando" || cache.estado === "inicial"
          ? html`<p className="estado__texto">${textos.comun.cargando}</p>`
          : null}
        ${cache.estado === "sin-permiso" ? html`<p className="estado__texto">${textos.comun.sinPermiso}</p>` : null}
        ${cache.estado === "error" || cache.estado === "no-disponible"
          ? html`<div>
              <p className="estado__texto">${textos.ventana.cache.noSePudo}</p>
              <button type="button" className="boton" data-reintentar onClick=${cache.reintentar}>${textos.comun.reintentar}</button>
            </div>`
          : null}

        ${cache.estado === "listo" && !provinciasDelMapa.length
          ? html`<div>
              <p className="estado__texto">${textos.ventana.cache.sinMapas}</p>
              <p className="pagina__dato">${textos.ventana.cache.sinMapasAyuda}</p>
            </div>`
          : null}

        ${provinciasDelMapa.length
          ? html`<div className="sigpac__cache-forma">
              <label className="campo">
                <span>${textos.ventana.cache.provincia}</span>
                <select
                  className="campo__control"
                  data-sigpac-cache-provincia
                  value=${provinciaCache ?? ""}
                  onChange=${(evento) => setProvinciaCache(Number(evento.target.value))}
                >
                  ${provinciasDelMapa.map((ficha) => html`<option key=${`provincia-${ficha.provincia}`} value=${ficha.provincia}>${etiquetaDeProvinciaCache(ficha)}</option>`)}
                </select>
              </label>
              <p className="pagina__dato">${textos.ventana.cache.provinciaAyuda}</p>
              <p className="pagina__dato">${textos.ventana.cache.nota}</p>
              <div className="estado__acciones">
                <button
                  type="button"
                  className="boton boton--principal boton--grande"
                  data-sigpac-cache-aplicar
                  onClick=${traerLosContornos}
                  disabled=${faseCache === "trayendo"}
                >
                  ${faseCache === "trayendo" ? textos.ventana.cache.trayendo : textos.ventana.cache.aplicar}
                </button>
              </div>
            </div>`
          : null}

        ${resultadoCache
          ? html`<div className="panel__aviso panel__aviso--bien" data-sigpac-cache-resultado=${resultadoCache.lineas.join(" · ")}>
              ${/*
                * **Un solo hijo, y a propósito** (09/11/2026). Este panel es `.panel__aviso`, que es
                * `display: flex` en fila: con varios hijos directos, las líneas, «Tierras
                * actualizadas», las que no se han podido poner y los botones se ponían **en columnas
                * al lado** y comprimidos (a 390 px el bloque nuevo quedaba en 92 px de ancho y los
                * botones se salían 10 px de la caja). Metiéndolos en un único `<div>` vuelven al flujo
                * normal de bloque y el panel se queda con el ancho que le toca. No se toca el CSS.
                */ ""}
              <div>
                <ul className="sigpac__cache-lineas">
                  ${resultadoCache.lineas.map((linea, indice) => html`<li key=${`linea-cache-${indice}`}>${linea}</li>`)}
                </ul>
                ${resultadoCache.actualizadas.length
                  ? html`<div className="sigpac__cache-tierras" data-sigpac-cache-actualizadas>
                      <h4 className="panel__subtitulo">${textos.ventana.cache.tierrasActualizadas}</h4>
                      <ul className="sigpac__cache-lista">
                        ${resultadoCache.actualizadas.map((tierra) => html`<li className="sigpac__cache-tierra" key=${`actualizada-${tierra.id}`} data-sigpac-cache-actualizada=${tierra.alias}>
                          <span className="tierra__alias">${tierra.alias}</span>
                          ${tierra.detalle ? html`<span className="tierra__detalle">${tierra.detalle}</span>` : null}
                          ${puedeAbrirLaTierraActualizada(tierra, alVerTierra)
                            ? html`<button type="button" className="boton" data-sigpac-cache-ver-tierra=${tierra.id} onClick=${() => { alCerrar(); alVerTierra(tierra.id); }}>${textos.cuaderno.verTecnicas === null ? "" : textos.ventana.cache.verTierra}</button>`
                            : null}
                        </li>`)}
                      </ul>
                    </div>`
                  : null}
                ${resultadoCache.sinCodigos && resultadoCache.sinCodigos.length
                  ? html`<div className="sigpac__cache-tierras" data-sigpac-cache-sin-codigos>
                      <h4 className="panel__subtitulo">${textos.ventana.cache.sinCodigosTitulo}</h4>
                      <ul className="sigpac__cache-lista">
                        ${resultadoCache.sinCodigos.map((tierra) => html`<li className="sigpac__cache-tierra" key=${`sin-codigos-${tierra.id ?? tierra.alias}`} data-sigpac-cache-sin-codigo=${tierra.alias}>
                          <span className="tierra__alias">${tierra.alias}</span>
                          ${tierra.motivo
                            ? html`<span className="tierra__detalle" data-sigpac-cache-sin-codigo-motivo=${tierra.motivo}>${tierra.motivo}</span>`
                            : null}
                          ${tierra.id === null || tierra.id === undefined
                            ? null
                            : html`<button type="button" className="boton" data-sigpac-cache-elegir-recinto=${tierra.id} onClick=${() => elegirElRecintoDeLaTierra(tierra)}>${textos.ventana.cache.elegirRecinto}</button>`}
                        </li>`)}
                      </ul>
                    </div>`
                  : null}
                ${resultadoCache.lineas.length === 1 && resultadoCache.lineas[0] === textos.ventana.cache.nadaQueCasar
                  ? html`<p className="pagina__dato">${textos.ventana.cache.sigueSirviendo}</p>`
                  : null}
                <div className="estado__acciones">
                  ${alVerTierras
                    ? html`<button type="button" className="boton" data-sigpac-cache-ver-tierras onClick=${alVerTierras}>${textos.ventana.cache.verTierras}</button>`
                    : null}
                  <button type="button" className="boton" onClick=${alCerrar}>${textos.ventana.cache.cerrar}</button>
                </div>
              </div>
            </div>`
          : null}

        ${avisoCache ? html`<p className="panel__aviso" data-sigpac-cache-aviso>${avisoCache}</p>` : null}

        ${estadoDeLaCache.atribucion || estadoDeLaCache.licencia
          ? html`<p className="sigpac__cache-atribucion" data-sigpac-cache-atribucion>
              ${[textos.ventana.cache.atribucion, estadoDeLaCache.atribucion, estadoDeLaCache.licencia].filter(Boolean).join(" · ")}
            </p>`
          : null}
      </section>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- app

function textoDeHoy(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

/**
 * Avisa de qué pantalla se ha abierto (`POST /api/observabilidad/pantalla`).
 *
 * POR QUÉ ASÍ, Y NO DE OTRA MANERA
 *
 *  1. **No puede romper nada.** Sin cobertura, en un navegador sin `sendBeacon`, o con un
 *     servidor que no conteste: el fallo se queda en nada. No se espera la respuesta, no se
 *     mira el estado y no se pinta nada. El agricultor ni se entera de que esto existe.
 *  2. **No bloquea la pantalla.** `sendBeacon` está pensado justo para esto; si no está, se
 *     usa `fetch` con `keepalive`, que deja la petición en marcha sin atar el cambio de
 *     pantalla a ella. Y con su `.catch(() => {})`, que es lo que impide que un fallo de red
 *     se convierta en un error sin recoger.
 *  3. **No lleva nada de nadie.** Solo el nombre de la vista. Ni la finca, ni el vale, ni un
 *     dato del cuaderno: la observabilidad cuenta cosas, no copia datos.
 */
function avisarDeLaPantalla(pantalla) {
  try {
    const cuerpo = JSON.stringify({ pantalla: String(pantalla || "") });
    const direccion = "/api/observabilidad/pantalla";
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      try {
        const enviado = navigator.sendBeacon(
          direccion,
          new Blob([cuerpo], { type: "application/json" })
        );
        if (enviado) return;
      } catch (fallo) {
        /* Sin `Blob` o sin permiso: se prueba por el otro camino. */
      }
    }
    if (typeof fetch === "function") {
      fetch(urlDeLaApi(direccion), {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: cuerpo,
      }).catch(() => {});
    }
  } catch (fallo) {
    /* Un aviso que falla no puede romper la pantalla. */
  }
}

function App() {
  // **La pestaña se lee de la URL** (CU-U2, 11/11/2026): recargar o compartir un enlace deja al
  // agricultor en la misma pantalla, y cada pestaña tiene su `#`.
  const [vista, setVista] = useState(
    () => vistaDelHash(typeof location !== "undefined" ? location.hash : "") || "hoy",
  );
  const [tierraId, setTierraId] = useState(null);
  const [arrancada, setArrancada] = useState(false);
  const [estadoSecundario, setEstadoSecundario] = useState("cargando");
  const [sinCobertura, setSinCobertura] = useState(typeof navigator !== "undefined" ? !navigator.onLine : false);
  // La demo se anuncia con `window.CUEDIGITAL_DEMO` (lo pone `demo.js`): con eso se eligen los
  // textos que no prometen un servidor que no existe.
  const enDemo = typeof window !== "undefined" && window.CUEDIGITAL_DEMO === true;
  // **La cola del móvil, en el armazón** (13/11/2026): si un apunte no se pudo mandar, se dice
  // arriba aunque el agricultor esté en otra pantalla. El estado vive aquí y la tarjeta del
  // apunte avisa con un evento cuando cambia, para que las dos cuenten lo mismo.
  const [pendientes, setPendientes] = useState(() => {
    const almacen = almacenDelNavegador();
    return almacen ? apuntesPendientes(almacen).length : 0;
  });
  const [enviandoLaCola, setEnviandoLaCola] = useState(false);
  const [avisoDeLaCola, setAvisoDeLaCola] = useState(null);

  // El primer pintado es siempre «cargando»: la pantalla acaba de abrirse y todavía no se ha
  // preguntado nada. En el siguiente paso se decide de verdad (sin vale → entrar; si no llega →
  // volver a intentarlo). Así el agricultor no ve un «no hay nada» antes de que nadie haya mirado.
  useEffect(() => {
    setArrancada(true);
  }, []);

  useEffect(() => {
    const alCambiar = () => setSinCobertura(!navigator.onLine);
    window.addEventListener("online", alCambiar);
    window.addEventListener("offline", alCambiar);
    return () => {
      window.removeEventListener("online", alCambiar);
      window.removeEventListener("offline", alCambiar);
    };
  }, []);

  // Si la URL cambia a mano (el agricultor toca «atrás» o pega un enlace con su `#`), la pantalla
  // cambia con ella (CU-U2). No hay dos fuentes de la verdad: el hash manda cuando cambia.
  useEffect(() => {
    const alCambiarElHash = () => {
      const pedida = vistaDelHash(window.location.hash);
      if (pedida && pedida !== vista) setVista(pedida);
    };
    window.addEventListener("hashchange", alCambiarElHash);
    return () => window.removeEventListener("hashchange", alCambiarElHash);
  }, [vista]);

  // Al cambiar de pantalla se empieza arriba: si no, una vista hereda el scroll de la anterior y
  // los primeros botones quedan debajo de la cabecera o de la barra (medido en el móvil).
  useEffect(() => {
    const main = document.querySelector(".contenido");
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [vista, tierraId]);

  // La primera pantalla también se avisa: es la que se abre al arrancar y, sin esto, «Hoy» solo
  // se contaría cuando alguien volviera a ella desde otra vista. Como los cambios de pantalla los
  // avisa `abrirLaPantalla`, esto se hace una sola vez y no se repite.
  useEffect(() => {
    avisarDeLaPantalla(vista);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // **El único sitio que cambia de pantalla** (09/11/2026): así el aviso de qué pantalla se ha
  // abierto sale de un solo sitio y no hay que acordarse de ponerlo en cada botón. No bloquea y
  // no puede fallar: ver `avisarDeLaPantalla`.
  const abrirLaPantalla = (nueva) => {
    setVista(nueva);
    // El `#` de la pestaña, para que la pantalla se pueda compartir y recargar (CU-U2).
    try {
      if (typeof history !== "undefined" && typeof location !== "undefined") {
        const hash = hashDeLaVista(nueva);
        if (location.hash !== hash) history.replaceState(null, "", hash || location.pathname);
      }
    } catch (fallo) {
      /* Si el navegador no deja tocar la URL, la pantalla funciona igual. */
    }
    avisarDeLaPantalla(nueva);
  };

  const ir = (nueva) => {
    abrirLaPantalla(nueva);
    if (nueva !== "tierra") setTierraId(null);
  };

  const abrirTierra = (id) => {
    setTierraId(id);
    abrirLaPantalla("tierra");
  };

  const abrirApuntar = (id) => {
    setTierraId(id);
    abrirLaPantalla("apuntar");
  };

  const necesitaTierras = ["tierras", "alta", "tierra", "apuntar", "calendario", "trabajos", "productos"].includes(vista);
  const pantallaHoy = usarPantalla(RUTA_HOY, vista === "hoy");
  const pantallaTierras = usarPantalla(RUTA_TIERRAS, necesitaTierras);
  const pantallaResumen = usarPantalla(RUTA_RESUMEN, vista === "hoy");
  const pantallaQueFalta = usarPantalla(RUTA_QUE_FALTA, vista === "hoy");

  const contarLaCola = () => {
    const almacen = almacenDelNavegador();
    setPendientes(almacen ? apuntesPendientes(almacen).length : 0);
  };

  // **Mandar la cola nunca es obligatorio para seguir apuntando**: si falla, se dice y se queda
  // guardada. Manda en orden, y al terminar refresca la pantalla para que el apunte salga en su
  // sitio (o desaparezca el aviso, que es lo que el agricultor está mirando).
  const enviarLaCola = async () => {
    const almacen = almacenDelNavegador();
    if (!almacen || enviandoLaCola) return;
    setEnviandoLaCola(true);
    const { enviados, restantes } = await mandarLosApuntesPendientes(almacen, (apunte) =>
      pedir(RUTA_TRATAMIENTOS, conCuerpoJson(apunte)),
    );
    setPendientes(restantes);
    setEnviandoLaCola(false);
    setAvisoDeLaCola(enviados ? avisoEnviado(enDemo) : textos.comun.noSePudoEnviar);
    if (enviados) {
      if (pantallaHoy.reintentar) pantallaHoy.reintentar();
      if (pantallaTierras.reintentar) pantallaTierras.reintentar();
    }
  };

  // La tarjeta del apunte avisa con un evento del navegador (no comparte estado con el armazón).
  useEffect(() => {
    const alCambiarLaCola = () => contarLaCola();
    window.addEventListener("cuedigital-cola", alCambiarLaCola);
    return () => window.removeEventListener("cuedigital-cola", alCambiarLaCola);
    // `contarLaCola` solo usa estados que no cambian de identidad; se registra una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // **Al volver la cobertura, la cola se manda sola** (es lo que promete el aviso de «sin
  // cobertura»). Si falla, no se pierde nada: se queda guardada y se avisa.
  useEffect(() => {
    const alVolverLaCobertura = () => {
      const almacen = almacenDelNavegador();
      if (almacen && apuntesPendientes(almacen).length) enviarLaCola();
    };
    window.addEventListener("online", alVolverLaCobertura);
    return () => window.removeEventListener("online", alVolverLaCobertura);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El aviso de «ya está enviado» se va solo: no se queda pegado en la pantalla del campo.
  useEffect(() => {
    if (!avisoDeLaCola) return undefined;
    const reloj = setTimeout(() => setAvisoDeLaCola(null), 6000);
    return () => clearTimeout(reloj);
  }, [avisoDeLaCola]);

  const actual = vista === "hoy" ? pantallaHoy : pantallaTierras;
  const datosDeLaFinca = pantallaHoy.datos || pantallaTierras.datos || null;
  const tierras = (pantallaTierras.datos && pantallaTierras.datos.tierras) || [];
  const municipios = (pantallaTierras.datos && pantallaTierras.datos.municipios) || [];

  const lista = vista === "hoy"
    ? ((pantallaHoy.datos && pantallaHoy.datos.ultimos) || [])
    : tierras;

  const estadoDeLasPantallasDeSiempre = decidirEstado({
    conToken: actual.conToken,
    cargando: actual.estado === "cargando",
    fallo: actual.estado === "error" || actual.estado === "no-disponible",
    sinPermiso: actual.estado === "sin-permiso",
    hayDatos:
      vista === "alta" || vista === "tierra" || vista === "apuntar"
        ? Boolean(pantallaTierras.datos)
        : lista.length > 0,
  });

  const vistasDeSiempre = vista === "hoy" || vista === "tierras" || vista === "alta";
  const estadoVista = !arrancada ? "cargando" : vistasDeSiempre ? estadoDeLasPantallasDeSiempre : estadoSecundario;

  let pantalla = null;
  if (vista === "hoy") {
    pantalla = html`<${VistaHoy}
      estadoVista=${estadoVista}
      datos=${pantallaHoy.datos}
      alReintentar=${pantallaHoy.reintentar}
      resumen=${pantallaResumen}
      queFalta=${pantallaQueFalta}
      alApuntar=${() => ir("apuntar")}
    />`;
  } else if (vista === "alta") {
    pantalla = html`<${VistaAlta}
      estadoVista=${estadoVista}
      datos=${pantallaTierras.datos}
      alReintentar=${pantallaTierras.reintentar}
      alAnadirTierras=${() => ir("tierras")}
      alIrATierras=${() => ir("tierras")}
    />`;
  } else if (vista === "tierra") {
    pantalla = html`<${VistaTierra}
      tierraId=${tierraId}
      alVerTierra=${abrirTierra}
      tierras=${tierras}
      alVolver=${() => ir("tierras")}
      alReintentar=${pantallaTierras.reintentar}
      alEstado=${setEstadoSecundario}
      alApuntar=${() => abrirApuntar(tierraId)}
      alIr=${ir}
    />`;
  } else if (vista === "apuntar") {
    pantalla = html`<${VistaApuntar}
      tierras=${tierras}
      campana=${pantallaTierras.datos && pantallaTierras.datos.campana}
      tierraInicial=${tierraId}
      alEstado=${setEstadoSecundario}
      alGuardado=${pantallaTierras.reintentar}
      alIr=${ir}
      alVerLaTierra=${(id) => {
        setTierraId(id);
        abrirLaPantalla("tierra");
      }}
    />`;
  } else if (vista === "cuaderno") {
    pantalla = html`<${VistaCuaderno} alEstado=${setEstadoSecundario} alIr=${ir} campana=${datosDeLaFinca && datosDeLaFinca.campana} pendientes=${pendientes} demo=${enDemo} />`;
  } else if (vista === "productos") {
    pantalla = html`<${VistaProductos}
      tierras=${tierras}
      campana=${pantallaTierras.datos && pantallaTierras.datos.campana}
      alEstado=${setEstadoSecundario}
      alIr=${ir}
      alVerTierra=${abrirTierra}
    />`;
  } else if (vista === "calendario") {
    pantalla = html`<${VistaCalendario} tierras=${tierras} alEstado=${setEstadoSecundario} />`;
  } else if (vista === "trabajos") {
    pantalla = html`<${VistaTrabajos} tierras=${tierras} alEstado=${setEstadoSecundario} alIr=${ir} />`;
  } else if (vista === "facturas") {
    pantalla = html`<${VistaFacturas} alEstado=${setEstadoSecundario} alIr=${ir} />`;
  } else if (vista === "mas") {
    pantalla = html`<${VistaMas} ir=${ir} />`;
  } else {
    pantalla = html`<${VistaTierras}
      estadoVista=${estadoVista}
      datos=${pantallaTierras.datos}
      alReintentar=${pantallaTierras.reintentar}
      alAnadirTierras=${() => ir("alta")}
      alAbrirTierra=${abrirTierra}
      tierraAbierta=${tierraId}
    />`;
  }

  return html`<div className="app" data-vista=${vista} data-estado=${estadoVista}>
    <${BarraSuperior}
      finca=${datosDeLaFinca && datosDeLaFinca.finca}
      campana=${datosDeLaFinca && datosDeLaFinca.campana}
      cuenta=${datosDeLaFinca && datosDeLaFinca.cuenta}
      sinCobertura=${sinCobertura}
    />
    <${BarraDeConexion}
      sinCobertura=${sinCobertura}
      pendientes=${pendientes}
      alEnviar=${enviarLaCola}
      enviando=${enviandoLaCola}
      mensaje=${avisoDeLaCola}
      demo=${enDemo}
    />
    <div className="cuerpo">
      <${BarraLateral} vista=${vista} ir=${ir} />
      <main className="contenido" id="contenido">${pantalla}</main>
    </div>
    <${BarraInferior} vista=${vista} ir=${ir} />
  </div>`;
}

const raiz = document.getElementById("app");
if (raiz) {
  ReactDOM.createRoot(raiz).render(html`<${App} />`);
}
