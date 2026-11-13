/**
 * demo.js — **la demo que no depende de nadie** (10/11/2026).
 *
 * QUÉ ES ESTO Y POR QUÉ EXISTE
 * ============================
 *
 * La aplicación de verdad pide los datos a su servidor. Para que David pueda enseñarla —y
 * probarla él mismo en su móvil— sin depender de que su servidor de casa esté encendido, ni del
 * túnel (que cambia de dirección), esta copia lleva **los datos dentro**: es una copia literal de
 * lo que contestó el servidor para la finca de ejemplo (las cinco parcelas del cliente de
 * Salamanca, con sus anillos) el 10/11/2026.
 *
 * Cómo funciona, en una frase: **se intercepta `fetch`** y todo lo que la pantalla pide a
 * `/api/...` se contesta aquí, desde `demo-datos.js`, sin red. Lo que se da de alta en la demo se
 * guarda en el `localStorage` del navegador **de ese visitante** y no sale de ahí.
 *
 * Lo que **no** hace: no hay ortofoto (la imagen del mapa la dibuja la propia aplicación con el
 * anillo de la parcela), no hay facturas ni documentos reales, y el aviso de arriba lo dice.
 *
 * El fichero lo genera `deploy/paginas_github/preparar.py` junto con `demo-datos.js`; no se edita
 * en el servidor.
 */
(function () {
  "use strict";

  var DATOS = window.CUEDIGITAL_DEMO_DATOS || null;
  if (!DATOS) return;
  // La pantalla puede saber que está en la demo (para no ofrecer enlaces que salgan del dominio).
  window.CUEDIGITAL_DEMO = true;

  // **La telemetría de pantalla, apagada en la demo** (CU-F1, 11/11/2026): la app avisa de qué
  // pantalla se abre con `navigator.sendBeacon`, que **no pasa por `fetch`** y por tanto llegaba
  // al servidor de GitHub Pages y contestaba 405. Aquí se sustituye por una función que no manda
  // nada: en una demo estática no hay a quién avisar.
  try {
    navigator.sendBeacon = function () {
      return true;
    };
  } catch (error) {}

  var CLAVE_TOKEN = "cuedigital.token";
  var CLAVE_TIERRA = "cuedigital.demo.tierras";
  var CLAVE_DATOS = "cuedigital.demo.datos";
  var CLAVE_TRABAJOS = "cuedigital.demo.trabajos";

  // La pantalla necesita un vale para no enseñar «sin permiso». En la demo es uno de mentira:
  // no se manda a ningún sitio porque no hay red.
  try {
    if (!localStorage.getItem(CLAVE_TOKEN)) localStorage.setItem(CLAVE_TOKEN, "demo");
  } catch (error) {}

  // ── Las tierras que se dan de alta en la demo ────────────────────────────────────────────
  function tierrasGuardadas() {
    try {
      var crudo = localStorage.getItem(CLAVE_TIERRA);
      return crudo ? JSON.parse(crudo) : [];
    } catch (error) {
      return [];
    }
  }

  function guardarTierras(lista) {
    try {
      localStorage.setItem(CLAVE_TIERRA, JSON.stringify(lista));
    } catch (error) {}
  }

  // **Los apuntes que se guardan en la demo** (13/11/2026): antes, «Enviar ahora» decía «Ya está
  // enviado.» y el apunte se quedaba en el aire (no había servidor que lo recibiera ni lista donde
  // saliera). La demo promete que lo apuntado «se queda en este navegador», así que aquí se guarda
  // en el navegador y se suma a la lista de trabajos. Nada sale de la máquina de quien la prueba.
  function trabajosGuardados() {
    try {
      var crudo = localStorage.getItem(CLAVE_TRABAJOS);
      return crudo ? JSON.parse(crudo) : [];
    } catch (error) {
      return [];
    }
  }

  function guardarTrabajos(lista) {
    try {
      localStorage.setItem(CLAVE_TRABAJOS, JSON.stringify(lista));
    } catch (error) {}
  }

  function trabajoDesdeElApunte(cuerpo) {
    var tierras = (DATOS.tierras && DATOS.tierras.tierras) || [];
    var tierra = tierras.filter(function (una) {
      return Number(una.id) === Number(cuerpo && cuerpo.parcela_id);
    })[0];
    var apunte = cuerpo || {};
    return {
      id: "demo-" + Date.now(),
      fecha: apunte.fecha || new Date().toISOString().slice(0, 10),
      tipo: apunte.tipo === "parcela" ? "tratamiento" : apunte.tipo || "tratamiento",
      titulo: "Tratamiento de ejemplo",
      producto: "Producto de ejemplo",
      dosis: apunte.dosis == null ? null : apunte.dosis,
      unidad: apunte.unidad_dosis || null,
      hectareas: apunte.superficie_tratada_ha == null ? null : apunte.superficie_tratada_ha,
      justificacion: apunte.justificacion || null,
      plazo_hasta: null,
      parcela_id: apunte.parcela_id == null ? null : apunte.parcela_id,
      tierra_alias: tierra ? tierra.alias : null,
    };
  }

  // ── Utilidades de las respuestas ────────────────────────────────────────────────────────
  function responder(cuerpo, estado, tipo) {
    var texto = cuerpo === undefined ? "" : JSON.stringify(cuerpo);
    return Promise.resolve(
      new Response(texto, {
        status: estado || 200,
        headers: { "Content-Type": tipo || "application/json" },
      })
    );
  }

  function clonar(objeto) {
    return objeto ? JSON.parse(JSON.stringify(objeto)) : objeto;
  }

  function normalizarReferencia(texto) {
    return String(texto || "")
      .trim()
      .replace(/[.:/\s]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/-$/, "");
  }

  function centroDe(puntos) {
    if (!puntos || !puntos.length) return null;
    var sumaX = 0;
    var sumaY = 0;
    for (var i = 0; i < puntos.length; i++) {
      sumaX += puntos[i][0];
      sumaY += puntos[i][1];
    }
    return [sumaX / puntos.length, sumaY / puntos.length];
  }

  // Todos los recintos que el servidor conoce, por su referencia completa y por su referencia sin
  // recinto (para que valga tanto pegar la del papel como la del visor).
  var RECINTOS = (function () {
    var indice = {};
    var busquedas = DATOS.busquedas || {};
    Object.keys(busquedas).forEach(function (consultada) {
      (busquedas[consultada].recintos || []).forEach(function (recinto) {
        if (recinto && recinto.referencia) {
          indice[normalizarReferencia(recinto.referencia)] = recinto;
        }
      });
    });
    return indice;
  })();

  function recintosDeLaReferencia(referencia) {
    var buscada = normalizarReferencia(referencia);
    var busquedas = DATOS.busquedas || {};
    var entrada =
      busquedas[buscada] ||
      Object.keys(busquedas)
        .filter(function (clave) {
          return normalizarReferencia(clave) === buscada;
        })
        .map(function (clave) {
          return busquedas[clave];
        })[0];
    if (entrada) return clonar(entrada.recintos || []);
    // La del visor son seis números y el servidor devuelve sus recintos: se buscan por prefijo.
    var porPrefijo = [];
    Object.keys(RECINTOS).forEach(function (clave) {
      if (clave.indexOf(buscada + "-") === 0) porPrefijo.push(RECINTOS[clave]);
    });
    return clonar(porPrefijo);
  }

  // ── Dar de alta una tierra en la demo ──────────────────────────────────────────────────
  function crearDesdeRecinto(recinto) {
    var guardadas = tierrasGuardadas();
    var yaEsta = guardadas.filter(function (tierra) {
      return normalizarReferencia(tierra.referencia_demo) === normalizarReferencia(recinto.referencia);
    })[0];
    if (yaEsta) return { tierra: yaEsta, nueva: false };

    var puntos = recinto.puntos || null;
    var numeroParcela = recinto.referencia ? recinto.referencia.split("-").slice(-2, -1)[0] : "?";
    var numeroRecinto = recinto.recinto != null ? recinto.recinto : "?";
    var tierra = {
      id: 900 + guardadas.length,
      alias: "Parcela " + numeroParcela + " · recinto " + numeroRecinto,
      municipio: recinto.municipio || "",
      provincia: "",
      superficie_ha: recinto.superficie_ha != null ? recinto.superficie_ha : null,
      superficie_sigpac_ha: recinto.superficie_ha != null ? recinto.superficie_ha : null,
      uso_sigpac: recinto.uso_sigpac || null,
      coef_regadio: recinto.coeficiente_regadio != null ? recinto.coeficiente_regadio : null,
      region: recinto.region != null ? recinto.region : null,
      admisibilidad: recinto.admisibilidad != null ? recinto.admisibilidad : null,
      centro: centroDe(puntos),
      anillo: puntos,
      cultivo: null,
      otros_anios: [],
      referencia_demo: recinto.referencia,
    };
    guardadas.push(tierra);
    guardarTierras(guardadas);
    return { tierra: tierra, nueva: true };
  }

  function fichaDe(tierra) {
    return {
      tierra: clonar(tierra),
      trabajo_de_hoy: [],
      historial: [],
      resumen: {
        n_apuntes: 0,
        primera_fecha: null,
        ultima_fecha: null,
        kg_ha_ultima_cosecha: null,
      },
    };
  }

  function tierrasParaLaLista() {
    var base = clonar((DATOS.tierras || {}).tierras || []);
    var extra = tierrasGuardadas();
    var todas = base.concat(extra);
    var lista = clonar(DATOS.tierras || {});
    lista.tierras = todas;
    var municipios = {};
    todas.forEach(function (tierra) {
      var nombre = tierra.municipio || "";
      municipios[nombre] = (municipios[nombre] || 0) + 1;
    });
    lista.municipios = Object.keys(municipios).map(function (nombre) {
      return { nombre: nombre, n: municipios[nombre], ha: null, bbox: null };
    });
    lista.totales = { n: todas.length, ha: null, municipios: lista.municipios.length };
    return lista;
  }

  // ── El enrutador de la demo ────────────────────────────────────────────────────────────
  function respuestaPng() {
    // Un PNG de 1×1 **transparente**: la ortofoto no existe en la demo, pero el navegador tiene
    // que recibir una imagen válida o pinta el icono de «imagen rota» encima del contorno.
    var base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    var binario = atob(base64);
    var bytes = new Uint8Array(binario.length);
    for (var i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    return Promise.resolve(
      new Response(bytes, { status: 200, headers: { "Content-Type": "image/png" } })
    );
  }

  function atender(ruta, metodo, opciones) {
    var camino = ruta.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
    var partes = camino.replace(/^\/+/, "").split("/");
    if (partes[0] !== "api") return null; // lo que no es API se deja pasar (los ficheros).

    var cuerpo = null;
    try {
      cuerpo = opciones && opciones.body ? JSON.parse(opciones.body) : null;
    } catch (error) {
      cuerpo = null;
    }

    var resto = partes.slice(1).join("/");

    if (resto === "interfaz") return responder(DATOS.interfaz);
    if (resto === "cuenta/yo") return responder(DATOS.cuenta);
    // **En la demo no hay alta de cuentas** (10/11/2026): es una copia fija con datos inventados y
    // no hay backend detrás, así que lo honesto es decirlo en vez de fingir un alta.
    if (resto === "cuenta/registro")
      return responder(
        { detail: "En esta demo no se pueden crear cuentas: es una copia fija con datos de ejemplo." },
        403
      );
    if (resto === "cuenta/entrar") return responder({ token: "demo" }, 201);
    if (resto === "nuevo/hoy") {
      var hoy = clonar(DATOS.hoy);
      var lista = tierrasParaLaLista();
      if (hoy && hoy.tierras) hoy.tierras = lista.totales;
      var ultimosGuardados = trabajosGuardados().map(function (trabajo) {
        return {
          tipo: trabajo.tipo,
          fecha: trabajo.fecha,
          tierra: trabajo.tierra_alias,
          titulo: trabajo.titulo,
        };
      });
      if (hoy && hoy.ultimos) hoy.ultimos = ultimosGuardados.concat(hoy.ultimos);
      return responder(hoy);
    }
    if (resto === "nuevo/tierras") return responder(tierrasParaLaLista());
    if (resto === "nuevo/resumen") return responder(DATOS.resumen);
    if (resto === "nuevo/que-falta") return responder(DATOS.que_falta);
    if (resto.indexOf("nuevo/trabajos") === 0) {
      var trabajos = clonar(DATOS.trabajos);
      trabajos.trabajos = trabajosGuardados().concat(trabajos.trabajos || []);
      return responder(trabajos);
    }
    if (resto.indexOf("nuevo/calendario") === 0) return responder(DATOS.calendario);
    if (resto.indexOf("nuevo/tierra/") === 0) {
      var identificador = Number(resto.split("/").pop());
      var extra = tierrasGuardadas().filter(function (tierra) {
        return Number(tierra.id) === identificador;
      })[0];
      if (extra) return responder(fichaDe(extra));
      var guardada = DATOS["tierra_" + identificador];
      return guardada ? responder(guardada) : responder({ detail: "Esa tierra no está en la demo." }, 404);
    }
    if (resto === "facturas") return responder(DATOS.facturas);
    if (resto === "documentos") return responder(DATOS.documentos);
    if (resto.indexOf("observabilidad/pantalla") === 0) return responder(undefined, 204);
    // Sin ortofoto: la pantalla dibuja el contorno con el anillo de la parcela.
    if (resto.indexOf("mapa/tierra/") === 0 && resto.slice(-4) === ".png")
      return responder(
        { detail: "En esta demo no hay ortofoto; el contorno se dibuja con los datos de la parcela." },
        409
      );
    // La ortofoto no existe en la demo, pero la imagen tiene que ser válida: si no, el
    // navegador pinta el icono de imagen rota encima del contorno.
    if (resto.indexOf("mapa/imagen") === 0) return respuestaPng();

    // La búsqueda del SIGPAC y el alta.
    if (resto === "sigpac/buscar") {
      var referencia = normalizarReferencia(
        (cuerpo && (cuerpo.referencia || cuerpo.ref_sigpac)) || ""
      );
      var recintos = recintosDeLaReferencia(referencia);
      var plantilla = clonar((DATOS.busquedas || {})[referencia] || {});
      return responder({
        textos: plantilla.textos || null,
        busqueda: referencia,
        encontrados: recintos.length,
        recintos: recintos,
        mensaje:
          recintos.length > 0
            ? null
            : "En esta demo solo están las parcelas de ejemplo del cliente (Salamanca).",
      });
    }
    if (resto === "parcelas/desde-sigpac" || resto === "parcelas/desde-sigpac/varias") {
      var pedidas = (cuerpo && (cuerpo.referencias || (cuerpo.referencia ? [cuerpo.referencia] : []))) || [];
      var creadas = [];
      var nuevas = 0;
      pedidas.forEach(function (referencia) {
        var recintos = recintosDeLaReferencia(referencia);
        if (!recintos.length) return;
        var resultado = crearDesdeRecinto(recintos[0]);
        creadas.push(resultado.tierra);
        if (resultado.nueva) nuevas += 1;
      });
      if (resto === "parcelas/desde-sigpac/varias")
        return responder({ cuantas: nuevas, creadas: creadas }, 201);
      if (!creadas.length)
        return responder({ detail: "En esta demo no hay ninguna parcela con esa referencia." }, 404);
      return responder(creadas[0], 201);
    }
    if (resto === "parcelas" && metodo === "POST") {
      // Alta solo con la referencia (sin dibujo): lo que pide el camino del papel.
      var recintosAlt = recintosDeLaReferencia((cuerpo && cuerpo.ref_sigpac) || "");
      var tierraAlt = recintosAlt.length ? crearDesdeRecinto(recintosAlt[0]).tierra : null;
      if (tierraAlt && cuerpo && cuerpo.alias) {
        tierraAlt.alias = cuerpo.alias;
        var guardadas = tierrasGuardadas().map(function (tierra) {
          return tierra.id === tierraAlt.id ? tierraAlt : tierra;
        });
        guardarTierras(guardadas);
      }
      if (tierraAlt) return responder(tierraAlt, 201);
      return responder({ detail: "En esta demo, una tierra se da de alta con una referencia conocida." }, 404);
    }
    if (resto.indexOf("parcelas/") === 0 && metodo === "PUT") {
      return responder({ ok: true });
    }
    // **Guardar un apunte en la demo** (13/11/2026). Se guarda en el navegador y se devuelve
    // creado; el historial lo enseña. Sin esto, la cola se vaciaba con «Ya está enviado.» y el
    // apunte no estaba en ningún sitio.
    if (resto === "tratamientos" && metodo === "POST") {
      var apunteGuardado = trabajoDesdeElApunte(cuerpo);
      var listaDeTrabajos = trabajosGuardados();
      listaDeTrabajos.unshift(apunteGuardado);
      guardarTrabajos(listaDeTrabajos);
      return responder(apunteGuardado, 201);
    }

    // Cualquier otra puerta de la API: se contesta con una lista vacía y la pantalla no se rompe.
    return responder({});
  }

  // ── El parche de fetch ─────────────────────────────────────────────────────────────────
  var original = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (recurso, opciones) {
    try {
      var url = typeof recurso === "string" ? recurso : recurso && recurso.url;
      var metodo = ((opciones && opciones.method) || "GET").toUpperCase();
      var respuesta = atender(url || "", metodo, opciones);
      if (respuesta) return respuesta;
    } catch (error) {
      // Un fallo de la demo no puede dejar la pantalla en blanco: se sigue con fetch normal.
    }
    return original ? original(recurso, opciones) : Promise.reject(new Error("sin fetch"));
  };

  // ── El aviso de que esto es una demo ──────────────────────────────────────────────────
  function ponerElAviso() {
    if (document.getElementById("demo-aviso")) return;
    var estilo = document.createElement("style");
    estilo.textContent =
      "html{padding-top:46px!important}" +
      "#demo-aviso{position:fixed;top:0;left:0;right:0;z-index:100000;display:flex;gap:8px;" +
      "align-items:center;justify-content:center;min-height:46px;padding:6px 12px;" +
      "background:#7a3d00;color:#fff;font:600 13px/1.3 system-ui,-apple-system,sans-serif;" +
      "text-align:center}" +
      "#demo-aviso b{font-weight:800}" +
      "#demo-aviso a{color:#fff;text-decoration:underline}";
    document.head.appendChild(estilo);

    var aviso = document.createElement("div");
    aviso.id = "demo-aviso";
    aviso.setAttribute("role", "status");
    aviso.innerHTML =
      "<span><b>DEMO</b> · Datos ficticios de ejemplo (parcelas inventadas). " +
      "Lo que apuntes se queda en este navegador, no en un servidor.</span>";
    document.body.insertBefore(aviso, document.body.firstChild);
  }

  // ── Las imágenes que la app pide con src (no con fetch) ────────────────────────────────
  //
  // En GitHub Pages la demo vive en /<repositorio>/, así que una imagen con src="/api/..." se
  // pide a la raíz del dominio (404) y el navegador pinta el icono de imagen rota **encima del
  // contorno**. Aquí se cambian por un PNG transparente: la app dibuja el contorno con su SVG y
  // no queda ningún icono roto.
  var PNG_VACIO =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  function arreglarImagenes() {
    // Solo la ortofoto del mapa dibujado (/api/mapa/imagen). **La foto de la tierra NO se toca:**
    // su fallo es lo que hace que la app dibuje el contorno con el SVG, y eso lo queremos.
    var imgs = document.querySelectorAll('img[src^="/api/mapa/imagen"]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.getAttribute("data-demo-vacia") === "1") continue;
      img.setAttribute("data-demo-vacia", "1");
      img.setAttribute("src", PNG_VACIO);
    }
    var enlaces = document.querySelectorAll('a[href^="/api/"]');
    for (var j = 0; j < enlaces.length; j++) {
      var enlace = enlaces[j];
      if (enlace.getAttribute("data-demo-sin-descarga") === "1") continue;
      enlace.setAttribute("data-demo-sin-descarga", "1");
      enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
      });
    }
    // **Los enlaces a la app de siempre no salen del dominio en la demo** (CU-U1, 11/11/2026): en
    // GitHub Pages `href="/"` es el portfolio. Y una pestaña que no lleva a ninguna parte es peor
    // que no tenerla, así que en la demo **se esconden**: las pantallas que sí existen (Trabajos,
    // Productos, Facturas, Cuaderno…) son botones y funcionan.
    var salidas = document.querySelectorAll(
      'a[href="/"].nav__enlace, a[href="/"].tarjeta, .barra-superior a[href="/"]'
    );
    for (var k = 0; k < salidas.length; k++) {
      var salida = salidas[k];
      if (salida.getAttribute("data-demo-oculta") === "1") continue;
      salida.setAttribute("data-demo-oculta", "1");
      salida.style.display = "none";
      salida.addEventListener("click", function (evento) {
        evento.preventDefault();
      });
    }
    // Lo que no se esconde, tampoco navega fuera.
    var otros = document.querySelectorAll('a[href="/"]');
    for (var m = 0; m < otros.length; m++) {
      var otro = otros[m];
      if (otro.getAttribute("data-demo-sin-salida") === "1") continue;
      otro.setAttribute("data-demo-sin-salida", "1");
      otro.addEventListener("click", function (evento) {
        evento.preventDefault();
      });
    }
    // **Bajar el cuaderno en PDF no se puede en la demo** (11/11/2026): no hay servidor que lo
    // escriba. Antes que dejar un botón que no hace nada, se esconde la tarjeta entera.
    var bajadas = document.querySelectorAll('[data-descargar-cuaderno]');
    for (var q = 0; q < bajadas.length; q++) {
      bajadas[q].style.display = "none";
    }
  }

  function vigilar() {
    arreglarImagenes();
    try {
      new MutationObserver(arreglarImagenes).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "href"],
      });
    } catch (error) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ponerElAviso();
      vigilar();
    });
  } else {
    ponerElAviso();
    vigilar();
  }
})();
