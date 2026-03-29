interface InvitePageProps {
  params: { token: string };
}

export default function InvitePage({ params }: InvitePageProps) {
  const { token } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">📩</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        You've been invited to a case on Verdicta
      </h1>
      <p className="mt-4 text-gray-500">Invitation token</p>
      <code className="mt-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-cyan-400">
        {token}
      </code>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href={`verdicta://invite/${token}`}
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
        >
          Open App
        </a>
        <a
          href="/download"
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Download App
        </a>
      </div>
    </main>
  );
}
