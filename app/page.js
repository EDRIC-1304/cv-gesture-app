export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8">

        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="text-sm font-semibold tracking-wide">
            Computer Vision
          </div>

          <a
            href="/about"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:border-black/20 hover:bg-black hover:text-white"
          >
            About
          </a>
        </nav>

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center py-16 sm:py-24">
          <div className="max-w-4xl">
            {/* <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-black/45">
              Computer Vision
            </p> */}

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              Choose an experience.
            </h1>

            {/* <p className="mt-7 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
              Explore real-time camera experiences controlled through hand
              gestures.
            </p> */}
          </div>

          {/* Mode cards */}
          <div className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-3">

            <a
              href="/filters"
              className="group relative min-h-[250px] overflow-hidden rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    01
                  </p>

                  <h2 className="mt-10 text-3xl font-medium tracking-tight">
                    Filters
                  </h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-black/55">
                    Select an area of the camera and transform it with visual
                    filters.
                  </p>
                </div>

                <span className="text-sm text-white/60 transition group-hover:text-black">
                  Explore →
                </span>
              </div>
            </a>

            <a
              href="/puzzle"
              className="group relative min-h-[250px] overflow-hidden rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    02
                  </p>

                  <h2 className="mt-10 text-3xl font-medium tracking-tight">
                    Puzzle
                  </h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-black/50">
                    Turn a camera image into a puzzle and solve it using
                    gestures.
                  </p>
                </div>

                <span className="text-sm text-black/45 transition group-hover:text-black">
                  Explore →
                </span>
              </div>
            </a>

            <a
              href="/invisible"
              className="group relative min-h-[250px] overflow-hidden rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    03
                  </p>

                  <h2 className="mt-10 text-3xl font-medium tracking-tight">
                    Invisible
                  </h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-black/50">
                    Use gestures to create an effect that makes you
                    disappear from the camera.
                  </p>
                </div>

                <span className="text-sm text-black/45 transition group-hover:text-black">
                  Explore →
                </span>
              </div>
            </a>

          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-black/10 py-5 text-xs text-black/40">
          {/* <span>Gesture-controlled computer vision</span> */}

          <a
            href="/about"
            className="transition hover:text-black"
          >
            About this project
          </a>
        </footer>

      </div>
    </main>
  );
}