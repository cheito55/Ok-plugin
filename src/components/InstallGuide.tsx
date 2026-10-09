import React from 'react';
import { 
  Package, 
  FileCode, 
  KeyRound, 
  Tv, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone,
  ToggleRight,
  Search,
  RefreshCw,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const InstallGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* SECCIÓN ESPECIAL: RESOLUCIÓN DIRECTA AL PROBLEMA "NO APARECE TRAS INSTALAR" */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              ¿Por qué se instalaba pero no aparecía en GrayJay?
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              En GrayJay, cuando una fuente "se instala con éxito pero no se ve en la aplicación", se debe a 3 motivos técnicos que hemos corregido en esta nueva versión v43:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">1</span>
              Faltaba <code className="text-amber-300 font-mono text-[11px]">packages</code>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              GrayJay exige en <code className="text-slate-300">source.json</code> el campo <code className="text-amber-300">"packages": ["Script.js"]</code>. Sin esto, GrayJay descomprime el plugin pero <strong>no ejecuta el archivo JavaScript</strong>, por lo que nunca se registraba en la lista de fuentes. <em>(¡Ya corregido en el ZIP nuevo!)</em>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px]">2</span>
              Switch Desactivado
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Cuando instalas un ZIP local, GrayJay por seguridad lo deja en estado <strong>"Desactivado" (OFF)</strong>. Debes ir a <strong>Sources (Fuentes)</strong> y encender el interruptor de <strong>OK.ru</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[11px]">3</span>
              Filtro en Búsqueda
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Al buscar un video en GrayJay, pulsa en la pestaña superior que dice <strong>[OK.ru]</strong> para ver sus resultados específicamente. Además, ahora la pantalla <strong>Home</strong> carga videos populares automáticamente.
            </p>
          </div>
        </div>
      </div>

      {/* GUÍA PASO A PASO PARA REINSTALAR LIMPIO */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-orange-400" />
          Pasos para instalar la versión corregida v43:
        </h3>

        <div className="space-y-4 text-xs">
          {/* Paso 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-200">
                Si tenías el plugin anterior instalado, desinstálalo primero
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                En GrayJay ve a <strong>Fuentes (Sources)</strong> &gt; Toca en <strong>OK.ru</strong> (o el icono de tres puntos) &gt; Selecciona <strong>Eliminar / Desinstalar fuente</strong> para limpiar la versión anterior de la caché.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-200">
                Descarga el nuevo archivo ZIP corregido
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Pulsa el botón naranja <strong className="text-white">"Descargar Plugin .ZIP"</strong> arriba a la derecha. Este ZIP incluye el <code className="text-amber-300">source.json</code> con la directiva <code className="text-amber-300">packages: ["Script.js"]</code> y <code className="text-amber-300">allowAllInternet: true</code>.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-200">
                Importa el archivo en GrayJay
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Abre GrayJay &gt; Menú o Engranaje &gt; <strong>Sources (Fuentes)</strong> &gt; <strong>+ Añadir Fuente (+ Add Source)</strong> &gt; <strong>Instalar desde archivo / ZIP</strong> &gt; Elige el ZIP descargado.
              </p>
            </div>
          </div>

          {/* Paso 4 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-emerald-900/40 bg-emerald-950/10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <ToggleRight className="w-4 h-4 text-emerald-400" />
                ¡Importante! Activa el interruptor de la fuente
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                En la lista de fuentes, asegúrate de que el interruptor de <strong>OK.ru</strong> esté en verde (activado). Si te aparece una ventana emergente de permisos de red, pulsa <strong>"Permitir" / "Aceptar"</strong>.
              </p>
            </div>
          </div>

          {/* Paso 5 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              5
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-purple-400" />
                Cómo ver y buscar videos de OK.ru
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                En la barra de búsqueda de GrayJay, escribe cualquier título (ejemplo: <em>"pelicula"</em>, <em>"la reina del sur"</em> o <em>"historia de evan"</em>). Verás los filtros de fuentes en la parte superior: toca sobre <strong>[OK.ru]</strong> para ver los resultados directamente de OK.ru.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETALLES DE SESIÓN Y CHROMACAST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-400" />
            Iniciar sesión si la búsqueda no arroja videos
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            OK.ru requiere autenticación para realizar búsquedas en su base de datos. En GrayJay ve a <strong>Fuentes &gt; OK.ru &gt; Iniciar sesión (Login)</strong>. Se abrirá una ventana de navegador web segura dentro de GrayJay donde ingresas tu cuenta de OK.ru una única vez.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-emerald-400" />
            Chromecast y Cast sin pantallas 00:00
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Las cabeceras <code className="text-slate-300">requestModifier</code> fueron desactivadas para HLS. Los enlaces firmados del CDN de OK.ru (<code className="text-slate-300">okcdn.ru</code>) ahora se transmiten directamente al Chromecast sin bloqueos CORS.
          </p>
        </div>
      </div>
    </div>
  );
};
