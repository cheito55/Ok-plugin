import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Key, 
  Sparkles, 
  Smartphone, 
  ArrowRight,
  ShieldAlert,
  FileArchive,
  RefreshCw
} from 'lucide-react';

interface QrInstallerProps {
  version: number;
}

export const QrInstaller: React.FC<QrInstallerProps> = ({ version }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedDeepLink, setCopiedDeepLink] = useState<boolean>(false);

  // Obtener la URL pública de source.json
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const pluginUrl = `${currentOrigin}/plugin/source.json`;
  const deepLink = `grayjay://plugin/${pluginUrl}`;

  useEffect(() => {
    if (pluginUrl) {
      QRCode.toDataURL(pluginUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generando QR:', err));
    }
  }, [pluginUrl]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pluginUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyDeepLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopiedDeepLink(true);
    setTimeout(() => setCopiedDeepLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ALERTA CRÍTICA: La razón #1 por la que GrayJay "no hace nada" */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/40 border-2 border-red-500/50 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                🛑 PASO OBLIGATORIO: Por qué GrayJay "no hace nada" al instalar
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500 text-white">
                IMPORTANTE
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Por seguridad, la app oficial de <strong>GrayJay bloquea silenciosamente cualquier plugin de terceros</strong> si no activas las fuentes no firmadas. Si no haces esto primero, tocar el archivo o el enlace <strong>no hará absolutamente nada</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-200 space-y-1.5 font-medium">
              <div className="flex items-center gap-2 text-white font-bold">
                <span>Cómo activarlo en GrayJay en 10 segundos:</span>
              </div>
              <p>1. Abre GrayJay ➡️ Toca la rueda de <strong>Ajustes (Settings)</strong>.</p>
              <p>2. Entra en <strong>Fuentes (Sources)</strong>.</p>
              <p>3. Activa la opción: <strong className="text-emerald-400 underline decoration-emerald-500 underline-offset-2">"Permitir fuentes no verificadas" (Allow untrusted / unsigned sources)</strong> o <strong>"Modo desarrollador"</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* METODO 1: CÓDIGO QR / URL DIRECTA (EL QUE NUNCA FALLA) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-400" />
              Método Más Fácil: Escanear QR o Instalar desde URL
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              No necesitas descargar archivos al teléfono. GrayJay descarga el plugin directamente de la nube.
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Recomendado para Móvil & TV
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Código QR */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800">
            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <img 
                  src={qrDataUrl} 
                  alt="Código QR Plugin GrayJay OK.ru" 
                  className="w-56 h-56 object-contain"
                />
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-500 text-xs">
                Generando QR...
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Abre <strong>GrayJay ➡️ Fuentes ➡️ + ➡️ Escanear QR</strong> y apunta a la pantalla.
            </p>
          </div>

          {/* Opciones con URL y Deep Link */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            {/* Opción A: Copiar URL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Opción A: Pegar URL en GrayJay
                </span>
                <span className="text-[10px] text-slate-500">Fuentes &gt; + &gt; Desde URL</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                En GrayJay pulsa <strong>+ Añadir Fuente</strong> ➡️ <strong>Instalar desde URL</strong> y pega este enlace:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pluginUrl}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  {copiedUrl ? '¡Copiada!' : 'Copiar URL'}
                </button>
              </div>
            </div>

            {/* Opción B: Enlace directo móvil */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Opción B: ¿Estás viendo esta página desde el mismo móvil?
                </span>
                <span className="text-[10px] text-orange-400 font-bold">1 Toque</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Si abriste este enlace desde tu navegador en el teléfono con GrayJay instalado, este botón abrirá la app e instalará el plugin directamente:
              </p>
              <div className="flex gap-2">
                <a
                  href={deepLink}
                  className="flex-1 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Smartphone className="w-4 h-4" />
                  Abrir e Instalar en GrayJay Directamente
                </a>
                <button
                  onClick={handleCopyDeepLink}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                  title="Copiar grayjay:// deep link"
                >
                  {copiedDeepLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METODO 2: SOLUCIÓN SI PREFIERES EL ARCHIVO ZIP */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileArchive className="w-4 h-4 text-amber-400" />
          ¿Qué hacer si intentas instalar desde el archivo .ZIP y falla?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              1. No descomprimas el ZIP
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              GrayJay necesita el archivo <code className="text-amber-300">.zip</code> cerrado tal cual lo descargas. Si tu teléfono o explorador de archivos lo descomprimió automáticamente en una carpeta, GrayJay no lo reconocerá.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              2. Usa el Explorador de Archivos interno
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Al pulsar "Install from file" en GrayJay, si se abre Google Drive o Descargas en la nube, cambia al almacenamiento interno de tu dispositivo y busca la carpeta <strong>Download / Descargas</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
