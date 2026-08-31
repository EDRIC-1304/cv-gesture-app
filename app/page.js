export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center">
        
        <div className="mb-12">
          {/* <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
            Computer Vision
          </p> */}

          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Choose an Experience.
          </h1>

          {/* <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Explore real-time camera experiences controlled through hand
            gestures.
          </p> */}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          
          <a
            href="/filters"
            className="group rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
          >
            <h2 className="text-2xl font-medium">Filters</h2>
            <p className="mt-3 text-gray-600">
              Select an area of the camera and transform it with visual
              filters.
            </p>
            <span className="mt-8 block text-sm font-medium">
              Explore →
            </span>
          </a>

          <a
            href="/puzzle"
            className="group rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
          >
            <h2 className="text-2xl font-medium">Puzzle</h2>
            <p className="mt-3 text-gray-600">
              Turn a camera image into a puzzle and solve it using gestures.
            </p>
            <span className="mt-8 block text-sm font-medium">
              Explore →
            </span>
          </a>

          <a
            href="/invisible"
            className="group rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
          >
            <h2 className="text-2xl font-medium">Invisible</h2>
            <p className="mt-3 text-gray-600">
              Use gestures to create an effect that makes you disappear
              from the camera.
            </p>
            <span className="mt-8 block text-sm font-medium">
              Explore →
            </span>
          </a>

        </div>

        <a
          href="/about"
          className="mt-10 text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
        >
          About this project
        </a>

      </div>
    </main>
  );
}