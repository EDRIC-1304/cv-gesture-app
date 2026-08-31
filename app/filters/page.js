"use client";

import { useState } from "react";
import CameraView from "../../components/CameraView";
import FiltersTutorial from "../../components/tutorials/FiltersTutorial";

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

            <div className="pointer-events-none absolute inset-0 border border-white/10 sm:rounded-3xl" />

          </div>
        </section>

        {/* Filters tutorial */}
        {showTutorial && (
          <FiltersTutorial
          onComplete={() => setShowTutorial(false)}
          onExit={() => {
          window.location.href = "/";
         }}
        />
        )}

      </div>
    </main>
  );
}