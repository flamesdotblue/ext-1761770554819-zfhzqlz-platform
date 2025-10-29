import React, { useMemo, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import Workbench from './components/Workbench';
import Storyboard from './components/Storyboard';
import PreviewExport from './components/PreviewExport';

export default function App() {
  const [script, setScript] = useState('');
  const [assets, setAssets] = useState({ images: [], videos: [], audio: [] });
  const [voiceovers, setVoiceovers] = useState([]);
  const [scenes, setScenes] = useState([
    { id: 'scene-1', title: 'Intro', duration: 5, transition: 'fade', assets: [] },
  ]);

  const [branding, setBranding] = useState({ watermarkEnabled: true, watermarkText: 'My Brand', logo: null });
  const [exportOptions, setExportOptions] = useState({
    resolution: '1920x1080',
    format: 'mp4',
    fps: 30,
    includeWatermark: true,
  });

  const addAsset = (type, fileObj) => {
    setAssets(prev => ({ ...prev, [type]: [...prev[type], fileObj] }));
  };

  const removeAsset = (type, index) => {
    setAssets(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const addVoiceover = (fileObj) => setVoiceovers(v => [...v, fileObj]);
  const removeVoiceover = (index) => setVoiceovers(v => v.filter((_, i) => i !== index));

  const updateScene = (id, patch) => {
    setScenes(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const moveScene = (fromIndex, toIndex) => {
    setScenes(prev => {
      const next = [...prev];
      const [m] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, m);
      return next;
    });
  };

  const addScene = () => {
    const n = scenes.length + 1;
    setScenes(prev => [
      ...prev,
      { id: `scene-${n}`, title: `Scene ${n}`, duration: 5, transition: 'cut', assets: [] },
    ]);
  };

  const removeScene = (id) => setScenes(prev => prev.filter(s => s.id !== id));

  const attachAssetToScene = (sceneId, asset) => {
    setScenes(prev => prev.map(s => (s.id === sceneId ? { ...s, assets: [...s.assets, asset] } : s)));
  };

  const detachAssetFromScene = (sceneId, index) => {
    setScenes(prev => prev.map(s => {
      if (s.id !== sceneId) return s;
      const nextAssets = s.assets.filter((_, i) => i !== index);
      return { ...s, assets: nextAssets };
    }));
  };

  const previewData = useMemo(() => ({ script, scenes, assets, voiceovers, branding, exportOptions }), [script, scenes, assets, voiceovers, branding, exportOptions]);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <a href="#app" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-slate-900 px-3 py-2 rounded shadow">Skip to app</a>
      <header className="relative">
        <HeroSpline />
      </header>

      <main id="app" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-8 order-2 xl:order-1" aria-label="Workbench">
          <Workbench
            script={script}
            setScript={setScript}
            assets={assets}
            addAsset={addAsset}
            removeAsset={removeAsset}
            voiceovers={voiceovers}
            addVoiceover={addVoiceover}
            removeVoiceover={removeVoiceover}
            scenes={scenes}
            updateScene={updateScene}
          />
        </section>

        <aside className="xl:col-span-4 order-1 xl:order-2" aria-label="Storyboard">
          <Storyboard
            scenes={scenes}
            addScene={addScene}
            removeScene={removeScene}
            moveScene={moveScene}
            updateScene={updateScene}
            onAttachAsset={attachAssetToScene}
            onDetachAsset={detachAssetFromScene}
            assets={assets}
          />
        </aside>

        <section className="xl:col-span-12 order-3" aria-label="Preview and Export">
          <PreviewExport
            data={previewData}
            branding={branding}
            setBranding={setBranding}
            exportOptions={exportOptions}
            setExportOptions={setExportOptions}
          />
        </section>
      </main>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 text-sm text-slate-500">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Script Video Studio</p>
          <nav aria-label="Footer navigation" className="flex items-center gap-4">
            <a className="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded px-1" href="#app">App</a>
            <a className="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded px-1" href="#">Docs</a>
            <a className="hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded px-1" href="#">Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
