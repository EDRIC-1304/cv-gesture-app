"use client";

import { useState } from "react";
import CameraView from "../../components/CameraView";

export default function Filters() {
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative flex min-h-screen flex-col">

        {/* Header */}
        <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-sm font-medium tracking-wide">
            Filters
          </h1>

          <a
            href="/"
            className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            Exit
          </a>
        </header>

        {/* Camera */}
        <section className="flex min-h-screen items-center justify-center p-3 sm:p-6">
          <div className="relative h-screen w-full overflow-hidden bg-gray-900 sm:h-[92vh] sm:max-w-5xl sm:rounded-3xl">

            <CameraView />

            {/* Temporary camera overlay */}
            <div className="pointer-events-none absolute inset-0 border border-white/10 sm:rounded-3xl" />

          </div>
        </section>

        {/* Tutorial placeholder */}
        {showTutorial && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#181818] p-7 shadow-2xl">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Filters
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Before you begin
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/55">
                You will learn the gestures needed to select an area and
                apply visual filters.
              </p>

              <button
                onClick={() => setShowTutorial(false)}
                className="mt-8 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
              >
                Start tutorial
              </button>

              <button
                onClick={() => setShowTutorial(false)}
                className="mt-3 w-full py-2 text-sm text-white/40 transition hover:text-white"
              >
                ⓘ Skip tutorial
              </button>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}