import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function HeroSpline() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden bg-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900">Generate script-driven videos with an intuitive AI studio</h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">Write scripts with AI assistance, arrange scenes with drag-and-drop storyboards, record voiceovers, and export professional videos in minutes.</p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#app"
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-4 py-2 text-sm sm:text-base shadow hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Get Started
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-md border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm sm:text-base hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
