import React, { useMemo, useRef, useState } from 'react';
import { GripVertical, Image as ImageIcon, Plus, Trash2, Video } from 'lucide-react';

export default function Storyboard({ scenes, addScene, removeScene, moveScene, updateScene, onAttachAsset, onDetachAsset, assets }) {
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, overIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === overIndex) return;
  };
  const handleDrop = (overIndex) => {
    if (dragIndex === null || dragIndex === overIndex) return;
    moveScene(dragIndex, overIndex);
    setDragIndex(null);
  };

  const paletteAssets = useMemo(() => ([
    ...assets.images.map(a => ({ ...a, kind: 'image' })),
    ...assets.videos.map(a => ({ ...a, kind: 'video' })),
    ...assets.audio.map(a => ({ ...a, kind: 'audio' })),
  ]), [assets]);

  const onAssetDragStart = (e, asset) => {
    e.dataTransfer.setData('application/x-asset', JSON.stringify(asset));
  };

  const onSceneDropAsset = (e, sceneId) => {
    const dt = e.dataTransfer.getData('application/x-asset');
    if (!dt) return;
    try {
      const asset = JSON.parse(dt);
      onAttachAsset(sceneId, asset);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Storyboard</h2>
        <button
          onClick={addScene}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Plus className="h-4 w-4" /> Add Scene
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {scenes.map((s, idx) => (
          <div
            key={s.id}
            className="rounded-lg border border-slate-200 bg-white"
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            role="group"
            aria-roledescription="Draggable scene"
            aria-label={s.title}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  value={s.title}
                  onChange={e => updateScene(s.id, { title: e.target.value })}
                  className="min-w-0 flex-1 rounded border border-transparent px-2 py-1 text-sm text-slate-800 focus:border-slate-300 focus:outline-none"
                  aria-label={`Scene title for ${s.title}`}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-600" htmlFor={`dur-${s.id}`}>Duration</label>
                <input id={`dur-${s.id}`} type="number" min={1} max={120} value={s.duration} onChange={e => updateScene(s.id, { duration: Number(e.target.value) })} className="w-20 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
                <button onClick={() => removeScene(s.id)} className="rounded px-2 py-1 text-sm text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Remove scene</span>
                </button>
              </div>
            </div>
            <div
              className="p-3 grid grid-cols-1 md:grid-cols-4 gap-3"
              onDragOver={e => { e.preventDefault(); }}
              onDrop={e => onSceneDropAsset(e, s.id)}
              aria-label={`Assets for ${s.title}`}
            >
              <div className="md:col-span-3">
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[84px] rounded border border-slate-200 p-2" role="list">
                  {s.assets.length === 0 && (
                    <li className="col-span-full text-xs text-slate-500">Drag media assets here to attach to this scene.</li>
                  )}
                  {s.assets.map((a, i) => (
                    <li key={`${s.id}-${i}`} className="relative rounded border border-slate-200 bg-slate-50 p-2">
                      <div className="flex items-center gap-2">
                        {a.kind === 'video' ? (
                          <Video className="h-4 w-4 text-slate-600" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-slate-600" />
                        )}
                        <span className="truncate text-xs text-slate-700" title={a.name}>{a.name}</span>
                      </div>
                      <button
                        onClick={() => onDetachAssetFromSceneWrapper(onDetachAsset, s.id, i)}
                        className="absolute top-1 right-1 rounded bg-white/80 px-1 text-[10px] text-slate-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-1">
                <p className="text-xs font-medium text-slate-700">Palette</p>
                <ul className="mt-1 max-h-28 overflow-auto pr-1 space-y-1" aria-label="Available assets">
                  {paletteAssets.length === 0 && (
                    <li className="text-xs text-slate-500">No uploaded assets</li>
                  )}
                  {paletteAssets.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-2 rounded border border-slate-200 bg-white p-1.5 text-xs text-slate-700 cursor-grab"
                      draggable
                      onDragStart={(e) => onAssetDragStart(e, a)}
                    >
                      {a.kind === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      <span className="truncate" title={a.name}>{a.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function onDetachAssetFromSceneWrapper(fn, sceneId, index) {
  fn(sceneId, index);
}
