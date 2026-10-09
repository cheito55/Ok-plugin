import React, { useState } from 'react';
import { Header } from './components/Header';
import { DiagnosticsView } from './components/DiagnosticsView';
import { CodeViewer } from './components/CodeViewer';
import { SimulatorLab } from './components/SimulatorLab';
import { InstallGuide } from './components/InstallGuide';
import { QrInstaller } from './components/QrInstaller';
import { DEFAULT_PLUGIN_OPTIONS, PluginOptions } from './data/pluginCode';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  FileCode, 
  ShieldCheck,
  Package,
  QrCode,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('qr');
  const [options, setOptions] = useState<PluginOptions>(DEFAULT_PLUGIN_OPTIONS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Encabezado Principal */}
      <Header 
        options={options} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Informativo Superior */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Revisión del Plugin GrayJay Completada
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hemos corregido el fallo fatal de paginación <code className="text-amber-300">hasMorePagers()</code>, el conflicto de cabeceras en Cast, el error de tipo <code className="text-amber-300">MIXED</code> y generado el archivo <code className="text-blue-300">source.json</code> necesario.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Ver Script.js Corregido
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-sm transition"
            >
              Probar Algoritmo
            </button>
          </div>
        </div>

        {/* Vistas según pestaña activa */}
        {activeTab === 'qr' && <QrInstaller version={options.version} />}

        {activeTab === 'diagnostics' && <DiagnosticsView />}
        
        {activeTab === 'code' && (
          <CodeViewer 
            options={options} 
            setOptions={setOptions} 
            initialFileType="script" 
          />
        )}

        {activeTab === 'manifest' && (
          <CodeViewer 
            options={options} 
            setOptions={setOptions} 
            initialFileType="manifest" 
          />
        )}

        {activeTab === 'simulator' && <SimulatorLab />}

        {activeTab === 'install' && <InstallGuide />}
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GrayJay Plugin Studio</span>
            <span>•</span>
            <span>OK.ru Source v43</span>
            <span>•</span>
            <span className="text-emerald-400">Compatible con QuickJS / Android / Desktop</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setActiveTab('install')}
              className="hover:text-white transition"
            >
              Guía de Instalación
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('code')}
              className="hover:text-white transition"
            >
              Ver Código Fuente
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
