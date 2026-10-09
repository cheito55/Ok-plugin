import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Search, 
  Sliders, 
  RotateCcw, 
  FileCode, 
  Download,
  Cast,
  Tv,
  ListOrdered,
  Cpu
} from 'lucide-react';
import { generateScriptJs, generateSourceJson, PluginOptions, DEFAULT_PLUGIN_OPTIONS } from '../data/pluginCode';

interface CodeViewerProps {
  options: PluginOptions;
  setOptions: React.Dispatch<React.SetStateAction<PluginOptions>>;
  initialFileType?: 'script' | 'manifest';
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  options, 
  setOptions,
  initialFileType = 'script' 
}) => {
  const [fileType, setFileType] = useState<'script' | 'manifest'>(initialFileType);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const scriptCode = generateScriptJs(options);
  const manifestCode = generateSourceJson(options);

  const currentCode = fileType === 'script' ? scriptCode : manifestCode;
  const currentFilename = fileType === 'script' ? 'Script.js' : 'source.json';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mime = fileType === 'script' ? 'application/javascript' : 'application/json';
    const blob = new Blob([currentCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtrado de líneas si hay término de búsqueda
  const lines = currentCode.split('\n');
  const matchedLineIndices = searchTerm.trim()
    ? lines
        .map((line, idx) => (line.toLowerCase().includes(searchTerm.toLowerCase()) ? idx : -1))
        .filter((idx) => idx !== -1)
    : [];

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setFileType('script')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                fileType === 'script'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Script.js (Lógica v{options.version})
            </button>
            <button
              onClick={() => setFileType('manifest')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                fileType === 'manifest'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              source.json (Manifiesto)
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              showConfig
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Configurador Dinámico
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Búsqueda rápida */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar función o variable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition placeholder:text-slate-500"
            />
            {searchTerm && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {matchedLineIndices.length} matches
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Bajar
          </button>
        </div>
      </div>

      {/* Panel de configuración dinámico */}
      {showConfig && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Ajustes del Generador de Código
            </h4>
            <button
              onClick={() => setOptions(DEFAULT_PLUGIN_OPTIONS)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar recomendados
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Toggle HLS first */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-orange-400" /> Priorizar HLS Master
              </label>
              <p className="text-[11px] text-slate-400">
                Ofrece HLS Master como primera fuente para streaming adaptativo suave.
              </p>
              <button
                onClick={() => setOptions((prev) => ({ ...prev, preferHlsFirst: !prev.preferHlsFirst }))}
                className={`w-full py-1 px-2 rounded font-semibold text-[11px] transition ${
                  options.preferHlsFirst ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {options.preferHlsFirst ? 'HLS Master Primero (Recomendado)' : 'MP4 HD Primero'}
              </button>
            </div>

            {/* Toggle Cast Headers */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cast className="w-3.5 h-3.5 text-blue-400" /> Compatibilidad Chromecast
              </label>
              <p className="text-[11px] text-slate-400">
                Headers en el stream rompen Cast por CORS. Se recomienda desactivado.
              </p>
              <button
                onClick={() =>
                  setOptions((prev) => ({ ...prev, enableSourceHeaders: !prev.enableSourceHeaders }))
                }
                className={`w-full py-1 px-2 rounded font-semibold text-[11px] transition ${
                  !options.enableSourceHeaders ? 'bg-emerald-600 text-white' : 'bg-red-800 text-white'
                }`}
              >
                {!options.enableSourceHeaders
                  ? 'Limpio sin headers (Cast 100% Funcional)'
                  : 'Inyectar Headers (Puede romper Cast)'}
              </button>
            </div>

            {/* Max Drain Pages */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-emerald-400" /> Máx. Páginas de Series
              </label>
              <p className="text-[11px] text-slate-400">
                Límite de páginas a drenar en álbumes para ordenar todos los capítulos.
              </p>
              <input
                type="number"
                min="10"
                max="200"
                value={options.maxDrainPages}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, maxDrainPages: Number(e.target.value) || 80 }))
                }
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs"
              />
            </div>

            {/* Debug Mode */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Diagnóstico en Descripción
              </label>
              <p className="text-[11px] text-slate-400">
                Añade texto [debug canal] al pie de los videos para depurar.
              </p>
              <button
                onClick={() =>
                  setOptions((prev) => ({ ...prev, enableSeriesDebug: !prev.enableSeriesDebug }))
                }
                className={`w-full py-1 px-2 rounded font-semibold text-[11px] transition ${
                  options.enableSeriesDebug ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {options.enableSeriesDebug ? 'Activado (Modo Dev)' : 'Desactivado (Limpio)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor / Visor de Código */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
            <span className="ml-2 font-mono font-medium text-slate-300">{currentFilename}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            {lines.length} líneas • UTF-8 • ECMAScript / QuickJS
          </div>
        </div>

        <div className="max-h-[640px] overflow-y-auto overflow-x-auto p-4 font-mono text-[11px] leading-relaxed select-text">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const isMatch = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      isMatch ? 'bg-amber-500/20 text-amber-200' : ''
                    }`}
                  >
                    <td className="w-10 pr-4 text-right text-slate-600 select-none align-top font-mono text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="text-slate-300 whitespace-pre">
                      {line || ' '}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
