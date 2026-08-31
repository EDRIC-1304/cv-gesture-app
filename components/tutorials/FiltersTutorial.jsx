"use client";

import { useState } from "react";

export default function FiltersTutorial({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Point",
      description:
        "Raise your index finger and point toward the area or option you want to target.",
      gesture: "☝️",
    },
    {
      title: "Pinch",
      description:
        "Bring your index finger and thumb together. Pinching is used to select and grab objects.",
      gesture: "🤏",
    },
    {
      title: "Rectangle selection",
      description:
        "Place your two index fingers together. Move them apart to create a rectangle. Bring them back together to finish.",
      gesture: "☝️  ☝️",
    },
    {
      title: "Freehand selection",
      description:
        "Point with your index finger and draw around the area you want. Your shape must form a closed area before it can be accepted.",
      gesture: "☝️",
    },
    {
      title: "Move a selection",
      description:
        "Point at an existing selection, pinch it, move your hand to reposition it, then release the pinch.",
      gesture: "☝️  +  🤏",
    },
    {
      title: "Filter options",
      description:
        "Show your open palm to display the available filters. Pinch while pointing at a filter to select it.",
      gesture: "✋  +  🤏",
    },
    {
      title: "Change filters",
      description:
        "After creating an area, swipe your open palm from left to right to move through the available filters.",
      gesture: "✋  →",
    },
    {
      title: "Cancel",
      description:
        "Make a closed fist whenever you want to cancel what you're doing and return the mode to its starting state.",
      gesture: "✊",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  function handleNext() {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStep((current) => current + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Filters tutorial</span>
            <span>
              {step + 1} / {steps.length}
            </span>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Tutorial card */}
        <div className="rounded-3xl border border-white/10 bg-[#181818] p-7 shadow-2xl sm:p-9">

          <div className="flex min-h-24 items-center justify-center text-6xl">
            {currentStep.gesture}
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Gesture {step + 1}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {currentStep.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55">
              {currentStep.description}
            </p>
          </div>

          {/* Detection status */}
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
            <p className="text-xs text-white/40">
              Waiting for gesture detection...
            </p>
          </div>

          <button
            onClick={handleNext}
            className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            {isLastStep ? "Start Filters" : "Continue"}
          </button>

          <button
            onClick={onComplete}
            className="mt-3 w-full py-2 text-sm text-white/35 transition hover:text-white"
          >
            ⓘ Skip tutorial
          </button>
        </div>

      </div>
    </div>
  );
}