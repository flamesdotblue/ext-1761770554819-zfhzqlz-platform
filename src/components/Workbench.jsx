import React, { useEffect, useRef, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, Mic, Plus, Upload, Wand2, X } from 'lucide-react';

export default function Workbench({ script, setScript, assets, addAsset, removeAsset, voiceovers, addVoiceover, removeVoiceover, scenes, updateScene }) {
  const [aiWorking, setAiWorking] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiTipOpen, setAiTipOpen] = useState(false);
  const fileInputImg = useRef(null);
  const fileInputVid = useRef(null);
  const fileInputAud = useRef(null);
  const fileInputLogo = useRef(null);

  useEffect(() => {
    if (!aiWorking) return;
    setAiProgress(0);
    const iv = setInterval(() => {
      setAiProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          setAiWorking(false);
          return 100;
        }
        return p + 5;
      });
    }, 120);
    return () => clearInterval(iv);
  }, [aiWorking]);

  const triggerAI = () => {
    setAiWorking(true);
    setTimeout(() => {
      setScript(prev => (prev && prev.length > 10 ? prev : 'Intro: Welcome to our product...\n\nScene 1: Problem statement...\n\nScene 2: Solution overview...\n\nOutro: Call-to-action.'));
    }, 1200);
  };

  const onUpload = (type, files) => {
    if (!files || !files.length) return;
    const list = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type, file: f, id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }));
    list.forEach(item => addAsset(type, item));
  };

  const onUploadVoice = (files) => {
    if (!files || !files.length) return;
    const list = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type, file: f, id: `vo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }));
    list.forEach(addVoiceover);
  };

  const recordRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fileObj = { id: `vo-${Date.now()}`, name: `Recording-${new Date().toLocaleTimeString()}.webm`, size: blob.size, type: 'audio/webm', file: blob };
        addVoiceover(fileObj);
      };
      setMediaRecorder(mr);
      mr.start();
      setRecording(true);
    } catch (e) {
      alert('Microphone permission denied or unsupported.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <Tabs.Root defaultValue="script" orientation="horizontal">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 sm:px-6 py-3">
          <Tabs.List aria-label="Workbench sections" className="flex items-center gap-2 overflow-x-auto">
            <Tabs.Trigger value="script" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              Script
            </Tabs.Trigger>
            <Tabs.Trigger value="media" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              Media
            </Tabs.Trigger>
            <Tabs.Trigger value="voice" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              Voiceover
            </Tabs.Trigger>
            <Tabs.Trigger value="transitions" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              Transitions
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="script" className="p-4 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-b-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="script-input" className="text-sm font-medium text-slate-700">Script editor</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerAI}
                  aria-label="Generate script with AI"
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  onMouseEnter={() => setAiTipOpen(true)}
                  onMouseLeave={() => setAiTipOpen(false)}
                >
                  {aiWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} AI Assist
                </button>
                <span role="tooltip" aria-hidden={!aiTipOpen} className={`hidden sm:block text-xs text-slate-600 ${aiTipOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`}>Uses your outline to suggest a script</span>
              </div>
            </div>
            <textarea
              id="script-input"
              className="min-h-[220px] w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Write or paste your script here..."
              value={script}
              onChange={e => setScript(e.target.value)}
            />
            {aiWorking && (
              <div aria-live="polite" className="text-sm text-slate-600">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 transition-all" style={{ width: `${aiProgress}%` }} />
                </div>
                <p className="mt-1">Generating suggestions... {aiProgress}%</p>
              </div>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="media" className="p-4 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MediaUploader
              label="Images"
              accept="image/*"
              onFiles={files => onUpload('images', files)}
              items={assets.images}
              onRemove={i => removeAsset('images', i)}
              inputRef={fileInputImg}
            />
            <MediaUploader
              label="Video Clips"
              accept="video/*"
              onFiles={files => onUpload('videos', files)}
              items={assets.videos}
              onRemove={i => removeAsset('videos', i)}
              inputRef={fileInputVid}
            />
            <MediaUploader
              label="Audio"
              accept="audio/*"
              onFiles={files => onUpload('audio', files)}
              items={assets.audio}
              onRemove={i => removeAsset('audio', i)}
              inputRef={fileInputAud}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="voice" className="p-4 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-b-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700">Voiceover recordings</h3>
                <div className="flex items-center gap-2">
                  {!recording ? (
                    <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                      <Mic className="h-4 w-4" /> Record
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white px-3 py-2 text-sm shadow hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                      <X className="h-4 w-4" /> Stop
                    </button>
                  )}
                  <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-2 text-sm hover:bg-slate-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400 cursor-pointer">
                    <Upload className="h-4 w-4" /> Upload
                    <input aria-label="Upload voiceover" type="file" accept="audio/*" className="sr-only" onChange={e => onUploadVoice(e.target.files)} />
                  </label>
                </div>
              </div>
              <ul role="list" className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {voiceovers.length === 0 && (
                  <li className="p-4 text-sm text-slate-500">No voiceovers yet.</li>
                )}
                {voiceovers.map((vo, i) => (
                  <li key={vo.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{vo.name}</p>
                      <p className="truncate text-xs text-slate-500">{Math.round((vo.size || 0)/1024)} KB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <audio controls src={vo.file instanceof Blob ? URL.createObjectURL(vo.file) : undefined} className="h-8" />
                      <button onClick={() => removeVoiceover(i)} className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded px-2 py-1 text-sm">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="text-sm font-semibold text-slate-800">Scene voiceover assignment</h4>
                <p className="mt-1 text-xs text-slate-600">Assign voiceovers to scenes. Each scene can have one voice track.</p>
                <div className="mt-3 space-y-3 max-h-[320px] overflow-auto pr-1">
                  {scenes.map((s) => (
                    <SceneVoiceRow key={s.id} scene={s} voiceovers={voiceovers} onAssign={(voId) => updateScene(s.id, { voiceoverId: voId })} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="transitions" className="p-4 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenes.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">{s.title}</h4>
                  <span className="text-xs text-slate-500">{s.duration}s</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-slate-700" htmlFor={`tr-${s.id}`}>Transition</label>
                  <select
                    id={`tr-${s.id}`}
                    value={s.transition || 'cut'}
                    onChange={e => updateScene(s.id, { transition: e.target.value })}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="cut">Cut</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function MediaUploader({ label, accept, onFiles, items, onRemove, inputRef }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4" role="region" aria-label={`${label} uploader`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-800">{label}</h3>
        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400 cursor-pointer">
          <Upload className="h-4 w-4" /> Upload
          <input ref={inputRef} aria-label={`Upload ${label}`} type="file" accept={accept} multiple className="sr-only" onChange={e => onFiles(e.target.files)} />
        </label>
      </div>
      <div
        className="mt-3 flex h-28 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm"
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        onKeyDown={(e) => { if (e.key === 'Enter' && inputRef?.current) inputRef.current.click(); }}
        aria-label={`Drag and drop ${label.toLowerCase()} or press Enter to upload`}
      >
        Drag & drop or click Upload
      </div>
      <ul role="list" className="mt-3 space-y-2 max-h-40 overflow-auto pr-1">
        {items.map((f, i) => (
          <li key={f.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-2">
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-800">{f.name}</p>
              <p className="truncate text-xs text-slate-500">{Math.round((f.size || 0)/1024)} KB</p>
            </div>
            <button onClick={() => onRemove(i)} className="text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded px-2 py-1 text-sm">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SceneVoiceRow({ scene, voiceovers, onAssign }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-800">{scene.title}</p>
        <p className="truncate text-xs text-slate-500">{scene.duration}s</p>
      </div>
      <select
        aria-label={`Assign voiceover to ${scene.title}`}
        value={scene.voiceoverId || ''}
        onChange={e => onAssign(e.target.value || undefined)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        <option value="">None</option>
        {voiceovers.map(vo => (
          <option key={vo.id} value={vo.id}>{vo.name}</option>
        ))}
      </select>
    </div>
  );
}
