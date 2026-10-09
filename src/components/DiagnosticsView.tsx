import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Bug,
  Sparkles,
  Zap,
  Cast,
  Tv
} from 'lucide-react';
import { DIAGNOSTICS, BugReport } from '../data/diagnostics';

export const DiagnosticsView: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(DIAGNOSTICS[0].id);

  const filtered = DIAGNOSTICS.filter(
    (b) => selectedSeverity === 'all' || b.severity === selectedSeverity
  );

  const getSeverityBadge = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
            <AlertOctagon className="w-3 h-3 mr-1" /> Crítico
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" /> Alto
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Info className="w-3 h-3 mr-1" /> Medio
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            Informativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta de resumen de mejoras principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Fix: hasMorePagers() corregido
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Se reemplazó la llamada inválida por <code className="text-amber-300">hasMore</code> / <code className="text-amber-300">hasMorePages()</code> para evitar que el scroll y las series crasheen.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Cast className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Fix: Chromecast & CORS limpio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Desactivado <code className="text-amber-300">requestModifier</code> en streams HLS para permitir casteo sin pantallas 00:00 ni bloqueos CORS en okcdn.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              source.json & Whitelist de CDNs
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Generado el manifiesto oficial con autorización para <code className="text-amber-300">okcdn.ru</code> y <code className="text-amber-300">mycdn.me</code> requerido por GrayJay.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filtrar por severidad:</span>
          <div className="flex items-center gap-1">
            {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedSeverity === sev
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {sev === 'all' ? 'Todos (7)' : sev === 'critical' ? 'Críticos' : sev === 'high' ? 'Altos' : 'Medios'}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Mostrando {filtered.length} de {DIAGNOSTICS.length} hallazgos
        </span>
      </div>

      {/* Lista detallada de hallazgos */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getSeverityBadge(item.severity)}
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-100 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Área: <span className="text-slate-300 font-mono">{item.affectedArea}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 space-y-4 text-xs">
                  {/* Síntoma */}
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-red-300">
                    <span className="font-semibold block mb-1">⚠️ Síntoma observado en GrayJay:</span>
                    {item.symptom}
                  </div>

                  {/* Comparación de código */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
                        <span className="flex items-center gap-1 text-red-400">
                          <AlertOctagon className="w-3.5 h-3.5" /> Código Original con Error
                        </span>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 border border-red-900/40 text-red-200/90 font-mono text-[11px] overflow-x-auto leading-relaxed">
                        {item.originalSnippet}
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Código Corregido (v43)
                        </span>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40 text-emerald-200/90 font-mono text-[11px] overflow-x-auto leading-relaxed">
                        {item.fixedSnippet}
                      </pre>
                    </div>
                  </div>

                  {/* Explicación técnica */}
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-300">
                    <span className="font-semibold text-slate-200 block mb-1">
                      💡 Explicación Técnica y Por qué ocurría:
                    </span>
                    <p className="leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
