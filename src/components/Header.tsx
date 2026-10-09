import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileCode, 
  FileJson, 
  Package, 
  Layers,
  Sparkles,
  QrCode
} from 'lucide-react';
import JSZip from 'jszip';
import { generateScriptJs, generateSourceJson, PluginOptions } from '../data/pluginCode';

interface HeaderProps {
  options: PluginOptions;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ options, activeTab, setActiveTab }) => {
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const scriptCode = generateScriptJs(options);
  const sourceJson = generateSourceJson(options);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();
      zip.file('Script.js', scriptCode);
      zip.file('source.json', sourceJson);
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `okru-grayjay-plugin-v${options.version}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando ZIP:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl">
              OK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  GrayJay Plugin Studio
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> v{options.version} Corregido
                </span>
              </div>
              <p className="text-xs text-slate-400">
                OK.ru Source para GrayJay • Corrección de bugs de Pager, Cast, Series y manifiesto
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('qr')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition animate-pulse"
            >
              <QrCode className="w-3.5 h-3.5" />
              Instalar con QR / URL
            </button>

            <button
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Copiar Script.js al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '¡Copiado!' : 'Copiar Script.js'}
            </button>

            <button
              onClick={() => handleDownloadFile('Script.js', scriptCode, 'application/javascript')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Script.js
            </button>

            <button
              onClick={() => handleDownloadFile('source.json', sourceJson, 'application/json')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-400" />
              source.json
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 transition disabled:opacity-50"
            >
              <Package className="w-3.5 h-3.5" />
              {downloadingZip ? 'Creando ZIP...' : 'Descargar Plugin .ZIP'}
            </button>
          </div>
        </div>

        {/* Barra de navegación de pestañas */}
        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60 bg-emerald-950/20 border border-emerald-500/20'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            📲 Instalar con QR / URL (Fácil)
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Diagnóstico de Errores (7 Corregidos)
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Código Script.js (v{options.version})
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            Manifiesto source.json
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulador de Capítulos & URLs
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Cómo Instalar en GrayJay
          </button>
        </div>
      </div>
    </header>
  );
};
