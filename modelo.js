/**
 * modelo.js — Lo que la pantalla nueva calcula sin pintar nada.
 *
 * Aquí vive todo lo que se puede probar sin navegador: cómo se agrupan las tierras por
 * municipio, cuánto suman, dónde cae un anillo dentro de la imagen del mapa y qué se le
 * enseña al agricultor en cada momento (cargando, sin permiso, sin nada, o la lista).
 *
 * Y aquí viven **todos los textos** que lee el agricultor en esta pantalla, en un solo
 * sitio: ni repartidos por el código ni escritos a mano en el marcado. La lista de
 * palabras prohibidas del proyecto (`app/textos.py`) se comprueba contra este objeto.
 *
 * Regla de la casa: un dato que no se sabe se enseña como «no consta». Nunca un cero, ni
 * un «no», ni un cuadro inventado.
 */

/** La misma clave que usa la aplicación de siempre: la cuenta se comparte. */
export const CLAVE_TOKEN = "cuedigital.token";

/** La imagen del mapa se pide con este tamaño y se estira al hueco que haya. */
export const ANCHO_MAPA = 800;
export const ALTO_MAPA = 600;

/**
 * **Dónde está la API.** Vacío es lo normal: la pantalla la sirve el mismo programa que la API,
 * así que las direcciones van sin dominio (`/api/...`).
 *
 * Cuando la pantalla se publica **aparte** del servidor (por ejemplo, el front estático en
 * GitHub Pages llamando al servidor de casa), `config.js` pone `window.CUEDIGITAL_API` con la
 * dirección del servidor y **solo entonces** las llamadas llevan delante ese dominio. Sin la
 * variable, nada cambia.
 *
 * Lo que NO se toca aquí: una ruta que ya trae dominio (`https://...`) se devuelve tal cual.
 */
export function urlDeLaApi(ruta) {
  const base =
    typeof globalThis !== "undefined" && typeof globalThis.CUEDIGITAL_API === "string"
      ? globalThis.CUEDIGITAL_API.trim().replace(/\/+$/, "")
      : "";
  const camino = String(ruta == null ? "" : ruta);
  if (!base || /^[a-z][a-z0-9+.-]*:/i.test(camino)) return camino;
  return base + (camino.startsWith("/") ? camino : `/${camino}`);
}

export const textos = {
  app: {
    nombre: "CUE Digital",
    conCobertura: "Con cobertura",
    sinCobertura: "Sin cobertura",
  },
  nav: {
    hoy: "Hoy",
    tierras: "Tierras",
    apuntar: "Apuntar",
    calendario: "Calendario",
    trabajos: "Trabajos",
    facturas: "Facturas",
    productos: "Productos",
    cuaderno: "Cuaderno",
    mas: "Más",
    campana: "Campaña",
    pac: "PAC y subvenciones",
    documentos: "Documentos",
    cuenta: "Tu cuenta",
  },
  comun: {
    cargando: "Trayendo tus datos…",
    fallo: "No se ha podido cargar. Revisa la cobertura y vuelve a intentarlo.",
    reintentar: "Volver a intentar",
    sinPermiso: "Entra con tu cuenta para ver lo tuyo.",
    entrar: "Entrar",
    vacio: "Aquí todavía no hay nada.",
    todaviaNo: "Todavía no está en la pantalla nueva.",
    reintentarCorto: "Volver a intentar",
    // El estado sin cobertura y la cola de apuntes (encargo de UI, 13/11/2026). En pantalla se
    // dice «pendiente de enviar»: el estado del apunte, sin la palabra de la lista prohibida
    // (un test recorre este bloque y la cazaría).
    avisoSinCobertura:
      "Sin cobertura. Puedes seguir apuntando: lo que guardes se queda en el móvil y se manda solo cuando vuelva.",
    pendienteDeEnviar: "1 apunte pendiente de enviar.",
    pendientesDeEnviar: "{n} apuntes pendientes de enviar.",
    enviarAhora: "Enviar ahora",
    enviando: "Enviando…",
    enviado: "Ya está enviado.",
    noSePudoEnviar:
      "No se ha podido enviar. Se queda guardado en el móvil y se manda cuando vuelva la cobertura.",
  },
  hoy: {
    titulo: "Hoy",
    accion: "Apunta lo que has hecho",
    ultimos: "Lo último",
    contador: "{n} tierras · {ha} ha",
    contadorSinHa: "{n} tierras",
    gastos: "Gastos",
    ventas: "Ventas",
    cuaderno: "Cuaderno",
    facturas: "Facturas",
    faltaCuaderno: "Falta para el cuaderno",
    cuadernoNota: "Lo que falta, en el cuaderno",
    queFalta: "Qué falta",
    queFaltaVacio: "No falta nada para el cuaderno.",
    verQueFalta: "Ver qué falta",
    abrirAppVieja: "Abrir la app de siempre",
    apunte: "apunte",
    apuntes: "apuntes",
    factura: "factura",
    facturasCuenta: "facturas",
    sinCerrar: "sin cerrar",
    porPagar: "quedan {importe} por pagar",
    cobrado: "cobrado {importe}",
    faltan: "faltan {n} cosas",
    faltaUna: "falta 1 cosa",
    sinUltimos: "Cuando apuntes un trabajo o un tratamiento, saldrá aquí.",
    sinTierras: "Todavía no tienes tierras. Trae las tierras para poder apuntar.",
    cargando: "Trayendo lo de hoy…",
    fallo: "No se ha podido cargar lo de hoy. Revisa la cobertura y vuelve a intentarlo.",
    sinPermiso: "Entra con tu cuenta para ver lo de hoy.",
    vacio: "Todavía no has apuntado nada hoy.",
    vacioBoton: "Apuntar un trabajo",
  },
  tierras: {
    titulo: "Mis tierras",
    buscador: "Buscar tierra",
    buscadorPista: "Nombre o municipio",
    totales: "{n} tierras · {ha} ha · {m} municipios",
    totalesUno: "{n} tierra · {ha} ha · {m} municipio",
    totalesSinHa: "{n} tierras · {m} municipios",
    totalesUnoSinHa: "{n} tierra · {m} municipio",
    cargando: "Trayendo tus tierras…",
    fallo: "No se han podido cargar las tierras. Revisa la cobertura y vuelve a intentarlo.",
    sinPermiso: "Entra con tu cuenta para ver tus tierras.",
    vacio: "Todavía no tienes tierras.",
    traerTierras: "Traer tierras",
    sinMunicipio: "Sin municipio",
    sinUso: "Sin uso",
    sinCultivo: "Sin cultivo",
    colorPor: "Colorear por",
    colorPorUso: "Uso",
    colorPorCultivo: "Cultivo",
    leyenda: "Leyenda",
    sinResultados: "Ninguna tierra se llama así.",
    quitarBusqueda: "Ver todas",
    mapa: "Mapa",
    municipio: "Municipio",
    ayudaDelMapa: "Elige una tierra de la lista para ver su forma.",
    mapaNoLlega: "No se ha podido traer la foto del mapa.",
    sinMapa: "Sin mapa",
    zoomMas: "Acercar el mapa",
    zoomMenos: "Alejar el mapa",
    zoomTodo: "Ver todo el municipio",
    elegida: "Elegida",
    panel: {
      titulo: "Datos de la tierra",
      superficie: "Superficie",
      sigpac: "Superficie del SIGPAC",
      uso: "Uso",
      coeficiente: "Coeficiente",
      region: "Región",
      admisibilidad: "Admisible",
      cultivo: "Cultivo",
      variedad: "Variedad",
      otrosAnios: "Otros años",
      sinOtrosAnios: "No hay años anteriores guardados.",
      anio: "Campaña",
      hectareas: "ha",
      noConsta: "no consta",
      cerrar: "Cerrar la tierra",
      editar: "Editar",
      alias: "Nombre",
      superficieEditable: "Superficie (ha)",
      guardar: "Guardar cambios",
      guardando: "Guardando…",
      guardado: "Guardado",
      noSeGuardo: "No se ha podido guardar. Prueba otra vez.",
      soloEsto: "El resto de los datos del SIGPAC se enseñan, no se cambian.",
    },
  },
  alta: {
    titulo: "Añadir tierras",
    accion: "Añadir tierras",
    intro: "Se pueden traer del SIGPAC o de un cuaderno de la Junta.",
    porCodigo: "Por su código del SIGPAC",
    porCodigoAyuda: "Los números del papel de la parcela. Con eso sale la lista de recintos.",
    provincia: "Provincia",
    municipio: "Municipio",
    agregado: "Agregado",
    zona: "Zona",
    poligono: "Polígono",
    parcela: "Parcela",
    recintoFiltro: "Recinto (opcional)",
    buscar: "Buscar",
    buscando: "Buscando en el SIGPAC…",
    sinRecintos: "No salen recintos con esos datos. Repasa los números del papel.",
    noSePudoBuscar: "No se ha podido preguntar al SIGPAC. Prueba otra vez.",
    recintos: "Recintos encontrados",
    recintosCuenta: "{n} recintos",
    recinto: "Recinto",
    superficie: "Superficie",
    uso: "Uso",
    pendiente: "Pendiente",
    sinDibujo: "sin dibujo",
    anadirMarcados: "Añadir los marcados",
    marcados: "{n} marcados",
    anadiendo: "Añadiendo…",
    anadidas: "{n} tierras añadidas",
    conFallos: "{n} sin añadir",
    referenciasPegadas: "O pega las referencias",
    referenciasPista: "Una por línea, como las tengas",
    traerPegadas: "Traer las pegadas",
    ventana: "Ventana del SIGPAC",
    ventanaAyuda: "Toca en el mapa para coger el recinto que es tuyo.",
    ventanaSinMapa: "Todavía no hay una zona con la que abrir el mapa. Busca por código y añade la primera tierra.",
    sinForma: "Este recinto no trae forma en el SIGPAC: se lista, pero no se dibuja.",
    sinPuntos: "Esta búsqueda no trae el dibujo de los recintos. Se pueden añadir desde la lista, marcándolos.",
    recintosEnElMapa: "{n} recintos en el mapa",
    fichaRecinto: "Datos del recinto",
    anadirEsta: "Añadir esta tierra",
    importar: "Traer un cuaderno",
    importarAyuda: "El cuaderno de la Junta de un cliente. Se leen sus tierras y se dan de alta sin escribirlas a mano.",
    elegirFichero: "Elegir el cuaderno",
    importando: "Trayendo el cuaderno…",
    importado: "Cuaderno traído",
    titular: "Titular",
    anio: "Año",
    tierrasEnElCuaderno: "Tierras en el cuaderno",
    creadas: "Tierras nuevas",
    yaEstaban: "Ya estaban",
    sinApuntar: "Sin poder apuntar",
    noSeImporto: "No se ha podido traer el cuaderno. Prueba otra vez o ábrelo en la app de siempre.",
    otroFichero: "Elegir otro cuaderno",
    sinDatos: "Todavía no hay nada que enseñar aquí.",
  },
  mas: {
    titulo: "Más",
    facturas: "Facturas",
    trabajos: "Trabajos",
    cuaderno: "Cuaderno",
    ajustes: "Ajustes",
    intro: "Lo demás de la finca.",
  },
  productos: {
    titulo: "Productos y abonos",
    intro: "Lo que hay en la finca, con su dosis máxima por hectárea.",
    productos: "Productos",
    abonos: "Abonos",
    buscar: "Buscar por nombre",
    buscarPista: "Nombre o materia activa",
    dosisMaxima: "Dosis máxima",
    porHectarea: "por hectárea",
    plazo: "Plazo de seguridad",
    dias: "días",
    riqueza: "Riqueza",
    materiaActiva: "Materia activa",
    aplicar: "Apuntar en una tierra",
    tierra: "Tierra",
    fecha: "Fecha",
    hectareas: "Hectáreas",
    dosis: "Dosis por hectárea",
    total: "Total calculado",
    guardar: "Guardar el apunte",
    guardando: "Guardando…",
    guardado: "Apunte guardado",
    noSeGuardo: "No se ha podido guardar. Prueba otra vez.",
    cargando: "Trayendo productos y abonos…",
    noDisponible: "Los productos y abonos todavía no están en la pantalla nueva.",
    sinProductos: "No hay productos guardados.",
    sinAbonos: "No hay abonos guardados.",
    sinDosis: "Escribe la dosis por hectárea.",
    sinSuperficie: "Escribe las hectáreas de la tierra.",
    sinTierra: "Elige la tierra.",
    cerrar: "Cerrar",
    verTrabajo: "Ver el trabajo del día",
    sinCoincidencias: "No hay nada con ese nombre.",
  },
  cuaderno: {
    titulo: "Cuaderno",
    descargar: "Descargar el cuaderno",
    descargarExplica: "El cuaderno en PDF, con tus tierras y lo que tienes apuntado.",
    descargarPdf: "Descargar el cuaderno (PDF)",
    bajando: "Preparando el PDF…",
    noSePudoBajar: "No se ha podido bajar el cuaderno. Inténtalo otra vez.",
    intro: "Lo que falta para que el registro esté completo, y dónde se arregla cada cosa.",
    faltan: "Faltan {n} cosas",
    faltaUna: "Falta 1 cosa",
    completo: "El cuaderno está completo.",
    bloquea: "Bloquea el envío a la Junta",
    arreglar: "Arreglar",
    abrirJv: "Abrir el cuaderno de la Junta",
    cargando: "Mirando lo que falta…",
    noDisponible: "El cuaderno todavía no está en la pantalla nueva.",
    seccion: "Sección",
    dondeSeArregla: "Se arregla en",
    sinItems: "No hay nada que arreglar aquí.",
    resumenVarias: "Faltan {n} cosas para tener el cuaderno completo.",
    resumenUna: "Falta 1 cosa para tener el cuaderno completo.",
    bloqueanVarias: "{k} de ellas bloquean el envío.",
    bloqueanUna: "1 de ellas bloquea el envío.",
    bloqueanNinguna: "Ninguna bloquea el envío.",
    cosaUno: "1 cosa",
    cosaVarias: "{n} cosas",
    empezar: "Empezar por lo primero",
    empezarPorElCuaderno: "Empezar por el cuaderno",
    loPrimeroRellenable: "Lo primero que puedes rellenar:",
    bloqueoTecnico: "Lo que impide presentarlo no depende de ti: lo resuelve",
    avisoTitulo: "Lo que impide presentar el cuaderno",
    avisoUna: "Hay 1 cosa que impide presentar el cuaderno.",
    avisoVarias: "Hay {k} cosas que impiden presentar el cuaderno.",
    empezarPorLoQueBloquea: "Empezar por lo que bloquea",
    loPrimero: "Lo primero:",
    seArreglaFuera: "Se arregla fuera de esta pantalla.",
    arreglarEnLaApp: "Arreglarlo en la app de siempre",
    noSeVenTodas: "Faltan {n} cosas y aquí se ven {m}. Las demás no se han podido mirar; vuelve a intentarlo.",
    rellenablesUna: "Puedes rellenar 1 de ellas aquí.",
    rellenablesVarias: "Puedes rellenar {n} de ellas aquí.",
    rellenablesNinguna: "Ninguna de ellas se rellena desde aquí.",
    filtro: "Solo lo que puedo rellenar",
    tecnicasUna: "1 queda fuera: depende de la aplicación o de la Junta.",
    tecnicasVarias: "{n} quedan fuera: dependen de la aplicación o de la Junta.",
    verTecnicas: "Ver también esas",
  },
  siguiente: {
    eligeTierra: "Elige la tierra",
    verCalendario: "Ver el calendario",
    verTrabajos: "Ver todos los trabajos",
    verHoy: "Ver el trabajo de hoy",
    verDelDia: "Ver el trabajo del día",
  },
  ventana: {
    titulo: "Buscar en el SIGPAC",
    cerrar: "Cerrar",
    intro: "Busca la parcela por su referencia o por el pueblo, y elige el trozo que es tuyo.",
    porReferencia: "Por su referencia",
    referencia: "Referencia",
    pistaReferencia: "37:70:0:0:503:51",
    porMunicipio: "Por el pueblo",
    municipio: "Pueblo",
    pistaMunicipio: "Escribe el pueblo",
    sinMunicipioElegido: "Elige el pueblo de la lista.",
    agregado: "Agregado",
    zona: "Zona",
    poligono: "Polígono",
    parcela: "Parcela",
    buscar: "Buscar",
    buscando: "Buscando en el SIGPAC…",
    recintos: "Recintos",
    recinto: "Recinto",
    sinRecintos: "No salen recintos con esos datos. Repasa los números del papel.",
    sinForma: "Ese recinto no trae forma en el SIGPAC: no se puede usar.",
    usar: "Usar esta parcela",
    elegirEnLaTierra: "Elegir en el SIGPAC",
    usando: "Aplicando…",
    anadida: "Tierra añadida. Ya está en tus tierras.",
    aplicada: "Contorno aplicado a la tierra.",
    noSePudo: "No se ha podido. Prueba otra vez.",
    contornoNoDisponible: "Aplicar el contorno a una tierra todavía no está aquí. Prueba más tarde.",
    sinMapa: "sin mapa",
    superficie: "Superficie",
    uso: "Uso",
    pendiente: "Pendiente",
    coeficiente: "Coeficiente",
    region: "Región",
    admisibilidad: "Admisibilidad",
    ficha: "Datos del recinto",
    sinBusqueda: "Busca por referencia o por el pueblo.",
    resultados: "Resultados del SIGPAC",
    cache: {
      titulo: "Los contornos de toda la finca",
      intro: "Rellena la forma de tus tierras con el mapa del SIGPAC. Solo la forma: la superficie que declaraste no cambia.",
      sinMapas: "En este ordenador no hay ningún mapa de provincia guardado.",
      sinMapasAyuda: "Se baja una vez y sirve para todas las tierras. Se prepara desde el ordenador de la oficina; aquí no se baja nada solo.",
      provincia: "Provincia del mapa",
      provinciaAyuda: "Elige una de las provincias que ya están guardadas.",
      validoHasta: "válido hasta",
      aplicar: "Traer los contornos",
      trayendo: "Trayendo los contornos…",
      nota: "Se rellena la forma de las tierras que ya tienes. No se toca la superficie, ni el uso, ni el pueblo.",
      atribucion: "Datos del SIGPAC",
      tierrasActualizadas: "Tierras actualizadas",
      tierraSinNombre: "Tierra sin nombre",
      puestosUno: "1 contorno puesto",
      puestosVarios: "{n} contornos puestos",
      noEncontradasUno: "1 tierra que no está en ese mapa",
      noEncontradasVarias: "{n} tierras que no están en ese mapa",
      sinCodigosUno: "1 tierra sin códigos del SIGPAC",
      sinCodigosVarias: "{n} tierras sin códigos del SIGPAC",
      sinCodigosTitulo: "Estas no se han podido poner",
      sinCodigosConMotivo: "{cuantas} · {motivo}",
      elegirRecinto: "Elegir el recinto en el SIGPAC",
      sinFormaUno: "1 tierra sin forma",
      sinFormaVarias: "{n} tierras sin forma",
      nadaQueCasar: "Ninguna de tus tierras está en ese mapa.",
      sigueSirviendo: "Esta ventana sigue sirviendo para elegir un recinto de una tierra concreta.",
      verTierras: "Ver las tierras",
      cerrar: "Cerrar",
      noSePudo: "No se han podido traer los contornos. Prueba otra vez.",
      noHayMapa: "El mapa de esa provincia no está guardado en este ordenador. Se prepara desde el ordenador de la oficina; aquí no se baja nada solo.",
      faltaElFichero: "El mapa estaba apuntado, pero el fichero ya no está. Vuelve a prepararlo en el ordenador de la oficina.",
      sinMapasBoton: "Ver cómo se prepara",
    },
  },
  // El apunte en cuatro pasos y la cola sin cobertura (11/11/2026). En pantalla se dice «pendiente
  // de enviar»: el estado del apunte es «pendiente de enviar», sin más palabras raras.
  enCuatroPasos: {
    titulo: "Apunte en cuatro pasos",
    explica:
      "La parcela, qué apuntas, el producto con su dosis y el día. Si no hay cobertura, el apunte se guarda en el móvil y se manda cuando vuelva.",
    parcela: "1. En qué parcela",
    tipo: "2. Qué apuntas",
    tipoTratamiento: "Un tratamiento",
    producto: "3. Con qué y cuánto",
    dosis: "Dosis por hectárea",
    motivo: "Por qué lo has echado",
    motivoPista: "Por ejemplo: «vi pulgón» o «aviso de la Junta»",
    fecha: "4. Qué día",
    plazo: "Plazo de seguridad: hasta el {fecha}",
    sinPlazo: "Este producto no tiene plazo de seguridad apuntado",
    guardar: "Guardar el apunte",
    guardado: "Apunte guardado.",
    pendiente: "Guardado en el móvil: pendiente de enviar.",
    pendientes: "{n} apuntes pendientes de enviar.",
    reintentar: "Mandarlos ahora",
    siguiente: "Siguiente",
    faltaParcela: "Elige la parcela.",
    faltaProducto: "Elige el producto.",
    faltaDosis: "Escribe la dosis.",
    faltaMotivo: "Escribe por qué lo has echado.",
    pasoDe: "Paso {n} de 4",
    atras: "Atrás",
    resumen: "Lo que llevas",
    parcelaElegida: "Parcela",
    buscarParcela: "Buscar parcela",
    pistaDeBusqueda: "Nombre o municipio",
  },

  apuntar: {
    titulo: "Apuntar un trabajo",
    intro: "Elige la tierra y di qué has hecho. Queda en su historial.",
    pestanas: "Qué quieres apuntar",
    pestanaLabor: "Labor",
    pestanaTratamiento: "Tratamiento",
    pestanaAbono: "Abono",
    pestanaSiembra: "Siembra",
    tierra: "Tierra",
    eligiendo: "Elige la tierra",
    que: "Qué has hecho",
    apero: "Apero",
    fecha: "Fecha",
    hectareas: "Hectáreas",
    nota: "Nota",
    pistaDeLaNota: "Lo que quieras dejar dicho",
    guardar: "Guardar el trabajo",
    guardando: "Guardando…",
    guardado: "Trabajo guardado. Ya está en la tierra.",
    noSeGuardo: "No se ha podido guardar. Prueba otra vez.",
    faltaNota: "Escribe en la nota qué has hecho: con «otro» hay que decirlo.",
    sinTierra: "Elige una tierra para apuntar el trabajo.",
    sinAperos: "Todavía no hay aperos que apuntar.",
    cargando: "Trayendo lo que se puede apuntar…",
    noDisponible: "Apuntar todavía no está en la pantalla nueva.",
    verLaTierra: "Ver la tierra",
    miniatura: "El contorno de la tierra",
    sinMapa: "sin mapa",
    guardarImagen: "Guardar la imagen",
    producto: {
      titulo: "Producto",
      buscar: "Buscar producto",
      pistaBuscar: "Nombre o materia activa",
      materia: "Materia activa",
      dosisMaxima: "Dosis máxima",
      plazo: "Plazo de seguridad",
      dias: "días",
      dosis: "Dosis por hectárea",
      total: "Total calculado",
      plaga: "Plaga o hierba",
      justificacion: "Por qué lo has echado",
      pistaJustificacion: "Por ejemplo: «vi pulgón» o «me lo dijo mi técnico»",
      sinJustificacion: "Escribe por qué lo has echado.",
      nota: "Nota",
      guardar: "Guardar el tratamiento",
      guardado: "Tratamiento guardado. Ya está en la tierra.",
      sinProductos: "No hay productos dados de alta.",
      irAProductos: "Ver productos",
      sinProducto: "Elige el producto.",
      sinDosis: "Escribe la dosis por hectárea.",
      sinSuperficie: "Escribe las hectáreas.",
    },
    abono: {
      titulo: "Abono",
      buscar: "Buscar abono",
      riqueza: "Riqueza",
      modo: "Cómo lo apuntas",
      porHectarea: "Por hectárea (kg/ha)",
      kilosTotales: "Kilos en total",
      dosis: "Dosis por hectárea (kg)",
      totales: "Kilos en total",
      total: "Total calculado",
      nota: "Nota",
      guardar: "Guardar el abono",
      guardado: "Abono guardado. Ya está en la tierra.",
      sinAbonos: "No hay abonos dados de alta.",
      irAAbonos: "Ver abonos",
      sinAbono: "Elige el abono.",
      sinDosis: "Escribe la dosis por hectárea.",
      sinTotales: "Escribe los kilos en total.",
      sinSuperficie: "Escribe las hectáreas.",
    },
    siembra: {
      titulo: "Semilla",
      buscar: "Buscar semilla",
      variedad: "Variedad",
      dosis: "Dosis de semilla (kg/ha)",
      hectareas: "Hectáreas",
      total: "Total calculado",
      nota: "Nota",
      guardar: "Guardar la siembra",
      guardado: "Siembra guardada. Ya está en la tierra.",
      sinSemillas: "No hay semillas dadas de alta en esta finca.",
      delCuaderno: "Apuntarla como siembra del cuaderno",
      explicacion: "Se apunta en el cuaderno sin elegir una semilla del almacén.",
      cultivo: "Cultivo",
      guardarCuaderno: "Guardar la siembra del cuaderno",
      sinSemilla: "Elige la semilla.",
      sinCultivo: "Escribe el cultivo.",
      sinDosis: "Escribe la dosis de semilla.",
      sinSuperficie: "Escribe las hectáreas.",
    },
  },
  // El cuaderno guiado (10/11/2026): qué toca hacer en una tierra y a partir de cuándo. Los
  // estados son los del servidor (`app/guia.py`): vencido, hoy, proximo, abierto y sin-fecha.
  guia: {
    titulo: "Qué toca hacer",
    cosecha_vencido: "Ya se puede cosechar (el plazo terminaba el {fecha})",
    cosecha_hoy: "Hoy termina el plazo: ya puedes cosechar",
    cosecha_proximo: "Quedan {dias} días: no coseches antes del {fecha}",
    cosecha_abierto: "Podrás cosechar a partir del {fecha}",
    reentrada_vencido: "Ya se puede volver a entrar (el plazo terminaba el {fecha})",
    reentrada_hoy: "Hoy termina el plazo para volver a entrar",
    reentrada_proximo: "Quedan {dias} días: no entres en la tierra antes del {fecha}",
    reentrada_abierto: "Podrás volver a entrar a partir del {fecha}",
    cultivo: "Di qué hay sembrado en esta tierra",
    cultivo_explica: "Así el cuaderno puede avisarte de los plazos que dependen del cultivo.",
    nada: "Hoy no hay nada que mirar en esta tierra",
    prisa: "Corre prisa",
  },
  tierra: {
    volver: "Volver a las tierras",
    mapa: "El mapa de la tierra",
    datos: "Datos de la tierra",
    hoy: "Hoy en esta tierra",
    sinHoy: "Hoy no hay nada apuntado en esta tierra.",
    cargandoHoy: "Trayendo lo de hoy…",
    historial: "Historial",
    plazoHasta: "plazo hasta {fecha}",
    sinHistorial: "No hay años anteriores guardados.",
    cargandoHistorial: "Trayendo el historial…",
    noDisponible: "El historial de la tierra todavía no está en la pantalla nueva.",
    anio: "Año",
    sinMapa: "Esta tierra no tiene forma en el SIGPAC: se enseñan sus datos, pero no se dibuja.",
    abrirAppVieja: "Abrir la app de siempre",
  },
  calendario: {
    titulo: "Calendario",
    anterior: "Mes anterior",
    siguiente: "Mes siguiente",
    eligeDia: "Elige un día para ver el trabajo.",
    sinTrabajo: "Ese día no hay trabajo apuntado.",
    cargando: "Trayendo el calendario…",
    noDisponible: "El calendario todavía no está en la pantalla nueva.",
    diasConTrabajo: "Días con trabajo",
    trabajosDelDia: "Trabajos del día",
    sinNada: "No hay trabajo apuntado en este mes.",
  },
  trabajos: {
    titulo: "Trabajos",
    todos: "Todos",
    filtro: "Filtrar por tipo",
    trabajo: "Trabajo",
    tierra: "Tierra",
    municipio: "Municipio",
    hectareas: "Hectáreas",
    cantidad: "Cantidad",
    porHectarea: "Por hectárea",
    sinTrabajos: "No hay trabajos de ese tipo.",
    sinDatos: "Todavía no hay trabajos apuntados.",
    apuntarUno: "Apuntar un trabajo",
    quitarFiltros: "Quitar los filtros",
    cargando: "Trayendo los trabajos…",
    noDisponible: "Los trabajos todavía no están en la pantalla nueva.",
    resumen: "{n} trabajos · {ha} ha",
    resumenSinHa: "{n} trabajos",
    sinSuperficie: "sin superficie",
    totalesUno: "1 trabajo",
    totales: "{n} trabajos",
    hectareasTotales: "{ha} ha",
    filtroTierra: "Tierra",
    todas: "Todas",
    desde: "Desde",
    hasta: "Hasta",
    descargar: "Descargar",
    descargando: "Preparando el archivo…",
    sinFilasQueBajar: "No hay trabajos que descargar.",
    resumenPorTipo: "Resumen por tipo",
  },
  historial: {
    comparativa: "Años anteriores",
    anio: "Año",
    cultivo: "Cultivo",
    superficie: "Superficie",
    abono: "Abono",
    mesesDeAbono: "Meses de abono",
    cosecha: "Cosecha",
    labores: "Labores",
    noConsta: "no consta",
    sinAnios: "Todavía no hay años anteriores que comparar.",
    hoy: "Hoy",
  },
  facturas: {
    titulo: "Facturas",
    intro: "Hazle una foto a la factura, al envase o al papel que sea, y se revisa antes de guardar.",
    foto: "Hacer una foto",
    archivo: "Elegir una foto o un PDF",
    fotos: "Fotos",
    quitar: "Quitar la foto",
    anadir: "Añadir otra foto",
    leer: "Leer la factura",
    leyendo: "Leyendo la factura…",
    propuesta: "Revisa lo que dice",
    propuestaAyuda: "Corrige lo que veas mal antes de guardarla.",
    guardar: "Guardar la factura",
    guardando: "Guardando…",
    guardada: "Factura guardada",
    noSeGuardo: "No se ha podido guardar. Prueba otra vez.",
    noSeLeyo: "No se ha podido leer la factura. Se puede escribir a mano.",
    aMano: "Escribirla a mano",
    proveedor: "Proveedor",
    nif: "NIF",
    numero: "Número",
    fecha: "Fecha",
    base: "Base",
    iva: "IVA",
    total: "Total",
    lineas: "Líneas",
    sinLineas: "Sin líneas leídas.",
    sinFotos: "Añade una foto de la factura.",
    ultimas: "Últimas facturas",
    sinFacturas: "Todavía no hay facturas guardadas.",
    cargando: "Trayendo las facturas…",
    noDisponible: "Las facturas todavía no están en la pantalla nueva.",
    anulada: "Anulada",
    fotosDeMas: "La factura guarda una foto. Las demás se guardan en Documentos.",
    yaEstaba: "Esa factura ya estaba guardada.",
  },
};

function redondea(valor, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

/** Un número con coma decimal y punto de millares: 1234,5 → «1.234,5». */
export function formateaNumero(valor, decimales = 2) {
  if (valor === null || valor === undefined || valor === "" || Number.isNaN(Number(valor))) {
    return "";
  }
  const fijo = Number(valor).toFixed(decimales);
  const [entera, decimal] = fijo.split(".");
  const conMillares = entera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalLimpia = (decimal || "").replace(/0+$/, "");
  return decimalLimpia ? `${conMillares},${decimalLimpia}` : conMillares;
}

/** Rellena una plantilla con sus huecos: `{n} tierras` con `{n: 3}`. */
export function textoRelleno(plantilla, valores = {}) {
  return String(plantilla ?? "").replace(/\{(\w+)\}/g, (_, clave) =>
    valores[clave] === undefined || valores[clave] === null ? "" : String(valores[clave]),
  );
}

/** Sin tildes y en minúsculas, para buscar sin pelearse con el teclado. */
export function normaliza(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function esBboxValida(bbox) {
  return (
    Array.isArray(bbox) &&
    bbox.length === 4 &&
    bbox.every((n) => typeof n === "number" && Number.isFinite(n)) &&
    bbox[2] > bbox[0] &&
    bbox[3] > bbox[1]
  );
}

/** El municipio de una tierra, o el grupo de las que no lo tienen. */
export function municipioDeTierra(tierra) {
  const nombre = (tierra && tierra.municipio) || "";
  return nombre.trim() ? nombre.trim() : textos.tierras.sinMunicipio;
}

/** Las tierras que coinciden con lo escrito, por nombre o por municipio. */
export function filtrarTierras(tierras, consulta) {
  const lista = Array.isArray(tierras) ? tierras : [];
  const buscado = normaliza(consulta);
  if (!buscado) return lista.slice();
  return lista.filter(
    (tierra) =>
      normaliza(tierra && tierra.alias).includes(buscado) ||
      normaliza(tierra && tierra.municipio).includes(buscado),
  );
}

/** N tierras, X hectáreas y M municipios. Si a una tierra le falta la superficie, `ha` es `null`:
 *  una suma a la que le falta un sumando no se enseña como si estuviera completa. */
export function calcularTotales(tierras) {
  const grupos = agruparPorMunicipio(tierras);
  const completas = grupos.every((grupo) => grupo.ha !== null);
  const ha = completas ? grupos.reduce((suma, grupo) => suma + grupo.ha, 0) : null;
  return {
    n: Array.isArray(tierras) ? tierras.length : 0,
    ha: ha === null ? null : redondea(ha, 2),
    municipios: grupos.length,
  };
}

/** La lista agrupada por municipio, con la cuenta y la superficie de cada grupo. */
export function agruparPorMunicipio(tierras) {
  const grupos = new Map();
  for (const tierra of Array.isArray(tierras) ? tierras : []) {
    if (!tierra) continue;
    const nombre = municipioDeTierra(tierra);
    if (!grupos.has(nombre)) grupos.set(nombre, { nombre, n: 0, ha: 0, completa: true, tierras: [] });
    const grupo = grupos.get(nombre);
    grupo.n += 1;
    const superficie = tierra.superficie_ha;
    if (superficie === null || superficie === undefined || Number.isNaN(Number(superficie))) {
      grupo.completa = false;
    } else {
      grupo.ha += Number(superficie);
    }
    grupo.tierras.push(tierra);
  }
  return [...grupos.values()]
    .map((grupo) => ({
      nombre: grupo.nombre,
      n: grupo.n,
      ha: grupo.completa ? redondea(grupo.ha, 2) : null,
      tierras: grupo.tierras
        .slice()
        .sort((a, b) => String(a.alias ?? "").localeCompare(String(b.alias ?? ""), "es")),
    }))
    .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), "es"));
}

/**
 * Dónde cae cada punto del anillo dentro de la imagen: el oeste a la izquierda y el sur
 * abajo, que es como se mira un mapa.
 */
export function proyeccionDeAnillo(puntos, bbox, ancho = ANCHO_MAPA, alto = ALTO_MAPA) {
  if (!Array.isArray(puntos) || !puntos.length || !esBboxValida(bbox)) return null;
  const [oeste, sur, este, norte] = bbox;
  const anchoGrados = este - oeste;
  const altoGrados = norte - sur;
  const proyectados = [];
  for (const punto of puntos) {
    if (!Array.isArray(punto) || punto.length < 2) return null;
    const [lon, lat] = punto;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    proyectados.push([
      ((lon - oeste) / anchoGrados) * ancho,
      ((norte - lat) / altoGrados) * alto,
    ]);
  }
  return proyectados;
}

/** Un solo punto (el centro de una tierra sin forma) dentro de la imagen. */
export function proyeccionDePunto(punto, bbox, ancho = ANCHO_MAPA, alto = ALTO_MAPA) {
  const proyectados = proyeccionDeAnillo([punto], bbox, ancho, alto);
  return proyectados && proyectados.length ? proyectados[0] : null;
}

/** El mismo anillo, como ruta de SVG para pintarlo encima de la foto. */
export function rutaDeAnillo(puntos, bbox, ancho = ANCHO_MAPA, alto = ALTO_MAPA) {
  const proyectados = proyeccionDeAnillo(puntos, bbox, ancho, alto);
  if (!proyectados || !proyectados.length) return null;
  const [primero, ...resto] = proyectados.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`);
  return `M${primero} L${resto.join(" L")} Z`;
}

/** ¿Se puede enseñar esta tierra en el mapa? Sin forma ni centro, no. */
export function sinMapa(tierra) {
  const anillo = tierra && tierra.anillo;
  const centro = tierra && tierra.centro;
  const hayAnillo = Array.isArray(anillo) && anillo.length >= 3;
  const hayCentro = Array.isArray(centro) && centro.length >= 2;
  return !hayAnillo && !hayCentro;
}

/** La caja de un municipio, si tiene forma. */
export function bboxDeMunicipio(municipios, nombre) {
  const municipio = (Array.isArray(municipios) ? municipios : []).find(
    (m) => m && m.nombre === nombre,
  );
  return municipio && esBboxValida(municipio.bbox) ? municipio.bbox.slice() : null;
}

/** La caja que abarca todo lo que sí tiene forma: «ver todo». */
export function bboxDelConjunto(municipios) {
  const cajas = (Array.isArray(municipios) ? municipios : [])
    .map((m) => m && m.bbox)
    .filter((bbox) => esBboxValida(bbox));
  if (!cajas.length) return null;
  return [
    Math.min(...cajas.map((c) => c[0])),
    Math.min(...cajas.map((c) => c[1])),
    Math.max(...cajas.map((c) => c[2])),
    Math.max(...cajas.map((c) => c[3])),
  ];
}

/** Acercar (factor < 1) o alejar (factor > 1) sin mover el centro. */
export function ajustarBbox(bbox, factor) {
  if (!esBboxValida(bbox)) return null;
  const [oeste, sur, este, norte] = bbox;
  const centroLon = (oeste + este) / 2;
  const centroLat = (sur + norte) / 2;
  const medioAncho = ((este - oeste) / 2) * factor;
  const medioAlto = ((norte - sur) / 2) * factor;
  return [
    centroLon - medioAncho,
    centroLat - medioAlto,
    centroLon + medioAncho,
    centroLat + medioAlto,
  ];
}

/**
 * La dirección de la ortofoto del IGN. Las coordenadas van con seis decimales: son grados,
 * y con menos se nota el escalón al acercarse.
 */
export function urlDelMapa(bbox, ancho = ANCHO_MAPA, alto = ALTO_MAPA) {
  if (!esBboxValida(bbox)) return "";
  const [oeste, sur, este, norte] = bbox;
  const parametros = [
    "capa=foto",
    `oeste=${oeste.toFixed(6)}`,
    `sur=${sur.toFixed(6)}`,
    `este=${este.toFixed(6)}`,
    `norte=${norte.toFixed(6)}`,
    `ancho=${Math.round(ancho)}`,
    `alto=${Math.round(alto)}`,
  ];
  return `/api/mapa/imagen?${parametros.join("&")}`;
}

/**
 * Qué se enseña: primero quién eres, después si se está trayendo, después si no ha
 * llegado, y solo al final los datos o el vacío. Un fallo de red nunca se disfraza de
 * «no hay nada».
 */
export function decidirEstado({ conToken, cargando, fallo, sinPermiso, hayDatos }) {
  if (!conToken || sinPermiso) return "sin-permiso";
  if (cargando) return "cargando";
  if (fallo) return "error";
  return hayDatos ? "listo" : "vacio";
}

/** La campaña como se escribe en el campo: «2025/2026». */
export function etiquetaCampana(campana) {
  if (!campana) return "";
  const anio = campana.anio ?? campana.id;
  return anio === null || anio === undefined ? "" : String(anio);
}

/** Los datos de la tierra que van al panel, con «no consta» donde no hay dato. */
export function datosDelPanel(tierra) {
  const t = tierra || {};
  const noConsta = textos.tierras.panel.noConsta;
  const conUnidad = (valor, unidad) => (valor === null || valor === undefined ? noConsta : `${formateaNumero(valor)} ${unidad}`);
  const cultivo = t.cultivo || null;
  return [
    { etiqueta: textos.tierras.panel.superficie, valor: conUnidad(t.superficie_ha, textos.tierras.panel.hectareas) },
    { etiqueta: textos.tierras.panel.sigpac, valor: conUnidad(t.superficie_sigpac_ha, textos.tierras.panel.hectareas) },
    { etiqueta: textos.tierras.panel.uso, valor: t.uso_sigpac || noConsta },
    { etiqueta: textos.tierras.panel.coeficiente, valor: t.coef_regadio === null || t.coef_regadio === undefined ? noConsta : formateaNumero(t.coef_regadio) },
    { etiqueta: textos.tierras.panel.region, valor: t.region || noConsta },
    { etiqueta: textos.tierras.panel.admisibilidad, valor: t.admisibilidad === null || t.admisibilidad === undefined ? noConsta : String(t.admisibilidad) },
    { etiqueta: textos.tierras.panel.cultivo, valor: cultivo && cultivo.nombre ? cultivo.nombre : noConsta },
    { etiqueta: textos.tierras.panel.variedad, valor: cultivo && cultivo.variedad ? cultivo.variedad : noConsta },
  ];
}

// ---------------------------------------------------------------------------
// El mapa de colores: cada uso (o cultivo) con su color y su palabra
// ---------------------------------------------------------------------------

/*
 * Los colores salen de los tokens del sistema, no de aquí a mano: en el mapa se usan como
 * `var(--token)` y así el día y la noche los cambian solos. Siete y no más: más colores en
 * una foto aérea no se distinguen, y la leyenda lleva la palabra al lado para no depender
 * del color.
 */
const PALETA = [
  "var(--brand-bright)",
  "var(--accent)",
  "var(--info)",
  "var(--danger)",
  "var(--warning)",
  "var(--surface-sunk)",
  "var(--ink)",
];

const COLOR_SIN_DATO = "var(--ink-muted)";

/** Los colores disponibles para pintar las tierras. */
export function paletaDeUso() {
  return PALETA.slice();
}

/** El color que le toca a un valor por su puesto en la leyenda. */
export function colorDeUso(valor, indice = 0) {
  if (valor === null || valor === undefined || String(valor).trim() === "") return COLOR_SIN_DATO;
  return PALETA[Math.abs(Number(indice) || 0) % PALETA.length];
}

/** El valor por el que se colorea una tierra: su uso del SIGPAC o el cultivo del año. */
export function valorDeColor(tierra, campo = "uso") {
  const t = tierra || {};
  if (campo === "cultivo") {
    const cultivo = t.cultivo || null;
    return cultivo && cultivo.nombre ? cultivo.nombre : null;
  }
  return t.uso_sigpac || null;
}

/**
 * La leyenda: qué valores hay, cuántas tierras tiene cada uno y de qué color se pinta.
 * Ordenada de más tierras a menos y, a igualdad, por nombre, para que no baile entre
 * repintados. Lo que no tiene dato va al final y con su palabra («Sin uso»).
 */
export function leyendaDe(tierras, campo = "uso") {
  const cuenta = new Map();
  for (const tierra of Array.isArray(tierras) ? tierras : []) {
    if (!tierra) continue;
    const valor = valorDeColor(tierra, campo);
    cuenta.set(valor, (cuenta.get(valor) || 0) + 1);
  }
  const sinDato = campo === "cultivo" ? textos.tierras.sinCultivo : textos.tierras.sinUso;
  const filas = [...cuenta.entries()]
    .map(([valor, n]) => ({
      valor,
      n,
      etiqueta: valor === null ? sinDato : String(valor),
    }))
    .sort((a, b) => {
      if (a.valor === null) return 1;
      if (b.valor === null) return -1;
      if (b.n !== a.n) return b.n - a.n;
      return a.etiqueta.localeCompare(b.etiqueta, "es");
    });

  let indice = 0;
  return filas.map((fila) => {
    const color = fila.valor === null ? COLOR_SIN_DATO : PALETA[indice % PALETA.length];
    if (fila.valor !== null) indice += 1;
    return { ...fila, color };
  });
}

/** El color de una tierra, buscándolo en la leyenda de su valor. */
export function colorDeTierra(tierra, leyenda, campo = "uso") {
  const valor = valorDeColor(tierra, campo);
  const fila = (Array.isArray(leyenda) ? leyenda : []).find((una) => una.valor === valor);
  return fila ? fila.color : COLOR_SIN_DATO;
}

// ---------------------------------------------------------------------------
// El alta: referencias pegadas y lo que llega de las puertas del servidor
// ---------------------------------------------------------------------------

/** Las referencias que se han pegado, una por línea o separadas por comas o puntos y coma. */
export function referenciasDeTexto(texto) {
  const vistos = new Set();
  const referencias = [];
  for (const trozo of String(texto ?? "").split(/[\n\r,;]+/)) {
    const limpia = trozo.trim();
    if (!limpia || vistos.has(limpia)) continue;
    vistos.add(limpia);
    referencias.push(limpia);
  }
  return referencias;
}

/** Un importe en castellano, o `null` si no hay dato (que no es lo mismo que cero). */
export function importeEnTexto(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number") {
    return Number.isFinite(valor) ? `${formateaNumero(valor)} €` : null;
  }
  if (typeof valor === "string") {
    const limpio = valor.trim();
    return limpio === "" ? null : limpio;
  }
  if (typeof valor === "object") {
    for (const clave of ["total", "importe", "euros", "total_eur", "valor"]) {
      if (clave in valor) return importeEnTexto(valor[clave]);
    }
  }
  return null;
}

function cuentaEnTexto(cantidad, singular, plural) {
  if (cantidad === null || cantidad === undefined || Number.isNaN(Number(cantidad))) return null;
  const n = Number(cantidad);
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}

/** Las tarjetas de «Hoy»: gastos, ventas, cuaderno y facturas, cada una con su cifra. */
export function normalizaResumen(datos) {
  const resumen = datos || {};
  const gastos = resumen.gastos || {};
  const ventas = resumen.ventas || {};
  const cuaderno = resumen.cuaderno || {};
  const facturas = resumen.facturas || {};

  const porPagar = (pendiente) => {
    if (pendiente === null || pendiente === undefined || Number(pendiente) === 0) return null;
    const importe = importeEnTexto(pendiente);
    return importe ? textoRelleno(textos.hoy.porPagar, { importe }) : null;
  };
  const loCobrado = (cobrado) => {
    if (cobrado === null || cobrado === undefined || Number(cobrado) === 0) return null;
    const importe = importeEnTexto(cobrado);
    return importe ? textoRelleno(textos.hoy.cobrado, { importe }) : null;
  };
  const loQueFalta = () => {
    const faltan = cuaderno.faltan;
    if (faltan === null || faltan === undefined || Number.isNaN(Number(faltan))) return null;
    return Number(faltan) === 1 ? textos.hoy.faltaUna : textoRelleno(textos.hoy.faltan, { n: faltan });
  };

  return {
    gastos: {
      importe: importeEnTexto(gastos.total ?? gastos.importe ?? gastos),
      nota:
        cuentaEnTexto(gastos.n ?? gastos.apuntes, textos.hoy.apunte, textos.hoy.apuntes) ??
        porPagar(gastos.pendiente),
    },
    ventas: {
      importe: importeEnTexto(ventas.total ?? ventas.importe ?? ventas),
      nota:
        cuentaEnTexto(ventas.n ?? ventas.ventas, textos.hoy.apunte, textos.hoy.apuntes) ??
        loCobrado(ventas.cobrado) ??
        porPagar(ventas.pendiente),
    },
    cuaderno: {
      importe: null,
      nota:
        loQueFalta() ??
        cuentaEnTexto(cuaderno.sin_cerrar, textos.hoy.sinCerrar, textos.hoy.sinCerrar),
    },
    facturas: {
      importe: importeEnTexto(facturas.total),
      nota: cuentaEnTexto(facturas.n ?? facturas.cuantas, textos.hoy.factura, textos.hoy.facturasCuenta),
    },
  };
}

/** «Qué falta»: una lista de qué falta y dónde se arregla, sin inventarse ninguna fila. */
export function normalizaQueFalta(datos) {
  let filas = [];
  if (Array.isArray(datos)) filas = datos;
  else if (datos && typeof datos === "object") {
    for (const clave of ["items", "lista", "faltan", "que_falta", "ejemplos"]) {
      if (Array.isArray(datos[clave])) {
        filas = datos[clave];
        break;
      }
    }
  }

  const limpias = [];
  for (const fila of filas) {
    if (typeof fila === "string") {
      const que = fila.trim();
      if (que) limpias.push({ que, donde: null, bloquea: false, enlace: null });
      continue;
    }
    if (!fila || typeof fila !== "object") continue;
    const que = fila.que ?? fila.texto ?? fila.titulo ?? fila.descripcion ?? null;
    if (!que || !String(que).trim()) continue;
    limpias.push({
      que: String(que).trim(),
      donde: fila.donde ?? fila.pantalla ?? null,
      bloquea: Boolean(fila.bloquea ?? fila.bloqueante ?? false),
      enlace: fila.enlace ?? fila.url ?? null,
    });
  }
  return limpias;
}


/**
 * **Cuántas cosas faltan para el cuaderno, con una sola verdad** (13/11/2026).
 *
 * La pantalla de «Hoy» lee dos puertas: `/api/nuevo/que-falta` sabe qué falta y dónde se
 * arregla, y `/api/nuevo/resumen` trae un recuento para la tarjeta. Si una va por detrás, la
 * tarjeta decía «El cuaderno está completo» y «faltan 3 cosas» a la vez: lo destapó la medición
 * mirando la pantalla, no el código. Manda la lista —que es la que puede decir dónde se
 * arregla—; el resumen solo rellena el hueco cuando la lista no ha llegado. Sin ninguno de los
 * dos no se inventa nada: cero.
 */
export function faltasDelCuaderno(queFalta, resumen) {
  const lista = queFalta && typeof queFalta === "object" ? queFalta : null;
  const deLaLista = lista && typeof lista.faltan === "number" ? lista.faltan : null;
  const enLaLista = lista && Array.isArray(lista.items) ? lista.items.length : null;
  const delResumen =
    resumen && resumen.cuaderno && typeof resumen.cuaderno.faltan === "number"
      ? resumen.cuaderno.faltan
      : null;
  const faltan =
    deLaLista !== null ? deLaLista : enLaLista !== null ? enLaLista : delResumen !== null ? delResumen : 0;
  return { faltan, completa: faltan === 0 };
}

/**
 * Lo que se ha traído de un cuaderno: el titular, el año y las cuentas de lo que se ha
 * creado, de lo que ya estaba y de lo que no se ha podido apuntar. Sirve para las dos
 * formas (la de un paso y la de leer y luego importar).
 */
export function normalizaImportacion(datos) {
  const todo = datos || {};
  const leido = todo.leido || {};
  const importado = todo.importado || todo.importacion || {};

  const lineas = Array.isArray(leido.lineas) ? leido.lineas.length : null;
  const tierras = Array.isArray(todo.tierras) ? todo.tierras.length : null;
  const numero = (valor) => (valor === null || valor === undefined || Number.isNaN(Number(valor)) ? null : Number(valor));

  return {
    titular: leido.titular || null,
    anio: numero(leido.anio ?? importado.anio),
    tierrasEnElCuaderno: numero(importado.tierras_en_el_cuaderno ?? lineas ?? tierras),
    creadas: numero(importado.creadas),
    yaEstaban: numero(importado.ya_estaban),
    sinApuntar: numero(importado.sin_apuntar),
    hectareas: numero(importado.hectareas_declaradas),
    falta: normalizaQueFalta(todo.que_falta),
    avisos: Array.isArray(importado.avisos) ? importado.avisos : [],
  };
}

/** Un toque en el mapa, en coordenadas de verdad. El sur abajo, como se mira un mapa. */
export function puntoDelMapa(x, y, caja, ancho = ANCHO_MAPA, alto = ALTO_MAPA) {
  if (!esBboxValida(caja)) return null;
  const [oeste, sur, este, norte] = caja;
  const lon = oeste + (Number(x) / ancho) * (este - oeste);
  const lat = norte - (Number(y) / alto) * (norte - sur);
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  return [lon, lat];
}

/**
 * Los recintos de una búsqueda que **traen su dibujo**, cada uno con su color. Los que vienen
 * sin puntos (o con puntos que no son coordenadas) se quedan fuera del mapa: se listan, pero no
 * se dibuja un cuadro que nadie ha medido.
 */
export function recintosConPuntos(recintos) {
  const conDibujo = [];
  for (const recinto of Array.isArray(recintos) ? recintos : []) {
    if (!recinto) continue;
    const puntos = [];
    if (Array.isArray(recinto.puntos)) {
      for (const punto of recinto.puntos) {
        if (!Array.isArray(punto) || punto.length < 2) continue;
        const lon = Number(punto[0]);
        const lat = Number(punto[1]);
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
        puntos.push([lon, lat]);
      }
    }
    if (puntos.length < 3) continue;
    conDibujo.push({
      recinto: recinto.recinto,
      referencia: recinto.referencia ?? null,
      uso: recinto.uso || recinto.uso_sigpac || null,
      superficie_ha: recinto.superficie_ha ?? null,
      pendiente_pct: recinto.pendiente_pct ?? null,
      puntos,
    });
  }
  return conDibujo.map((uno, indice) => ({
    ...uno,
    color: colorDeUso(uno.referencia || String(uno.recinto), indice),
  }));
}

/**
 * La caja que abarca los dibujos de esos recintos, para abrir el mapa donde están ellos y no
 * donde estaba la finca. Si ninguno trae puntos, `null`: no se abre en un sitio inventado.
 */
export function cajaDeLosRecintos(recintos) {
  const longitudes = [];
  const latitudes = [];
  for (const recinto of Array.isArray(recintos) ? recintos : []) {
    const puntos = recinto && recinto.puntos;
    if (!Array.isArray(puntos)) continue;
    for (const punto of puntos) {
      if (!Array.isArray(punto) || punto.length < 2) continue;
      const lon = Number(punto[0]);
      const lat = Number(punto[1]);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
      longitudes.push(lon);
      latitudes.push(lat);
    }
  }
  if (!longitudes.length) return null;

  let oeste = Math.min(...longitudes);
  let este = Math.max(...longitudes);
  let sur = Math.min(...latitudes);
  let norte = Math.max(...latitudes);

  // Un recinto diminuto puede dar una caja de lado cero; el servidor no pinta una zona así.
  const relleno = 0.001;
  if (este - oeste < relleno) {
    const medio = (oeste + este) / 2;
    oeste = medio - relleno / 2;
    este = medio + relleno / 2;
  }
  if (norte - sur < relleno) {
    const medio = (sur + norte) / 2;
    sur = medio - relleno / 2;
    norte = medio + relleno / 2;
  }

  const caja = [oeste, sur, este, norte];
  return esBboxValida(caja) ? caja : null;
}

// ---------------------------------------------------------------------------
// Los trabajos: qué se hizo, cuándo, dónde y cuánto
// ---------------------------------------------------------------------------

const NOMBRES_DE_MES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const TIPOS_DE_TRABAJO = {
  siembra: "Siembra",
  cosecha: "Cosecha",
  tratamiento: "Tratamiento",
  abono: "Abono",
  fertilizacion: "Abono",
  labor: "Labor",
  riego: "Riego",
  poda: "Poda",
  otros: "Otros",
};

/** «vertedera» → «Vertedera»: una palabra que se lee, no una clave. */
export function nombrePropio(texto) {
  const limpio = String(texto ?? "").replace(/_/g, " ").trim();
  if (!limpio) return "";
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/** El nombre del trabajo en palabras: siembra, vertedera, grada… */
export function etiquetaDeTrabajo(item) {
  const t = item || {};
  if (t.titulo && String(t.titulo).trim()) return String(t.titulo).trim();
  if (t.tipo && String(t.tipo).includes(":")) return nombrePropio(String(t.tipo).split(":")[1]);
  if (t.tipo === "labor" && (t.subtipo || t.labor)) return nombrePropio(t.subtipo || t.labor);
  if ((t.subtipo || t.labor) && !TIPOS_DE_TRABAJO[t.tipo]) return nombrePropio(t.subtipo || t.labor);
  return TIPOS_DE_TRABAJO[t.tipo] || nombrePropio(t.tipo) || textos.trabajos.trabajo;
}

/** Un número de la pantalla: acepta 12,5 y 12.5; vacío es «no consta», nunca cero. */
export function numeroDe(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  const limpio = String(valor).trim().replace(/\./g, "").replace(",", ".");
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

/** Un trabajo, con su tierra y su municipio resueltos aunque el servidor solo mande el id. */
export function normalizaTrabajo(item, tierras = []) {
  const t = item || {};
  const lista = Array.isArray(tierras) ? tierras : [];
  const idDeTierra = t.parcela_id ?? t.tierra_id ?? t.id_tierra ?? null;
  const encontrada = idDeTierra === null ? null : lista.find((tierra) => tierra.id === idDeTierra) || null;
  const hectareas = numeroDe(t.hectareas ?? t.superficie_ha ?? t.ha);
  const kgPorHa = numeroDe(
    t.kg_ha ?? t.kilos_por_hectarea ?? t.dosis_kg_ha ?? t.dosis_semilla_kg_ha ?? (t.por_hectarea ? t.cantidad : null),
  );
  const dosis = numeroDe(t.dosis ?? t.cantidad);
  const unidad = t.unidad || t.dosis_unidad || (kgPorHa !== null ? "kg/ha" : null);
  const cantidad = kgPorHa !== null ? kgPorHa : dosis;
  const subtipo = t.subtipo ?? t.labor ?? null;

  return {
    id: t.id ?? null,
    fecha: t.fecha ? String(t.fecha).slice(0, 10) : null,
    tipo: t.tipo ?? null,
    subtipo,
    etiqueta: etiquetaDeTrabajo(t),
    tierra: t.tierra_alias ?? t.tierra ?? t.alias ?? (encontrada ? encontrada.alias : null),
    tierraId: idDeTierra,
    municipio: t.municipio ?? (encontrada ? encontrada.municipio : null),
    hectareas,
    cantidad,
    unidad,
    porHectarea: Boolean(t.por_hectarea) || (unidad ? /\/\s*ha/.test(unidad) : false),
    cultivo: t.cultivo ?? null,
    variedad: t.variedad ?? null,
    producto: t.producto ?? t.materia_activa ?? t.maquina ?? null,
    detalle: t.detalle ?? null,
    // La fecha en la que termina el plazo de seguridad de un tratamiento (la pone el servidor con
    // los días de la etiqueta); `null` si el plazo no está apuntado.
    plazoHasta: t.plazo_hasta ? String(t.plazo_hasta).slice(0, 10) : null,
    anulado: Boolean(t.anulado),
  };
}

/** Los trabajos agrupados por día, del más nuevo al más viejo. */
export function agruparPorDias(trabajos) {
  const dias = new Map();
  for (const trabajo of Array.isArray(trabajos) ? trabajos : []) {
    const fecha = trabajo && trabajo.fecha ? String(trabajo.fecha).slice(0, 10) : null;
    if (!fecha) continue;
    if (!dias.has(fecha)) dias.set(fecha, []);
    dias.get(fecha).push(trabajo);
  }
  return [...dias.entries()]
    .map(([fecha, suyos]) => ({ fecha, trabajos: suyos, n: suyos.length }))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
}

function dosCifras(valor) {
  return String(valor).padStart(2, "0");
}

/** Las celdas del mes en rejilla, empezando en lunes. */
export function rejillaDelMes(anio, mes) {
  const anioNumero = Number(anio);
  const mesNumero = Number(mes);
  if (!Number.isFinite(anioNumero) || !Number.isFinite(mesNumero) || mesNumero < 1 || mesNumero > 12) {
    return [];
  }
  const primero = new Date(anioNumero, mesNumero - 1, 1);
  const diasDelMes = new Date(anioNumero, mesNumero, 0).getDate();
  const desfase = (primero.getDay() + 6) % 7; // lunes = 0
  const celdas = [];
  const total = Math.ceil((desfase + diasDelMes) / 7) * 7;
  for (let indice = 0; indice < total; indice += 1) {
    const dia = indice - desfase + 1;
    const delMes = dia >= 1 && dia <= diasDelMes;
    const fecha = delMes
      ? `${anioNumero}-${dosCifras(mesNumero)}-${dosCifras(dia)}`
      : null;
    celdas.push({ dia: delMes ? dia : null, fecha, delMes });
  }
  return celdas;
}

/** «noviembre de 2026». */
export function nombreDeMes(anio, mes) {
  const indice = Number(mes) - 1;
  if (!NOMBRES_DE_MES[indice]) return "";
  return `${NOMBRES_DE_MES[indice]} de ${anio}`;
}

/** El mes de una fecha, en palabras («marzo»), o vacío si no hay fecha. */
export function mesEnPalabras(valor) {
  if (!valor) return "";
  const partes = String(valor).slice(0, 10).split("-");
  if (partes.length !== 3) return "";
  return NOMBRES_DE_MES[Number(partes[1]) - 1] || "";
}

/** El mes cuando viene como número (1–12), que es como lo manda el servidor en el historial. */
export function mesDeNumero(valor) {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1 || numero > 12) return "";
  return NOMBRES_DE_MES[numero - 1];
}

/**
 * Lo que suman las hectáreas de una lista de trabajos. **Sin mezclar**: solo cuenta el campo de
 * superficie; una cantidad en kilos o litros no suma hectáreas. Y las que no constan se cuentan
 * aparte, para poder decirlo en vez de dar un total que parece completo.
 */
export function sumaDeHectareas(trabajos) {
  let total = 0;
  let sinSuperficie = 0;
  let n = 0;
  for (const trabajo of Array.isArray(trabajos) ? trabajos : []) {
    n += 1;
    const hectareas = trabajo ? trabajo.hectareas : null;
    if (hectareas === null || hectareas === undefined || Number.isNaN(Number(hectareas))) {
      sinSuperficie += 1;
      continue;
    }
    total += Number(hectareas);
  }
  return { ha: redondea(total, 2), n, sinSuperficie };
}

/** La clave con la que se filtra un trabajo: el tipo y, en las labores, también el apero. */
export function claveDeTipo(trabajo) {
  const t = trabajo || {};
  if (t.tipo === "labor" && t.subtipo) return `labor:${t.subtipo}`;
  return t.tipo || "otros";
}

/** Los tipos que hay en una lista, con su cuenta, para pintar los botones de filtro. */
export function relacionDeTipos(trabajos) {
  const cuenta = new Map();
  for (const trabajo of Array.isArray(trabajos) ? trabajos : []) {
    if (!trabajo) continue;
    const clave = claveDeTipo(trabajo);
    cuenta.set(clave, (cuenta.get(clave) || 0) + 1);
  }
  return [...cuenta.entries()]
    .map(([clave, n]) => ({
      clave,
      etiqueta: clave.startsWith("labor:") ? nombrePropio(clave.slice(6)) : TIPOS_DE_TRABAJO[clave] || nombrePropio(clave),
      n,
    }))
    .sort((a, b) => (b.n !== a.n ? b.n - a.n : a.etiqueta.localeCompare(b.etiqueta, "es")));
}

/** Los trabajos de un tipo (o todos, si no se elige ninguno). */
export function filtrarPorTipo(trabajos, clave) {
  const lista = Array.isArray(trabajos) ? trabajos : [];
  if (!clave) return lista.slice();
  return lista.filter((trabajo) => claveDeTipo(trabajo) === clave);
}

/** El calendario: los días que traen trabajo, con sus trabajos dentro. */
export function normalizaCalendario(datos, tierras = []) {
  const crudo = datos || {};
  const dias = (Array.isArray(crudo.dias) ? crudo.dias : [])
    .map((dia) => {
      const fecha = dia && (dia.fecha ?? dia.dia) ? String(dia.fecha ?? dia.dia).slice(0, 10) : null;
      const trabajos = (Array.isArray(dia && dia.trabajos) ? dia.trabajos : []).map((trabajo) =>
        normalizaTrabajo(trabajo, tierras),
      );
      const n = dia && dia.n !== null && dia.n !== undefined ? Number(dia.n) : trabajos.length;
      return fecha ? { fecha, trabajos, n } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
  return { dias, totales: crudo.totales || null };
}

/** La lista de trabajos con su filtro y su resumen. */
export function normalizaTrabajos(datos, tierras = []) {
  const crudo = datos || {};
  const trabajos = (Array.isArray(crudo.trabajos) ? crudo.trabajos : []).map((trabajo) =>
    normalizaTrabajo(trabajo, tierras),
  );
  const tipos = (Array.isArray(crudo.tipos) ? crudo.tipos : []).map((tipo) => {
    if (typeof tipo === "string") {
      return { clave: tipo, etiqueta: nombrePropio(tipo), n: 0 };
    }
    const clave = tipo.clave ?? tipo.tipo ?? "otros";
    return {
      clave,
      etiqueta: tipo.etiqueta || (clave.startsWith("labor:") ? nombrePropio(clave.slice(6)) : TIPOS_DE_TRABAJO[clave] || nombrePropio(clave)),
      n: tipo.n === null || tipo.n === undefined ? 0 : Number(tipo.n),
    };
  });
  const resumen = crudo.resumen && typeof crudo.resumen === "object" ? crudo.resumen : sumaDeHectareas(trabajos);
  return {
    tipos: tipos.length ? tipos : relacionDeTipos(trabajos),
    elegido: crudo.elegido ?? null,
    trabajos,
    resumen,
  };
}

/** Una fila del historial de una tierra, con sus cantidades y su mes. */
export function normalizaFilaDeHistorial(item, tierras = []) {
  const trabajo = normalizaTrabajo(item, tierras);
  const detalles = [];
  if (trabajo.cultivo) detalles.push(trabajo.cultivo);
  if (trabajo.variedad) detalles.push(trabajo.variedad);
  if (trabajo.producto && trabajo.producto !== trabajo.cultivo) detalles.push(trabajo.producto);
  if (trabajo.detalle) detalles.push(trabajo.detalle);
  if (trabajo.cantidad !== null && trabajo.unidad) {
    detalles.push(`${formateaNumero(trabajo.cantidad)} ${trabajo.unidad}`);
  } else if (trabajo.cantidad !== null) {
    detalles.push(formateaNumero(trabajo.cantidad));
  }
  if (trabajo.hectareas !== null) detalles.push(`${formateaNumero(trabajo.hectareas)} ${textos.tierras.panel.hectareas}`);
  const mes = mesEnPalabras(trabajo.fecha) || mesDeNumero(item && item.mes) || nombrePropio(item && item.mes);
  if (mes) detalles.push(mes);
  // **La cuenta atrás del plazo de seguridad** (11/11/2026): «plazo hasta 26/11». Solo si el
  // servidor trae la fecha; si no hay plazo apuntado, no se pone nada (no se inventa).
  if (trabajo.plazoHasta) {
    detalles.push(textoRelleno(textos.tierra.plazoHasta, { fecha: fechaValidezEnTexto(trabajo.plazoHasta) }));
  }
  return { ...trabajo, detalles, mes };
}

/** Las secciones con las que el servidor cuenta el año, y con qué nombre se leen. */
const SECCIONES_DEL_HISTORIAL = [
  ["siembra", "siembra"],
  ["labores", "labor"],
  ["tratamientos", "tratamiento"],
  ["abonos", "abono"],
  ["cosecha", "cosecha"],
];

/** El historial agrupado por año, del más nuevo al más viejo. */
export function normalizaHistorial(datos, tierras = []) {
  const crudo = datos || {};
  let filas = [];
  if (Array.isArray(crudo.historial)) filas = crudo.historial;
  else if (Array.isArray(crudo.anios)) filas = crudo.anios;

  const porAnio = new Map();

  const guardar = (anio, suyas, resumen = null) => {
    if (!porAnio.has(anio)) {
      porAnio.set(anio, { filas: [], cultivo: null, variedad: null, superficie_ha: null, resumen: null });
    }
    const delAnio = porAnio.get(anio);
    delAnio.filas.push(...suyas);
    if (resumen) delAnio.resumen = resumen;
  };

  for (const fila of filas) {
    if (!fila || typeof fila !== "object") continue;

    // La forma del servidor: un elemento por año, con lo de cada sección dentro.
    const tieneSecciones = SECCIONES_DEL_HISTORIAL.some(([clave]) => fila[clave] !== undefined);
    if (tieneSecciones && !Array.isArray(fila.trabajos) && !Array.isArray(fila.items)) {
      const anio = String(fila.anio ?? fila.year ?? "");
      if (!porAnio.has(anio)) {
        porAnio.set(anio, {
          filas: [],
          cultivo: fila.cultivo ?? null,
          variedad: fila.variedad ?? null,
          superficie_ha: numeroDe(fila.superficie_ha),
          resumen: fila.resumen ?? null,
        });
      }
      const suyas = [];
      for (const [clave, tipo] of SECCIONES_DEL_HISTORIAL) {
        const contenido = fila[clave];
        const elementos = Array.isArray(contenido) ? contenido : contenido ? [contenido] : [];
        for (const elemento of elementos) {
          suyas.push(normalizaFilaDeHistorial({ tipo, ...elemento }, tierras));
        }
      }
      guardar(anio, suyas, fila.resumen ?? null);
      continue;
    }

    // Y la forma sencilla: una fila por apunte, con su año.
    if (Array.isArray(fila.trabajos) || Array.isArray(fila.items)) {
      const anio = String(fila.anio ?? fila.year ?? "");
      const suyas = (fila.trabajos || fila.items || []).map((una) => normalizaFilaDeHistorial(una, tierras));
      guardar(anio, suyas, fila.resumen ?? null);
      continue;
    }
    const anio = String(fila.anio ?? fila.year ?? fila.anio_campana ?? "");
    guardar(anio, [normalizaFilaDeHistorial(fila, tierras)], fila.resumen ?? null);
  }

  return [...porAnio.entries()]
    .map(([anio, datosDelAnio]) => ({
      anio,
      cultivo: datosDelAnio.cultivo,
      variedad: datosDelAnio.variedad,
      superficie_ha: datosDelAnio.superficie_ha,
      resumen: datosDelAnio.resumen,
      filas: datosDelAnio.filas,
    }))
    .sort((a, b) => (a.anio < b.anio ? 1 : a.anio > b.anio ? -1 : 0));
}

/** La ficha de una tierra: lo de hoy y el historial. */
export function normalizaTierra(datos, tierras = []) {
  const crudo = datos || {};
  return {
    trabajoDeHoy: (Array.isArray(crudo.trabajo_de_hoy) ? crudo.trabajo_de_hoy : []).map((trabajo) =>
      normalizaTrabajo(trabajo, tierras),
    ),
    historial: normalizaHistorial(crudo, tierras),
    resumen: crudo.resumen || null,
    // El cuaderno guiado: códigos y fechas tal y como los manda el servidor; el texto lo pone la
    // pantalla con `textos.guia`.
    guia: (Array.isArray(crudo.guia) ? crudo.guia : []).map((aviso) => ({
      codigo: String(aviso.codigo || ""),
      fecha: aviso.fecha || null,
      estado: String(aviso.estado || ""),
      dias: aviso.dias === null || aviso.dias === undefined ? null : Number(aviso.dias),
    })),
  };
}

// ---------------------------------------------------------------------------
// Las facturas: la propuesta que se revisa y el cuerpo que se guarda
// ---------------------------------------------------------------------------

/** Lo que el lector ha entendido de la factura, listo para revisarlo campo a campo. */
export function normalizaPropuestaDeFactura(datos) {
  const crudo = datos || {};
  const lineas = (Array.isArray(crudo.lineas) ? crudo.lineas : []).map((linea) => ({
    descripcion: linea.descripcion ?? linea.concepto ?? "",
    cantidad: numeroDe(linea.cantidad),
    unidad: linea.unidad || null,
    precioUnitario: numeroDe(linea.precio_unitario ?? linea.precio),
    importe: numeroDe(linea.importe),
    numeroRegistro: linea.numero_registro || null,
  }));

  return {
    proveedor: crudo.proveedor || "",
    nif: crudo.proveedor_nif || "",
    numero: crudo.numero_factura || "",
    fecha: crudo.fecha ? String(crudo.fecha).slice(0, 10) : "",
    base: numeroDe(crudo.base_imponible),
    iva: numeroDe(crudo.cuota_iva),
    tipoIva: numeroDe(crudo.tipo_iva_pct),
    total: numeroDe(crudo.total),
    lineas,
    avisos: Array.isArray(crudo.avisos) ? crudo.avisos : [],
    yaEstaba: crudo.ya_estaba ?? null,
  };
}

/** El cuerpo que se manda al guardar: solo los campos de la factura, con lo que se ha escrito. */
export function cuerpoDeLaFactura(propuesta) {
  const p = propuesta || {};
  const lineas = (Array.isArray(p.lineas) ? p.lineas : [])
    .filter((linea) => linea && String(linea.descripcion || "").trim())
    .map((linea) => ({
      descripcion: String(linea.descripcion).trim(),
      cantidad: linea.cantidad,
      unidad: linea.unidad || null,
      precio_unitario: linea.precioUnitario,
      importe: linea.importe,
      numero_registro: linea.numeroRegistro || null,
    }));

  return {
    proveedor: String(p.proveedor || "").trim() || null,
    proveedor_nif: String(p.nif || "").trim() || null,
    numero_factura: String(p.numero || "").trim() || null,
    fecha: String(p.fecha || "").trim() || null,
    base_imponible: p.base,
    cuota_iva: p.iva,
    tipo_iva_pct: p.tipoIva,
    total: p.total,
    lineas,
  };
}

// ---------------------------------------------------------------------------
// El apunte en cuatro pasos y la cola sin cobertura (11/11/2026)
//
// **El problema que resuelve:** en el campo, sin cobertura, el agricultor apunta el trabajo y se
// queda sin poder guardarlo. Perder lo que ha escrito es la peor forma de fallar. Aquí el apunte se
// guarda en el propio navegador con el estado «pendiente de enviar» y se manda cuando vuelve la
// cobertura. Lo que se guarda es **el cuerpo tal y como se mandaría**, no una copia a medias.
// ---------------------------------------------------------------------------

/** La clave del almacén donde esperan los apuntes hechos sin cobertura. */
export const CLAVE_DE_LA_COLA = "cuedigital.pendientes";

/** La fecha en la que termina un plazo: la del trabajo más los días que diga la etiqueta. */
export function fechaDePlazo(fechaISO, dias) {
  if (!fechaISO || dias === null || dias === undefined || dias === "") return null;
  const fecha = new Date(`${fechaISO}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;
  fecha.setDate(fecha.getDate() + Number(dias));
  if (Number.isNaN(fecha.getTime())) return null;
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Los apuntes que esperan a que vuelva la cobertura, del más viejo al más nuevo. */
export function apuntesPendientes(almacen) {
  try {
    const crudo = almacen.getItem(CLAVE_DE_LA_COLA);
    const cola = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(cola) ? cola : [];
  } catch (error) {
    return [];
  }
}

function guardarLaCola(almacen, cola) {
  try {
    almacen.setItem(CLAVE_DE_LA_COLA, JSON.stringify(cola));
  } catch (error) {
    // Sin sitio en el almacén no se puede hacer nada más: no se rompe la pantalla.
  }
}

/** Guarda un apunte para mandarlo cuando haya cobertura. Devuelve la cola entera. */
export function encolarApunte(almacen, apunte) {
  const cola = apuntesPendientes(almacen);
  cola.push({
    ...apunte,
    estado: "pendiente de enviar",
    guardado_en: new Date().toISOString(),
  });
  guardarLaCola(almacen, cola);
  return cola;
}

/** Quita de la cola el apunte que ocupa esa posición (el que acaba de mandarse). */
export function quitarApunteDeLaCola(almacen, posicion) {
  const cola = apuntesPendientes(almacen);
  cola.splice(posicion, 1);
  guardarLaCola(almacen, cola);
  return cola;
}

/**
 * **Manda la cola del móvil, en orden y sin perder nada** (encargo de UI, 13/11/2026).
 *
 * La usa la barra de arriba («Enviar ahora» y al volver la cobertura) y la tarjeta del apunte.
 * Manda el primero, y solo si el servidor dice que sí pasa al siguiente: lo que no se pudo
 * mandar se queda al frente de la cola, con su fecha de guardado, para intentarlo luego. La
 * función que envía se pasa desde fuera (`enviar`), así se puede probar sin red ni navegador.
 *
 * Devuelve cuántos se han ido y cuántos quedan: la pantalla no tiene que contar por su cuenta.
 */
export async function mandarLosApuntesPendientes(almacen, enviar) {
  if (!almacen) return { enviados: 0, restantes: 0 };
  let cola = apuntesPendientes(almacen);
  if (typeof enviar !== "function") return { enviados: 0, restantes: cola.length };
  let enviados = 0;
  while (cola.length) {
    let respuesta = null;
    try {
      respuesta = await enviar(cola[0]);
    } catch (error) {
      // La petición no ha llegado: no se toca la cola y se para, que el orden importa.
      respuesta = null;
    }
    if (!respuesta || respuesta.estado !== "ok") break;
    cola = quitarApunteDeLaCola(almacen, 0);
    enviados += 1;
  }
  return { enviados, restantes: cola.length };
}

// ---------------------------------------------------------------------------
// Apuntar el trabajo del día: los aperos del servidor y el apunte
// ---------------------------------------------------------------------------

/**
 * **La vista y el hash de la URL** (11/11/2026): cada pestaña deja su `#` para que se pueda
 * compartir y para que recargar no devuelva al inicio. Sin hash, la pantalla empieza en «Hoy».
 */
export function hashDeLaVista(vista) {
  const limpio = String(vista || "").trim();
  return limpio ? `#${limpio}` : "";
}

/** La vista que pide la URL. `null` si no pide ninguna. */
export function vistaDelHash(hash) {
  return String(hash || "").replace(/^#/, "").trim() || null;
}

/** La fecha de hoy como la escribe el servidor: 2026-11-05. */
export function fechaDeHoyISO(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/**
 * Los aperos que ofrece el servidor (`subtipos_de_laboreo`), sea cual sea la puerta por la que
 * lleguen. **No se inventa la lista**: si el servidor no manda ninguna, la pantalla lo dice.
 */
export function normalizaAperos(datos) {
  const crudo = datos || {};
  let crudos = [];
  for (const clave of ["subtipos_de_laboreo", "aperos", "opciones", "subtipos"]) {
    if (Array.isArray(crudo[clave])) {
      crudos = crudo[clave];
      break;
    }
  }
  return crudos
    .map((apero) => {
      if (typeof apero === "string") {
        return { clave: apero.trim(), etiqueta: nombrePropio(apero) };
      }
      if (!apero || typeof apero !== "object") return null;
      const clave = apero.clave ?? apero.subtipo ?? apero.valor ?? apero.id ?? null;
      if (!clave) return null;
      return { clave: String(clave), etiqueta: apero.etiqueta || apero.texto || nombrePropio(clave) };
    })
    .filter(Boolean);
}

/** El cuerpo del apunte, tal y como lo espera la puerta de los trabajos. */
export function cuerpoDelApunte({ campanaId, apero, fecha, tierraId, hectareas, nota } = {}) {
  return {
    campana_id: campanaId ?? null,
    tipo: "laboreo",
    subtipo: apero ?? null,
    fecha: fecha || fechaDeHoyISO(),
    parcela_id: tierraId ?? null,
    superficie_ha: numeroDe(hectareas),
    observaciones: String(nota ?? "").trim() || null,
  };
}

/** Con «otro» hay que decir qué se hizo: se avisa, pero el apunte no se bloquea por eso. */
export function avisoDeLaNota(apero, nota) {
  if (apero !== "otro") return null;
  if (String(nota ?? "").trim()) return null;
  return textos.apuntar.faltaNota;
}

/** La miniatura del contorno de una tierra. */
export function urlDeMiniatura(tierraId, ancho = 160, alto = 120) {
  return `/api/mapa/tierra/${tierraId}.png?ancho=${ancho}&alto=${alto}`;
}

/**
 * Si la puerta de siempre (`/api/labores`) admite ya el apero. Se mira en el esquema que publica
 * el propio servidor: mandar el apero por una puerta que no lo conoce lo perdería en silencio, y
 * eso es peor que usar la otra puerta, que sí lo guarda.
 */
export function elAperoSeGuardaEnLabores(esquema) {
  const propiedades =
    esquema &&
    esquema.components &&
    esquema.components.schemas &&
    esquema.components.schemas.LaborEntrada &&
    esquema.components.schemas.LaborEntrada.properties;
  return Boolean(propiedades && propiedades.subtipo);
}

// ---------------------------------------------------------------------------
// Los productos, los abonos y la dosis por hectárea
// ---------------------------------------------------------------------------

function laLista(datos, clave) {
  if (Array.isArray(datos)) return datos;
  if (datos && Array.isArray(datos[clave])) return datos[clave];
  if (datos && Array.isArray(datos.items)) return datos.items;
  return [];
}

/** Los productos que sirve el servidor, con su dosis máxima y su unidad. */
export function normalizaProductos(datos) {
  return laLista(datos, "productos")
    .filter((producto) => producto && (producto.nombre_comercial || producto.nombre))
    .map((producto) => ({
      id: producto.id ?? null,
      nombre: producto.nombre_comercial || producto.nombre,
      materiaActiva: producto.materia_activa || null,
      dosisMaxima: numeroDe(producto.dosis_maxima),
      unidad: producto.unidad_dosis || null,
      plazo: numeroDe(producto.plazo_seguridad_dias),
      autorizado: producto.autorizado ?? null,
    }));
}

/** Los abonos que sirve el servidor, con su riqueza. `null` es «no consta», no un cero. */
export function normalizaAbonos(datos) {
  return laLista(datos, "fertilizantes")
    .filter((abono) => abono && abono.nombre)
    .map((abono) => ({
      id: abono.id ?? null,
      nombre: abono.nombre,
      tipo: abono.tipo || null,
      n: numeroDe(abono.riqueza_n),
      p: numeroDe(abono.riqueza_p),
      k: numeroDe(abono.riqueza_k),
    }));
}

/** «N 27 % · P 0 % · K 0 %», con lo que consta y sin inventar ceros. */
export function riquezaEnTexto(abono) {
  if (!abono) return null;
  const partes = [];
  for (const [letra, valor] of [
    ["N", abono.n],
    ["P", abono.p],
    ["K", abono.k],
  ]) {
    if (valor !== null && valor !== undefined) partes.push(`${letra} ${formateaNumero(valor)} %`);
  }
  return partes.length ? partes.join(" · ") : null;
}

/** «1,5 L/ha», o `null` si no consta la dosis máxima. */
export function dosisMaximaEnTexto(producto) {
  if (!producto || producto.dosisMaxima === null || producto.dosisMaxima === undefined) return null;
  return `${formateaNumero(producto.dosisMaxima)}${producto.unidad ? ` ${producto.unidad}` : ""}`;
}

/**
 * El total que se va a echar: dosis por hectárea × hectáreas. **Sin mezclar unidades**: si la
 * dosis viene por hectárea, el total sale en su unidad base (kg o L); si ya viene como total, no
 * se multiplica por nada. Sin hectáreas no hay total que enseñar.
 */
export function totalDeLaAplicacion(dosis, hectareas, unidadDosis) {
  const cantidad = numeroDe(dosis);
  if (cantidad === null) return null;
  const unidad = String(unidadDosis ?? "").trim();
  const porHectarea = /\/\s*ha/i.test(unidad);
  if (!porHectarea) {
    return { cantidad, unidad: unidad || "" };
  }
  const superficie = numeroDe(hectareas);
  if (superficie === null || superficie <= 0) return null;
  const base = unidad.replace(/\/\s*ha/i, "").trim();
  return { cantidad: redondea(cantidad * superficie, 3), unidad: base };
}

/** La puerta a la que se manda cada apunte. */
export function rutaDeLaAplicacion(tipo) {
  return tipo === "abono" ? "/api/fertilizaciones" : "/api/tratamientos";
}

/** El cuerpo del tratamiento (producto) tal y como lo espera el servidor. */
export function cuerpoDelTratamiento({ campanaId, tierraId, fecha, productoId, dosis, unidadDosis, hectareas, plaga, justificacion, nota } = {}) {
  return {
    campana_id: campanaId ?? null,
    tipo: "parcela",
    fecha: fecha || fechaDeHoyISO(),
    parcela_id: tierraId ?? null,
    producto_id: productoId ?? null,
    dosis: numeroDe(dosis),
    unidad_dosis: unidadDosis || "L/ha",
    superficie_tratada_ha: numeroDe(hectareas),
    plaga: String(plaga ?? "").trim() || null,
    justificacion: String(justificacion ?? "").trim() || null,
    observaciones: String(nota ?? "").trim() || null,
  };
}

/** El cuerpo del abono, con los kilos por hectárea y el total que sale de ellos. */
export function cuerpoDeLaFertilizacion({ campanaId, tierraId, fecha, fertilizanteId, hectareas, dosisPorHa, unidad } = {}) {
  const superficie = numeroDe(hectareas);
  const dosis = numeroDe(dosisPorHa);
  return {
    campana_id: campanaId ?? null,
    fecha: fecha || fechaDeHoyISO(),
    parcela_id: tierraId ?? null,
    superficie_ha: superficie,
    fertilizante_id: fertilizanteId ?? null,
    kg_ha_producto: dosis,
    unidad_del_producto: unidad || "kg",
    cantidad_total_kg: superficie !== null && dosis !== null ? redondea(superficie * dosis, 3) : null,
  };
}

/**
 * El abono cuando se apunta **de una de las dos maneras**: por hectárea o en kilos totales.
 * Nunca se mandan las dos cifras a la vez; la que no toca se queda fuera del cuerpo.
 */
export function cuerpoDelAbono({
  campanaId,
  tierraId,
  fecha,
  fertilizanteId,
  modo = "por_hectarea",
  dosisPorHa,
  kilosTotales,
  hectareas,
  nota,
} = {}) {
  const superficie = numeroDe(hectareas);
  const esPorHectarea = modo !== "total";
  const cuerpo = {
    campana_id: campanaId ?? null,
    fecha: fecha || fechaDeHoyISO(),
    parcela_id: tierraId ?? null,
    superficie_ha: superficie,
    fertilizante_id: fertilizanteId ?? null,
    unidad_del_producto: "kg",
    observaciones: String(nota ?? "").trim() || null,
  };
  if (esPorHectarea) {
    const dosis = numeroDe(dosisPorHa);
    cuerpo.kg_ha_producto = dosis;
    cuerpo.cantidad_total_kg = superficie !== null && dosis !== null ? redondea(superficie * dosis, 3) : null;
    return cuerpo;
  }
  cuerpo.cantidad_total_kg = numeroDe(kilosTotales);
  return cuerpo;
}

/** Las semillas que sirve el servidor, con su dosis recomendada si la trae. */
export function normalizaSemillas(datos) {
  return laLista(datos, "semillas")
    .filter((semilla) => semilla && (semilla.nombre || semilla.especie))
    .map((semilla) => ({
      id: semilla.id ?? null,
      nombre: semilla.nombre || semilla.especie,
      variedad: semilla.variedad || null,
      especie: semilla.especie || null,
      dosisRecomendada: numeroDe(semilla.dosis_recomendada_por_ha),
      unidad: semilla.unidad_dosis || "kg/ha",
    }));
}

/** El cuerpo de la siembra con una semilla del almacén. */
export function cuerpoDeLaSiembra({ tierraId, fecha, semillaId, dosisPorHa, hectareas, nota } = {}) {
  return {
    semilla_id: semillaId ?? null,
    parcela_id: tierraId ?? null,
    fecha: fecha || fechaDeHoyISO(),
    superficie_ha: numeroDe(hectareas),
    dosis_por_ha: numeroDe(dosisPorHa),
    unidad_dosis: "kg/ha",
    notas: String(nota ?? "").trim() || null,
  };
}

/**
 * La siembra **del cuaderno**, sin semilla del almacén: va por la puerta de las labores con lo que
 * de verdad se sabe (cultivo, variedad y dosis). No se inventa ninguna semilla.
 */
export function cuerpoDeLaSiembraDelCuaderno({ campanaId, tierraId, fecha, cultivo, variedad, dosisKgHa, hectareas, nota } = {}) {
  const superficie = numeroDe(hectareas);
  const dosis = numeroDe(dosisKgHa);
  return {
    campana_id: campanaId ?? null,
    tipo: "siembra",
    fecha: fecha || fechaDeHoyISO(),
    parcela_id: tierraId ?? null,
    cultivo: String(cultivo ?? "").trim() || null,
    variedad: String(variedad ?? "").trim() || null,
    dosis_siembra_kg_ha: dosis,
    cantidad_semilla_kg: superficie !== null && dosis !== null ? redondea(superficie * dosis, 3) : null,
    superficie_ha: superficie,
    observaciones: String(nota ?? "").trim() || null,
  };
}

// ---------------------------------------------------------------------------
// El cuaderno guiado: lo que falta, agrupado por dónde se arregla
// ---------------------------------------------------------------------------

/** Lo que falta, **agrupado por dónde se arregla**, sin reordenar lo que manda el servidor. */
/**
 * Lo que bloquea va delante y lo demás detrás, **manteniendo el orden original dentro de cada
 * grupo**: lo urgente se ve antes sin revolver lo que ya estaba ordenado por el servidor.
 */
export function ordenaLoQueFalta(items) {
  const lista = (Array.isArray(items) ? items : []).filter((item) => item && item.que);
  return [...lista.filter((item) => Boolean(item.bloquea)), ...lista.filter((item) => !item.bloquea)];
}

export function agruparLoQueFalta(items) {
  const secciones = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || !item.que) continue;
    const donde = String(item.donde ?? "").trim() || textos.cuaderno.seccion;
    if (!secciones.has(donde)) secciones.set(donde, []);
    secciones.get(donde).push(item);
  }
  const agrupadas = [...secciones.entries()].map(([donde, suyos]) => ({
    donde,
    n: suyos.length,
    items: ordenaLoQueFalta(suyos),
    bloquea: suyos.some((item) => Boolean(item.bloquea)),
  }));
  // Primero lo que el agricultor puede rellenar (tiene pantalla en `/nuevo/`); lo que depende
  // de la aplicación o de la Junta va después, y se avisa arriba. Antes se colaban delante
  // bloqueos técnicos y el agricultor acababa en la app vieja sin poder hacer nada.
  const conPantalla = agrupadas.filter((seccion) => Boolean(destinoDeLaSeccion(seccion.donde)));
  const sinPantalla = agrupadas.filter((seccion) => !destinoDeLaSeccion(seccion.donde));
  return [...conPantalla, ...sinPantalla];
}

/** A qué pantalla de `/nuevo/` se va a arreglar algo, por el nombre de dónde se arregla. */
export function destinoDeLaSeccion(donde) {
  const texto = String(donde || "");
  if (/parcela|tierra|cultivo/i.test(texto)) return "tierras";
  if (/producto|abono|m[aá]quina|maquinaria|almac[eé]n/i.test(texto)) return "productos";
  if (/trabajo|calendario/i.test(texto)) return "calendario";
  return null;
}

/** «Faltan N cosas» y «K bloquean el envío», sin inventar ninguna de las dos cifras. */
export function resumenDeLoQueFalta(items) {
  const lista = Array.isArray(items) ? items : [];
  return {
    faltan: lista.length,
    bloquean: lista.filter((item) => item && item.bloquea).length,
  };
}

/** Cuántas de las faltas se pueden rellenar en una pantalla de `/nuevo/` (misma función de destinos). */
export function faltasRellenables(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && item.que)
    .filter((item) => Boolean(destinoDeLaSeccion(item.donde))).length;
}

/** «Puedes rellenar N de ellas aquí», en singular y plural; cuando ninguna, también se dice. */
export function textoDeLasRellenables(cantidad) {
  const n = Number(cantidad) || 0;
  if (n === 0) return textos.cuaderno.rellenablesNinguna;
  if (n === 1) return textos.cuaderno.rellenablesUna;
  return textoRelleno(textos.cuaderno.rellenablesVarias, { n });
}

/** Las secciones que se pueden rellenar desde `/nuevo/` (misma función de destinos). */
export function seccionesRellenables(secciones) {
  return (Array.isArray(secciones) ? secciones : []).filter((seccion) => seccion && destinoDeLaSeccion(seccion.donde));
}

/** Cuántas faltas quedan fuera de lo que el agricultor puede rellenar aquí. */
export function tecnicasDeLoQueFalta(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && item.que)
    .filter((item) => !destinoDeLaSeccion(item.donde)).length;
}

/** «N quedan fuera…», en singular y plural. */
export function textoDeLasTecnicas(cantidad) {
  const n = Number(cantidad) || 0;
  if (n === 0) return "";
  if (n === 1) return textos.cuaderno.tecnicasUna;
  return textoRelleno(textos.cuaderno.tecnicasVarias, { n });
}

/** Solo se puede abrir la ficha de una tierra actualizada si el padre pasa el callback y hay id. */
export function puedeAbrirLaTierraActualizada(tierra, alVerTierra) {
  if (typeof alVerTierra !== "function" || !tierra) return false;
  const id = tierra.id ?? tierra.parcela_id ?? tierra.tierra_id;
  return id !== null && id !== undefined;
}

/**
 * Por dónde empezar: primero lo que **bloquea el envío** y, si no hay nada bloqueante, lo primero
 * que tenga una pantalla donde arreglarse. Si nada tiene destino, no se inventa uno.
 */
export function empezarPorLoPrimero(items) {
  const conDestino = (Array.isArray(items) ? items : [])
    .filter((item) => item && item.que)
    .map((item) => ({ item, destino: destinoDeLaSeccion(item.donde) }))
    .filter((paso) => Boolean(paso.destino));
  return conDestino.find((paso) => paso.item.bloquea) || conDestino[0] || null;
}

/** El aviso de lo que impide presentar el cuaderno, en singular o en plural. */
export function textoDelAvisoDeBloqueo(cantidad) {
  const n = Number(cantidad) || 0;
  if (n === 1) return textos.cuaderno.avisoUna;
  return textoRelleno(textos.cuaderno.avisoVarias, { k: n });
}

/**
 * Cuando el servidor cuenta más faltas de las que la lista trae, se dice tal cual: ni se calla ni
 * se rellenan las que no se han podido mirar.
 */
export function textoDeFaltasSinListar(listados, delServidor) {
  if (listados === null || listados === undefined || delServidor === null || delServidor === undefined) return null;
  const n = Number(delServidor);
  const m = Number(listados);
  if (!Number.isFinite(n) || !Number.isFinite(m) || n <= m) return null;
  return textoRelleno(textos.cuaderno.noSeVenTodas, { n, m });
}

/** Por dónde empezar cuando hay cosas que bloquean: el primer bloqueante que sepa dónde se arregla. */
export function empezarPorLoQueBloquea(items) {
  const conDestino = (Array.isArray(items) ? items : [])
    .filter((item) => item && item.que && item.bloquea)
    .map((item) => ({ item, destino: destinoDeLaSeccion(item.donde) }))
    .filter((paso) => Boolean(paso.destino));
  return conDestino[0] || null;
}

/**
 * El **primero** de los bloqueantes, aunque no tenga pantalla en `/nuevo/`: hace falta para poder
 * decir cuál es y dónde se arregla (o avisar de que se arregla fuera).
 */
export function primerBloqueoDeLoQueFalta(items) {
  const bloqueante = (Array.isArray(items) ? items : []).find((item) => item && item.que && item.bloquea);
  if (!bloqueante) return null;
  return { item: bloqueante, destino: destinoDeLaSeccion(bloqueante.donde) };
}

/** Las tierras que el servidor dice que ha actualizado, sin inventarse nombres ni medidas. */
export function actualizadasDeLosContornos(datos) {
  const lista = datos && Array.isArray(datos.actualizadas) ? datos.actualizadas : [];
  return lista
    .filter((tierra) => tierra && typeof tierra === "object")
    .map((tierra, indice) => {
      const id = tierra.id ?? tierra.parcela_id ?? tierra.tierra_id ?? indice;
      const alias = String(tierra.alias || "").trim() || textos.ventana.cache.tierraSinNombre;
      const superficie = numeroDe(tierra.superficie_ha ?? tierra.superficie ?? tierra.hectareas);
      const municipio = String(tierra.municipio || "").trim();
      const detalles = [];
      if (superficie !== null) detalles.push(`${formateaNumero(superficie)} ${textos.tierras.panel.hectareas}`);
      if (municipio) detalles.push(municipio);
      return { id, alias, detalle: detalles.join(" · ") };
    });
}

/**
 * Las tierras que el mapa **no ha podido poner**, con su motivo **tal cual lo manda el servidor**.
 *
 * Es la otra mitad de `actualizadasDeLosContornos`: hasta ahora la ventana tiraba el motivo que
 * viene en `sin_codigos` y solo contaba cuántas eran, y el agricultor no podía leer por qué ni
 * abrir el SIGPAC en esa tierra. Aquí no se inventa nada:
 *
 *   · el nombre cae a «Tierra sin nombre» si no viene, como en las actualizadas;
 *   · **el motivo no se rellena**: si el servidor no lo manda, sale `null` y la pantalla no se
 *     escribe una frase que el servidor no ha dicho;
 *   · el `id` tampoco se inventa con el índice de la lista: sin identificador no se puede abrir
 *     esa tierra, así que se queda en `null` y la pantalla no ofrece un botón que llevaría a otra.
 */
export function sinCodigosDeLosContornos(datos) {
  const lista = datos && Array.isArray(datos.sin_codigos) ? datos.sin_codigos : [];
  return lista
    .filter((una) => una && typeof una === "object")
    .map((una) => {
      const id = una.id ?? una.parcela_id ?? una.tierra_id ?? null;
      const alias = String(una.alias || "").trim() || textos.ventana.cache.tierraSinNombre;
      const crudo = typeof una.motivo === "string" ? una.motivo.trim() : "";
      return { id, alias, motivo: crudo || null };
    });
}

/** «1 cosa» o «3 cosas», para la cuenta de cada sección. */
export function cuentaDeUnaSeccion(cantidad) {
  const n = Number(cantidad) || 0;
  if (n === 1) return textos.cuaderno.cosaUno;
  return textoRelleno(textos.cuaderno.cosaVarias, { n });
}

/** El nombre que se lee de un recinto del mapa: «Recinto 51 · Cereal · 1,2 ha». */
export function etiquetaDelRecintoEnElMapa(recinto) {
  const r = recinto || {};
  const numero = r.recinto === null || r.recinto === undefined ? textos.tierras.panel.noConsta : r.recinto;
  const uso = r.uso || r.uso_sigpac || textos.tierras.panel.noConsta;
  const superficie = numeroDe(r.superficie_ha);
  const hectareas = superficie === null
    ? textos.tierras.panel.noConsta
    : `${formateaNumero(superficie)} ${textos.tierras.panel.hectareas}`;
  return `${textos.ventana.recinto} ${numero} · ${uso} · ${hectareas}`;
}

/**
 * Los avisos que el servidor escribe **en palabras de agricultor** cuando no deja guardar algo
 * (una etiqueta que no reconoce, una dosis fuera de lo autorizado…). Se enseñan tal cual; si no
 * hay ninguno, la pantalla dice lo suyo.
 */
export function mensajesDeLaRespuesta(detalle) {
  const cuerpo = detalle && typeof detalle === "object" && detalle.detail !== undefined ? detalle.detail : detalle;
  if (!cuerpo) return [];
  if (typeof cuerpo === "string") return [cuerpo.trim()].filter(Boolean);
  if (Array.isArray(cuerpo)) {
    return cuerpo.map((uno) => mensajesDeLaRespuesta(uno)).flat().filter(Boolean);
  }
  if (typeof cuerpo === "object") {
    const mensajes = [];
    if (typeof cuerpo.mensaje === "string" && cuerpo.mensaje.trim()) mensajes.push(cuerpo.mensaje.trim());
    if (Array.isArray(cuerpo.avisos)) {
      for (const aviso of cuerpo.avisos) {
        const texto = aviso && (aviso.mensaje || aviso.texto);
        if (texto && String(texto).trim()) mensajes.push(String(texto).trim());
      }
    }
    return [...new Set(mensajes)];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Comparar años, contar por día y bajar lo filtrado
// ---------------------------------------------------------------------------

/** «marzo, mayo»: los meses en palabras, sin repetir y en el orden del año. */
export function mesesEnPalabras(meses) {
  const numeros = new Set();
  for (const mes of Array.isArray(meses) ? meses : []) {
    if (mes === null || mes === undefined || mes === "") continue;
    const numero = Number(mes);
    if (Number.isInteger(numero) && numero >= 1 && numero <= 12) {
      numeros.add(numero);
      continue;
    }
    const indice = NOMBRES_DE_MES.indexOf(String(mes).trim().toLowerCase()) + 1;
    if (indice) numeros.add(indice);
  }
  return [...numeros]
    .sort((a, b) => a - b)
    .map((numero) => NOMBRES_DE_MES[numero - 1])
    .join(", ");
}

/**
 * Los totales de una lista de trabajos: cuántos, cuántas hectáreas y las cantidades **por su
 * unidad**. Dos unidades distintas no se suman nunca: 200 kg y 30 L no son lo mismo.
 */
export function totalesDeTrabajos(trabajos) {
  const lista = Array.isArray(trabajos) ? trabajos : [];
  const porUnidad = new Map();
  let hectareas = 0;
  let sinSuperficie = 0;
  for (const trabajo of lista) {
    if (!trabajo) continue;
    if (trabajo.hectareas === null || trabajo.hectareas === undefined) sinSuperficie += 1;
    else hectareas += Number(trabajo.hectareas) || 0;

    const cantidad = trabajo.cantidad;
    const unidad = String(trabajo.unidad ?? "").trim();
    if (cantidad === null || cantidad === undefined || !unidad) continue;
    porUnidad.set(unidad, (porUnidad.get(unidad) || 0) + Number(cantidad));
  }
  return {
    n: lista.length,
    hectareas: redondea(hectareas, 2),
    sinSuperficie,
    porUnidad: [...porUnidad.entries()]
      .map(([unidad, cantidad]) => ({ unidad, cantidad: redondea(cantidad, 3) }))
      .sort((a, b) => a.unidad.localeCompare(b.unidad, "es")),
  };
}

/** «3 trabajos · 25,5 ha · 220 kg/ha · 30 L/ha», cada unidad por su lado. */
export function textoDeTotales(totales) {
  const t = totales || {};
  const partes = [];
  if (t.n !== null && t.n !== undefined) {
    partes.push(t.n === 1 ? textos.trabajos.totalesUno : textoRelleno(textos.trabajos.totales, { n: t.n }));
  }
  if (t.hectareas) partes.push(textoRelleno(textos.trabajos.hectareasTotales, { ha: formateaNumero(t.hectareas) }));
  for (const { unidad, cantidad } of t.porUnidad || []) {
    partes.push(`${formateaNumero(cantidad)} ${unidad}`);
  }
  return partes.join(" · ");
}

/**
 * La comparativa por años: año, cultivo/variedad, superficie, abono kg/ha, meses en palabras,
 * cosecha kg/ha y número de labores. Usa el `resumen` del servidor y, si no viene, lo cuenta de
 * las filas del año. Lo que no consta se queda en `null`: no se rellena con un cero.
 */
export function comparativaDeAnios(anios) {
  return (Array.isArray(anios) ? anios : []).map((anio) => {
    const resumen = anio.resumen || {};
    const filas = Array.isArray(anio.filas) ? anio.filas : [];
    const abonos = filas.filter((fila) => fila.tipo === "abono");
    const cosecha = filas.find((fila) => fila.tipo === "cosecha") || null;
    const siembra = filas.find((fila) => fila.tipo === "siembra") || null;

    const abonoKgHa =
      resumen.abonos_kg_ha !== undefined
        ? numeroDe(resumen.abonos_kg_ha)
        : abonos.length
          ? redondea(
              abonos.reduce((suma, fila) => suma + (fila.cantidad === null ? 0 : Number(fila.cantidad)), 0),
              2,
            )
          : null;

    const meses =
      resumen.abonos_meses !== undefined
        ? mesesEnPalabras(resumen.abonos_meses)
        : mesesEnPalabras(abonos.map((fila) => fila.mes || mesEnPalabras(fila.fecha)));

    const cosechaKgHa =
      resumen.cosecha_kg_ha !== undefined
        ? numeroDe(resumen.cosecha_kg_ha)
        : cosecha
          ? cosecha.cantidad
          : null;

    const labores =
      resumen.n_labores !== undefined
        ? numeroDe(resumen.n_labores)
        : filas.filter((fila) => fila.tipo === "labor").length;

    return {
      anio: String(anio.anio ?? ""),
      cultivo: anio.cultivo || (siembra && siembra.cultivo) || null,
      variedad: anio.variedad || (siembra && siembra.variedad) || null,
      superficie_ha: numeroDe(anio.superficie_ha),
      abonoKgHa,
      meses,
      cosechaKgHa,
      labores,
    };
  });
}

/** La dirección de los trabajos con sus filtros, solo con los que se han puesto. */
export function queryDeTrabajos({ tipo = null, tierraId = null, desde = null, hasta = null } = {}) {
  const parametros = [];
  if (tipo) parametros.push(`tipo=${encodeURIComponent(tipo)}`);
  if (tierraId !== null && tierraId !== undefined && tierraId !== "") {
    parametros.push(`parcela_id=${encodeURIComponent(tierraId)}`);
  }
  if (desde) parametros.push(`desde=${encodeURIComponent(desde)}`);
  if (hasta) parametros.push(`hasta=${encodeURIComponent(hasta)}`);
  return `/api/nuevo/trabajos${parametros.length ? `?${parametros.join("&")}` : ""}`;
}

/** El CSV de lo filtrado, para la trazabilidad. Separado por «;», que es lo que abre el Excel de casa. */
export function csvDeTrabajos(trabajos) {
  const columnas = ["fecha", "tipo", "título", "tierra", "municipio", "hectáreas", "cantidad", "unidad", "por hectárea"];
  const escapar = (valor) => {
    const texto = valor === null || valor === undefined ? "" : String(valor);
    return /[;"\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };
  const filas = (Array.isArray(trabajos) ? trabajos : []).map((trabajo) =>
    [
      trabajo.fecha || "",
      trabajo.tipo || "",
      trabajo.etiqueta || "",
      trabajo.tierra || "",
      trabajo.municipio || "",
      trabajo.hectareas === null || trabajo.hectareas === undefined ? "" : formateaNumero(trabajo.hectareas),
      trabajo.cantidad === null || trabajo.cantidad === undefined ? "" : formateaNumero(trabajo.cantidad),
      trabajo.unidad || "",
      trabajo.porHectarea ? "sí" : "",
    ].map(escapar),
  );
  return [columnas.join(";"), ...filas.map((fila) => fila.join(";"))].join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// La ventana del SIGPAC: buscar por referencia o por el pueblo de la lista
// ---------------------------------------------------------------------------

/** Los municipios que sirve el INE, listos para el autocompletado. */
export function normalizaMunicipios(datos) {
  const lista = datos && Array.isArray(datos.municipios) ? datos.municipios : [];
  return lista
    .filter((municipio) => municipio && municipio.nombre)
    .map((municipio) => ({
      nombre: municipio.nombre,
      provincia: municipio.provincia || "",
      codigoMunicipio: municipio.codigo_municipio ?? null,
      codigoProvincia: municipio.codigo_provincia ?? null,
      etiqueta: [municipio.nombre, municipio.provincia].filter(Boolean).join(" · "),
    }));
}

/** La búsqueda por la referencia que se pega del visor del SIGPAC. */
export function cuerpoDeBusquedaPorReferencia(texto) {
  const referencias = referenciasDeTexto(texto);
  if (!referencias.length) return null;
  return { referencia: referencias[0] };
}

/**
 * La búsqueda por el pueblo **elegido de la lista** (con su provincia oficial) y los números
 * del papel. Si no hay pueblo elegido no se manda nada: escribirlo a mano no vale.
 */
export function cuerpoDeBusquedaPorMunicipio({ elegido, agregado, zona, poligono, parcela } = {}) {
  if (!elegido || !elegido.nombre || !elegido.provincia) return null;
  const numeroPoligono = numeroDe(poligono);
  const numeroParcela = numeroDe(parcela);
  if (numeroPoligono === null || numeroParcela === null) return null;
  return {
    municipio: elegido.nombre,
    provincia: elegido.provincia,
    agregado: numeroDe(agregado) ?? 0,
    zona: numeroDe(zona) ?? 0,
    poligono: numeroPoligono,
    parcela: numeroParcela,
  };
}

/**
 * Lo que la ventana del SIGPAC puede poner ya cuando se abre desde una tierra: su referencia o sus
 * códigos. Lo que la tierra no tiene se queda vacío y los datos del servidor mandan sobre la lista.
 */
export function camposInicialesDelSigpac(tierra, parcela = null) {
  const fuente = { ...(tierra || {}), ...(parcela || {}) };
  const texto = (valor) => (valor === null || valor === undefined ? "" : String(valor).trim());
  const codigo = (valor) => {
    const numero = numeroDe(valor);
    return numero === null ? "" : String(numero);
  };
  return {
    referencia: texto(fuente.ref_sigpac),
    agregado: codigo(fuente.agregado),
    zona: codigo(fuente.zona),
    poligono: codigo(fuente.poligono),
    parcela: codigo(fuente.numero_parcela),
    municipio: texto(fuente.municipio),
    provincia: texto(fuente.provincia),
    recinto: codigo(fuente.numero_recinto),
  };
}

/** El recinto elegido en la lista, o `null`. */
export function recintoElegido(recintos, id) {
  if (id === null || id === undefined) return null;
  return (Array.isArray(recintos) ? recintos : []).find((recinto) => String(recinto.recinto) === String(id)) || null;
}

/** Si el recinto trae forma se puede usar; si no, se dice y no se aplica nada. */
export function puedeUsarseElRecinto(recinto) {
  if (!recinto) return false;
  if (Array.isArray(recinto.puntos) && recinto.puntos.length >= 3) return true;
  return recinto.tiene_dibujo === true;
}

/** El aviso cuando el recinto no trae forma, o `null` si se puede usar. */
export function avisoSinForma(recinto) {
  if (!recinto) return null;
  return puedeUsarseElRecinto(recinto) ? null : textos.ventana.sinForma;
}

/** Lo que se manda para aplicar un contorno a una tierra que ya existe. */
export function cuerpoDelContorno(recinto) {
  if (!recinto) return null;
  const numero = recinto.recinto === null || recinto.recinto === undefined ? null : recinto.recinto;
  if (recinto.referencia) {
    // Con el número del recinto se aplica **ese** trozo y no «el que salga» de la parcela.
    return numero === null ? { referencia: recinto.referencia } : { referencia: recinto.referencia, recinto: numero };
  }
  const cuerpo = cuerpoDeBusquedaPorMunicipio({
    elegido: recinto.municipio && {
      nombre: recinto.municipio.nombre,
      provincia: recinto.municipio.provincia,
    },
    agregado: recinto.agregado,
    zona: recinto.zona,
    poligono: recinto.poligono,
    parcela: recinto.parcela,
  });
  if (!cuerpo) return null;
  return numero === null ? cuerpo : { ...cuerpo, recinto: numero };
}

/** El estado de la caché de mapas del SIGPAC, tal y como lo cuenta el servidor. */
export function normalizaCacheSigpac(datos) {
  const fuente = datos || {};
  const provincias = laLista(fuente, "provincias")
    .filter((ficha) => ficha && numeroDe(ficha.provincia) !== null)
    .map((ficha) => ({
      provincia: numeroDe(ficha.provincia),
      nombre: ficha.nombre_provincia || "",
      campana: numeroDe(ficha.campana),
      fechaValidez: ficha.fecha_validez || null,
      licencia: ficha.licencia || fuente.licencia || "",
      atribucion: ficha.atribucion || fuente.atribucion || "",
    }));
  return {
    cuantas: typeof fuente.cuantas === "number" ? fuente.cuantas : provincias.length,
    provincias,
    atribucion: fuente.atribucion || "",
    licencia: fuente.licencia || "",
  };
}

/** «2025-09-01» → «01/09/2025»; lo que no sea una fecha se queda en blanco. */
export function fechaValidezEnTexto(valor) {
  const texto = String(valor || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(texto)) return "";
  const [anio, mes, dia] = texto.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

/** «Salamanca · 2025 · válido hasta 01/09/2025», con lo que haya de verdad. */
export function etiquetaDeProvinciaCache(ficha) {
  const guardada = ficha || {};
  const partes = [];
  if (guardada.nombre) partes.push(guardada.nombre);
  else if (guardada.provincia !== null && guardada.provincia !== undefined) partes.push(`Provincia ${guardada.provincia}`);
  if (guardada.campana !== null && guardada.campana !== undefined) partes.push(String(guardada.campana));
  const validez = fechaValidezEnTexto(guardada.fechaValidez);
  if (validez) partes.push(`${textos.ventana.cache.validoHasta} ${validez}`);
  return partes.join(" · ");
}

/** La dirección de «traer los contornos» de una provincia guardada. */
export function rutaDeLosContornos(provincia, campana) {
  const codigo = numeroDe(provincia);
  if (codigo === null || codigo < 1 || codigo > 52) return null;
  const anio = numeroDe(campana);
  return `/api/sigpac/cache/${codigo}/contornos${anio ? `?campana=${anio}` : ""}`;
}

/**
 * El resultado en palabras: puestos, no encontradas, sin códigos **con su motivo** y sin forma
 * (singular y plural).
 *
 * Las que no se han podido casar se agrupan **por su motivo**: dos tierras con el mismo motivo dan
 * una línea («2 tierras sin códigos del SIGPAC · …») y no la misma frase dos veces. El motivo va
 * tal cual lo manda el servidor; si no viene, no se rellena y se dice solo la cuenta, como antes.
 */
export function lineasDeLosContornos(resultado) {
  const r = resultado || {};
  const cuantos = (clave) => (Array.isArray(r[clave]) ? r[clave].length : 0);
  const palabras = textos.ventana.cache;
  const lineas = [];
  const puestos = cuantos("actualizadas");
  if (puestos) lineas.push(puestos === 1 ? palabras.puestosUno : textoRelleno(palabras.puestosVarios, { n: puestos }));
  const noEncontradas = cuantos("no_encontradas");
  if (noEncontradas) lineas.push(noEncontradas === 1 ? palabras.noEncontradasUno : textoRelleno(palabras.noEncontradasVarias, { n: noEncontradas }));
  const sinCodigos = sinCodigosDeLosContornos(r);
  if (sinCodigos.length) {
    const porMotivo = new Map();
    for (const tierra of sinCodigos) {
      const motivo = tierra.motivo || "";
      porMotivo.set(motivo, (porMotivo.get(motivo) || 0) + 1);
    }
    for (const [motivo, cuantas] of porMotivo) {
      const laCuenta = cuantas === 1 ? palabras.sinCodigosUno : textoRelleno(palabras.sinCodigosVarias, { n: cuantas });
      lineas.push(motivo ? textoRelleno(palabras.sinCodigosConMotivo, { cuantas: laCuenta, motivo }) : laCuenta);
    }
  }
  const sinForma = cuantos("sin_forma");
  if (sinForma) lineas.push(sinForma === 1 ? palabras.sinFormaUno : textoRelleno(palabras.sinFormaVarias, { n: sinForma }));
  if (!lineas.length) lineas.push(palabras.nadaQueCasar);
  return lineas;
}
