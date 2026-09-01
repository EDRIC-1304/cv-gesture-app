export default function About() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-[#171717]">
      <div className="mx-auto min-h-screen max-w-7xl px-5 sm:px-8">

        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <a
            href="/"
            className="text-sm font-semibold tracking-wide"
          >
            Computer Vision
          </a>

          <a
            href="/"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:border-black/20 hover:bg-black hover:text-white"
          >
            Home
          </a>
        </nav>

        {/* Header */}
        <section className="border-t border-black/10 py-16 sm:py-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
            About
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
            Gesture-controlled computer vision.
          </h1>

          {/* <p className="mt-7 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
            This project is a browser-based computer vision experience that
            lets you interact with the camera using hand gestures.
          </p> */}
        </section>

        {/* Modes */}
        <section className="border-t border-black/10 py-14 sm:py-20">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Experiences
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Three ways to interact.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-3xl border border-black/10 bg-white p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                01
              </p>

              <h3 className="mt-10 text-2xl font-medium">
                Filters
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50">
                Select an area of the camera view using a rectangle or by
                drawing a freehand shape, then apply different visual filters
                to that area.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                02
              </p>

              <h3 className="mt-10 text-2xl font-medium">
                Puzzle
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50">
                Capture an image from the camera, turn it into a puzzle, and
                solve it using hand gestures instead of a mouse.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                03
              </p>

              <h3 className="mt-10 text-2xl font-medium">
                Invisible
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/50">
                Use person segmentation to create an effect that makes the
                person appear invisible in the camera view.
              </p>
            </div>

          </div>
        </section>

        {/* Gestures */}
        <section className="border-t border-black/10 py-14 sm:py-20">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Controls
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Gesture controls.
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="divide-y divide-black/10">

              <div className="flex gap-5 p-6">
                <span className="text-3xl">☝️</span>
                <div>
                  <h3 className="font-medium">Point</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Move the cursor and target objects.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-6">
                <span className="text-3xl">🤏</span>
                <div>
                  <h3 className="font-medium">Pinch</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Select, draw, or grab an existing selection.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-6">
                <span className="text-3xl">☝️☝️</span>
                <div>
                  <h3 className="font-medium">Two index fingers</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Create a rectangular selection.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-6">
                <span className="text-3xl">✋</span>
                <div>
                  <h3 className="font-medium">Open palm</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Show or hide the filter options.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-6">
                <span className="text-3xl">✋</span>
                <div>
                  <h3 className="font-medium">Palm swipe</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Cycle through filters after an area is created.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 p-6">
                <span className="text-3xl">✊</span>
                <div>
                  <h3 className="font-medium">Closed fist</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Reset the current mode.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-6">
            <p className="text-sm leading-6 text-black/55">
              Selections start with a red border and turn green once they are
              correctly completed.
            </p>
          </div> */}
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-black/10 py-6 text-xs text-black/40">
          {/* <span>Gesture-controlled computer vision</span> */}

          <a
            href="/"
            className="transition hover:text-black"
          >
            Back to home
          </a>
        </footer>

      </div>
    </main>
  );
}