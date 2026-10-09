export interface BugReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  affectedArea: string;
  symptom: string;
  originalSnippet: string;
  fixedSnippet: string;
  explanation: string;
}

export const DIAGNOSTICS: BugReport[] = [
  {
    id: 'has-more-pagers-bug',
    title: 'Método inexistente hasMorePagers() en VideoPager',
    severity: 'critical',
    affectedArea: 'OkSearchPager, OkChannelVideoPager y sortedSeriesPager',
    symptom: 'TypeError: this.hasMorePagers is not a function al hacer scroll en búsquedas, canales o al cargar series ordenadas.',
    originalSnippet: `class OkSearchPager extends VideoPager {
    // ...
    nextPage() {
        if (!this.hasMorePagers()) return this; // ❌ ERROR: método no existe en GrayJay SDK
        return searchOk(this.context.query, this.context.page);
    }
}
// También presente en OkChannelVideoPager y en el bucle:
// while (pager && pager.hasMorePagers() && ...) // ❌ ROMPE LA SERIE`,
    fixedSnippet: `// Función helper segura compatible con todas las versiones del SDK de GrayJay:
function pagerHasMore(p) {
    if (!p) return false;
    if (typeof p.hasMorePages === "function") return p.hasMorePages();
    if (typeof p.hasMorePagers === "function") return p.hasMorePagers();
    return !!p.hasMore;
}

class OkSearchPager extends VideoPager {
    nextPage() {
        if (!pagerHasMore(this)) return this; // ✅ COMPATIBLE
        return searchOk(this.context.query, this.context.page);
    }
}`,
    explanation: 'En el SDK oficial de GrayJay (Futo), la clase VideoPager implementa la propiedad booleana `hasMore` o el método `hasMorePages()`. El código invocaba `this.hasMorePagers()` con una "r" extra, lo que causaba un fallo no controlado que detenía la paginación continua y arruinaba la función `sortedSeriesPager`.'
  },
  {
    id: 'cast-chromecast-headers',
    title: 'requestModifier en HLSSource rompía Chromecast / Cast',
    severity: 'critical',
    affectedArea: 'makeHlsSource y ENABLE_SOURCE_HEADERS',
    symptom: 'Pantalla negra o error 00:00 al enviar a Chromecast / TV Cast.',
    originalSnippet: `const ENABLE_SOURCE_HEADERS = true; // Comentario advertía que rompía Cast, pero estaba en true

function makeHlsSource(url, duration, mode) {
    let opts = { name: "OK.ru HLS", duration: duration || 0, url: url };
    if (ENABLE_SOURCE_HEADERS && mode !== "none") {
        opts.requestModifier = okRequestModifier(mode === "noorigin" ? false : SEND_ORIGIN_TO_PLAYER);
    }
    return new HLSSource(opts);
}`,
    fixedSnippet: `// Desactivado para HLS por defecto: el CDN de OK.ru ya firma las URLs con token
const ENABLE_SOURCE_HEADERS = false; // ✅ Cast y Chromecast funcionan sin rechazos CORS

function makeHlsSource(url, duration, mode) {
    let opts = {
        name: "OK.ru HLS",
        duration: duration || 0,
        url: url
    };
    // Solo si el usuario explícitamente fuerza headers y no es Cast
    if (ENABLE_SOURCE_HEADERS && mode === "force_headers") {
        opts.requestModifier = okRequestModifier(false);
    }
    return new HLSSource(opts);
}`,
    explanation: 'El reproductor web de Google Cast (Chromecast) no puede ejecutar callbacks JavaScript de scripts locales de GrayJay para modificar cabeceras de segmentos HLS en vuelo. Dado que okcdn.ru ya valida la firma de seguridad dentro de los parámetros de la URL (?sig= / expires=), enviar Origin o cabeceras adicionales provoca bloqueo por políticas CORS.'
  },
  {
    id: 'result-capabilities-mixed',
    title: 'Tipo inválido ["MIXED"] en getChannelCapabilities',
    severity: 'high',
    affectedArea: 'okChannelTypes / getChannelCapabilities',
    symptom: 'Excepción de tipo no reconocido o pestañas de canal rotas en la UI de GrayJay.',
    originalSnippet: `function okChannelTypes() {
    try {
        if (typeof Type !== "undefined" && Type && Type.Feed && Type.Feed.Mixed) return [Type.Feed.Mixed];
    } catch (_) {}
    return ["MIXED"]; // ❌ "MIXED" no es un ContentType válido en GrayJay
}`,
    fixedSnippet: `function okChannelTypes() {
    try {
        if (typeof Type !== "undefined" && Type) {
            if (Type.Feed && Type.Feed.Videos) return [Type.Feed.Videos];
            if (Type.Content && Type.Content.Video) return [Type.Content.Video];
        }
    } catch (_) {}
    return ["video"]; // ✅ Fallback estándar en minúsculas aceptado por GrayJay
}`,
    explanation: 'GrayJay clasifica los contenidos de los canales como Video, Audio, Live, etc. El valor "MIXED" como string sin procesar no pertenece a los tipos válidos y provocaba que GrayJay no supiera cómo renderizar la pestaña de contenidos.'
  },
  {
    id: 'source-json-manifest',
    title: 'Ausencia del archivo de manifiesto source.json requerido',
    severity: 'critical',
    affectedArea: 'Instalación y Permisos de Red (Whitelisting)',
    symptom: 'GrayJay no puede importar el plugin, o bloquea las descargas de segmentos de okcdn.ru y mycdn.me por violación de sandbox.',
    originalSnippet: `// Solo existía el código de Script.js; faltaba source.json
// GrayJay denegaba el acceso a dominios CDN no declarados`,
    fixedSnippet: `// source.json estructurado con whitelist de dominios completa:
{
  "id": "62af0e2f-bfd9-489f-afe1-f66583d2f7d0",
  "name": "OK.ru",
  "version": 43,
  "allowUrls": [
    "https://ok.ru/*",
    "https://*.ok.ru/*",
    "https://*.okcdn.ru/*",
    "https://*.mycdn.me/*",
    "https://*.vk.me/*"
  ]
}`,
    explanation: 'GrayJay ejecuta los plugins dentro de una sandbox estricta (QuickJS). Si un plugin intenta contactar servidores no listados en `allowUrls`, el motor bloquea la conexión inmediatamente. Se generó el `source.json` oficial con todos los CDNs utilizados por OK.ru.'
  },
  {
    id: 'series-chapter-regex',
    title: 'Detección deficiente de formatos de temporada y capítulos',
    severity: 'high',
    affectedArea: 'chapterOrderKey y sortByChapter',
    symptom: 'Capítulos con formatos tipo "1x04", "Cap. 12", "Parte 3" o sufijo "(02)" quedaban desordenados o al final.',
    originalSnippet: `// Regex anterior no capturaba "1x04", ni separadores rusos como "Часть"
m = t.match(/(?:temporada|temp\.?|season|сезон)\\s*#?\\s*(\\d{1,2})/i) || ...
// Si temporada era 0, causaba desplazamientos inesperados`,
    fixedSnippet: `// Regex ampliada:
// 1. Temporada: S01, T02, Season 1, 1x04, etc.
let sm = t.match(/\\b(?:S|T)(\\d{1,2})\\s*(?:[-_ ]?\\s*(?:E|Ep|Cap)\\s*\\d|x\\d)/i) ||
         t.match(/\\b(\\d{1,2})x\\d{1,3}\\b/i) ||
         t.match(/(?:temporada|temp\\.?|season|сезон)\\s*#?\\s*(\\d{1,2})/i);

// 2. Capítulo: Cap, Ep, Episodio, Серия, Выпуск, 1x04, paréntesis (04), [04]
let cm = t.match(/\\b(?:\\d{1,2})x(\\d{1,3})\\b/i) ||
         t.match(/(?:\\b(?:cap[ií]tulos?|cap\\.?|episodios?|ep\\.?|episode|серия|эпизод|выпуск|parte|part|pt\\.?))\\s*[:#.\\-]?\\s*(\\d{1,4})/i) ||
         t.match(/[\\[\\(](\\d{1,3})[\\]\\)]/) || ...`,
    explanation: 'En OK.ru abundan series hispanas y rusas con nombres muy variados (ej: "1x04", "Cap. 05", "[02]", "Серия 12"). La regex mejorada garantiza que el orden ascendente/descendente de capítulos en álbumes/canales sea 100% preciso.'
  },
  {
    id: 'batch-http-safety',
    title: 'Riesgo de fallo fatal en http.batch()',
    severity: 'medium',
    affectedArea: 'fetchWatchAuthorsParallel y applySeriesToResults',
    symptom: 'Crash en plataformas donde GrayJay no provee http.batch() implementado.',
    originalSnippet: `let b = http.batch(); // Asumía existencia incondicional
for (let i = 0; i < ids.length; i++) b = b.GET(...);
let res = b.execute();`,
    fixedSnippet: `if (typeof http.batch !== "function") {
    // Fallback inmediato y seguro a llamadas unitarias o secuenciales
    return null;
}
try {
    let b = http.batch();
    // ...
} catch (e) {
    return null;
}`,
    explanation: 'Aunque `http.batch` es una optimización valiosa, algunas compilaciones de GrayJay en ciertas arquitecturas móviles no exponen el método. Ahora cuenta con guarda de seguridad para no interrumpir la navegación.'
  },
  {
    id: 'login-wall-feedback',
    title: 'Mensajes de error y pared de login de OK.ru',
    severity: 'medium',
    affectedArea: 'looksLikeLoginWall y LOGIN_MSG',
    symptom: 'El usuario veía mensajes confusos cuando OK.ru bloqueaba la búsqueda anónima.',
    originalSnippet: `var LOGIN_MSG = "Inicie sesión para encontrar videos";`,
    fixedSnippet: `var LOGIN_MSG = "OK.ru requiere inicio de sesión para realizar búsquedas. " +
    "Por favor, pulse el icono de llave o menú de usuario en la esquina superior de GrayJay " +
    "para iniciar sesión en OK.ru con su cuenta.";`,
    explanation: 'Se clarificó el mensaje para que el usuario entienda exactamente qué hacer dentro de la interfaz de GrayJay (abrir la sesión embebida de OK.ru en el menú de fuentes).'
  }
];
