export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">⚖️</div>
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Verdicta
      </h1>
      <p className="mt-3 text-xl text-gray-400 sm:text-2xl">Who&apos;s Right?</p>
      <p className="mt-6 max-w-md text-gray-500">
        Settle your debates with AI. Share your side of the story and let
        Verdicta decide.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-gray-200"
        >
          Download on App Store
        </a>
        <a
          href="https://play.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Get it on Google Play
        </a>
      </div>
    </main>
  );
}
