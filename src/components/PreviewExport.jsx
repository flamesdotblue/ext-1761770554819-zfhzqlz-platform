import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, Settings, X } from 'lucide-react';

export default function PreviewExport({ data, branding, setBranding, exportOptions, setExportOptions }) {
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doExport = () => {
    setIsExporting(true);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          setIsExporting(false);
          setConfirmOpen(false);
          return 100;
        }
        return p + 3;
      });
    }, 100);
  };

  const previewText = useMemo(() => {
    const titles = data.scenes.map(s => s.title).join(' • ');
    return `${data.script?.slice(0, 120) || 'Your script will appear here...'}${data.script && data.script.length > 120 ? '…' : ''} | Scenes: ${titles}`;
  }, [data]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Preview & Export</h2>
        <div className="flex items-center gap-2">
          <DetailsPill label={`${data.scenes.length} scenes`} />
          <DetailsPill label={`${data.assets.images.length + data.assets.videos.length} media`} />
          <DetailsPill label={`${data.voiceovers.length} voiceovers`} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-200" />
                <p className="text-sm text-slate-700">Live Preview</p>
                <p className="mt-1 text-xs text-slate-500">{previewText}</p>
              </div>
            </div>
          </div>
          {isExporting && (
            <div className="mt-3" aria-live="polite">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-sm text-slate-600">Exporting... {progress}%</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Settings className="h-4 w-4" /> Export Settings</h3>
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-600" htmlFor="res">Resolution</label>
                  <select
                    id="res"
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={exportOptions.resolution}
                    onChange={e => setExportOptions({ ...exportOptions, resolution: e.target.value })}
                  >
                    <option value="3840x2160">4K (3840x2160)</option>
                    <option value="2560x1440">1440p (2560x1440)</option>
                    <option value="1920x1080">1080p (1920x1080)</option>
                    <option value="1280x720">720p (1280x720)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-600" htmlFor="fmt">Format</label>
                  <select
                    id="fmt"
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={exportOptions.format}
                    onChange={e => setExportOptions({ ...exportOptions, format: e.target.value })}
                  >
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-600" htmlFor="fps">FPS</label>
                  <select
                    id="fps"
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={exportOptions.fps}
                    onChange={e => setExportOptions({ ...exportOptions, fps: Number(e.target.value) })}
                  >
                    <option value={24}>24</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <input id="wm" type="checkbox" checked={exportOptions.includeWatermark} onChange={e => setExportOptions({ ...exportOptions, includeWatermark: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                  <label htmlFor="wm" className="text-xs text-slate-600">Include watermark</label>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
                <label className="text-xs font-medium text-slate-700">Branding</label>
                <div className="flex items-center gap-2">
                  <input id="bwm" type="checkbox" checked={branding.watermarkEnabled} onChange={e => setBranding({ ...branding, watermarkEnabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                  <label htmlFor="bwm" className="text-xs text-slate-600">Enable watermark</label>
                </div>
                <input
                  type="text"
                  value={branding.watermarkText}
                  onChange={e => setBranding({ ...branding, watermarkText: e.target.value })}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Watermark text"
                  aria-label="Watermark text"
                />
                <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400 cursor-pointer w-fit">
                  Upload logo
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setBranding({ ...branding, logo: f });
                  }} />
                </label>
                {branding.logo && (
                  <p className="text-xs text-slate-600">{branding.logo.name}</p>
                )}
              </div>

              <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <Dialog.Trigger asChild>
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4" /> Export
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/20" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-base font-semibold text-slate-900">Confirm export</Dialog.Title>
                      <Dialog.Close className="rounded p-1 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                        <X className="h-4 w-4" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="mt-1 text-sm text-slate-600">
                      Export as {exportOptions.format.toUpperCase()} in {exportOptions.resolution} at {exportOptions.fps} FPS{exportOptions.includeWatermark ? ' with watermark' : ''}.
                    </Dialog.Description>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Dialog.Close className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Cancel</Dialog.Close>
                      <button onClick={doExport} className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Confirm</button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsPill({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">{label}</span>
  );
}
