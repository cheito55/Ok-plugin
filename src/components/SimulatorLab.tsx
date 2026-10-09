import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpDown, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle, 
  XCircle, 
  ListOrdered,
  Type,
  Link as LinkIcon
} from 'lucide-react';
import { 
  sortVideosByChapter, 
  chapterOrderKey, 
  isGenericTitle, 
  PRESET_SERIES_TESTS, 
  VideoItemTest 
} from '../utils/testerUtils';

export const SimulatorLab: React.FC = () => {
  // Estado para el probador de series
  const [items, setItems] = useState<VideoItemTest[]>(PRESET_SERIES_TESTS);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  // Estado para probador de títulos genéricos
  const [testGenericTitle, setTestGenericTitle] = useState<string>('Смотреть');

  // Estado para probador de URLs de OK.ru
  const [testUrl, setTestUrl] = useState<string>('https://ok.ru/video/7841529631488');

  // Ejecutar ordenación
  const sortedItems = sortVideosByChapter(items, sortDesc);

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const newItem: VideoItemTest = {
      id: String(Date.now()),
      name: newTitle.trim()
    };
    setItems([...items, newItem]);
    setNewTitle('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleResetPresets = () => {
    setItems(PRESET_SERIES_TESTS);
  };

  // Análisis de URL
  const parseUrlInfo = (url: string) => {
    const videoMatch = url.match(/ok\.ru\/(?:video|videoembed)\/(\d+)/i);
    const channelMatch = url.match(/ok\.ru\/(profile|group)\/([^/?#]+)(?:\/video\/c(\d+))?/i);
    const aliasMatch = url.match(/ok\.ru\/([A-Za-z0-9_.-]{3,})/i);

    return {
      videoId: videoMatch ? videoMatch[1] : null,
      channelType: channelMatch ? channelMatch[1] : null,
      channelId: channelMatch ? channelMatch[2] : null,
      seriesAlbumId: channelMatch && channelMatch[3] ? `c${channelMatch[3]}` : null,
      alias: !channelMatch && aliasMatch ? aliasMatch[1] : null
    };
  };

  const urlAnalysis = parseUrlInfo(testUrl);
  const isGeneric = isGenericTitle(testGenericTitle);

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: PROBADOR DE ORDEN DE CAPÍTULOS DE SERIES */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-orange-400" />
              Simulador del Algoritmo de Orden de Capítulos (Series & Álbumes)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prueba cómo el script v43 analiza los títulos en español, inglés y cirílico y los ordena por Temporada y Capítulo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white transition shadow"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortDesc ? 'Capítulo ↓ (Mayor a menor)' : 'Capítulo ↑ (Menor a mayor)'}
            </button>
            <button
              onClick={handleResetPresets}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Reiniciar Ejemplos
            </button>
          </div>
        </div>

        {/* Formulario de agregar título */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añade un título de prueba (ej: Breaking Bad 2x04, El Chema Cap. 12, Серия 4)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>

        {/* Tabla de resultados ordenados en vivo */}
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
          <div className="grid grid-cols-12 px-4 py-2 bg-slate-900/80 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
            <div className="col-span-1 text-center"># Pos.</div>
            <div className="col-span-6">Título del Video en OK.ru</div>
            <div className="col-span-2 text-center">Temporada</div>
            <div className="col-span-2 text-center">Capítulo</div>
            <div className="col-span-1 text-right">Acción</div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
            {sortedItems.map((item, index) => {
              const meta = chapterOrderKey(item.name);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center px-4 py-2.5 text-xs hover:bg-slate-900/40 transition"
                >
                  <div className="col-span-1 text-center font-mono text-slate-500 font-bold">
                    {index + 1}
                  </div>
                  <div className="col-span-6 font-medium text-slate-200 truncate pr-2">
                    {item.name}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      T{meta.s}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    {meta.c !== null ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                        Ep. {meta.c}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">
                        Sin núm. (Al final)
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="Eliminar de la prueba"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: FILTRO DE TÍTULOS GENÉRICOS / BOTONES EN RUSO Y ESPAÑOL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              Probador de Filtro de Títulos Genéricos (isGenericTitle)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              En OK.ru, los botones como "Смотреть" (Ver), "Watch", "01:45" a veces se filtraban como el nombre del video. Verifica si el script los descarta correctamente:
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={testGenericTitle}
              onChange={(e) => setTestGenericTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              placeholder="Escribe una palabra (ej. Смотреть, Ver, 00:45, Mi Video)"
            />

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Resultado del filtro:</span>
              {isGeneric ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                  <XCircle className="w-4 h-4" /> DESCARTADO (Título genérico / botón)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4" /> VÁLIDO (Se acepta como título real)
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-slate-500 mr-1">Probar presets:</span>
              {['Смотреть', 'Ver video', 'Watch', '02:30', 'Breaking Bad T1', 'Серия 12'].map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => setTestGenericTitle(preset)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
                  >
                    {preset}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: ANALIZADOR DE ENLACES DE OK.RU */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-400" />
              Analizador de URLs de OK.ru (Video, Canal, Álbum)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Comprueba cómo el plugin reconoce la URL para determinar si es un video individual, un canal o un álbum de serie:
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="https://ok.ru/video/..."
            />

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">ID de Video:</span>
                <span className="text-amber-300">{urlAnalysis.videoId || 'No es video'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipo de Canal:</span>
                <span className="text-blue-300">{urlAnalysis.channelType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID de Canal / Dueño:</span>
                <span className="text-blue-300">{urlAnalysis.channelId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Álbum de Serie (c#):</span>
                <span className="text-emerald-300">
                  {urlAnalysis.seriesAlbumId || 'No (Perfil completo)'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-slate-500 mr-1">Probar URLs:</span>
              {[
                'https://ok.ru/video/7841529631488',
                'https://ok.ru/group/547896321458/video/c12845',
                'https://ok.ru/profile/584126932456/video'
              ].map((u) => (
                <button
                  key={u}
                  onClick={() => setTestUrl(u)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono truncate max-w-[200px] transition"
                >
                  {u.replace('https://ok.ru/', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
