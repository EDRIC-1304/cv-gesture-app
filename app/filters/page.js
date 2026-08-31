export default function Filters() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h1 className="text-lg font-medium">Filters</h1>

          <a
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            Exit
          </a>
        </header>

        {/* Camera area */}
        <section className="flex flex-1 items-center justify-center p-5">
          <div className="flex aspect-[3/4] w-full max-w-md items-center justify-center rounded-2xl border border-white/10 bg-gray-900">
            <p className="text-sm text-gray-400">
              Camera will appear here
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}