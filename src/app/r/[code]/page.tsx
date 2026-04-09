import Link from "next/link";
import type { Metadata } from "next";

interface ReferralPageProps {
  params: { code: string };
}

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  return {
    title: "Verdicta - Join with a friend's invite",
    description:
      "Your friend invited you to Verdicta! AI settles arguments with humor. Download now and get started.",
    openGraph: {
      title: "Verdicta - AI settles your arguments!",
      description:
        "Your friend invited you to Verdicta. Download the app and let AI decide who's right!",
      type: "website",
    },
  };
}

export default function ReferralPage({ params }: ReferralPageProps) {
  const { code } = params;

  // Deep link URIs
  const intentUri = `intent://r/${code}#Intent;scheme=verdicta;package=com.yfryildirim.whoisright;end`;
  const customScheme = `verdicta://r/${code}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">{"\u2696\uFE0F"}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Your friend invited you to Verdicta
      </h1>
      <p className="mt-4 max-w-md text-gray-400">
        AI settles arguments with humor. Download the app, sign up, and both of
        you earn free cases!
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 max-w-sm w-full">
        <p className="text-sm text-gray-500">Referral Code</p>
        <p className="mt-1 text-2xl font-bold tracking-widest text-cyan-400">
          {code.toUpperCase()}
        </p>
        <p className="mt-3 text-xs text-gray-600">
          Enter this code after signing up to activate the referral
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href={customScheme}
          data-intent={intentUri}
          className="open-app-btn rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
        >
          Open in App
        </a>
        <Link
          href="/download"
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Download App
        </Link>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var ua = navigator.userAgent || '';
              var btn = document.querySelector('.open-app-btn');
              if (btn && /android/i.test(ua)) {
                btn.href = btn.getAttribute('data-intent') || btn.href;
              }
            })();
          `,
        }}
      />
    </main>
  );
}
