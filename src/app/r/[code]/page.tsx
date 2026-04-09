"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ReferralPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const upperCode = code.toUpperCase();
  const [copied, setCopied] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [appOpened, setAppOpened] = useState(false);

  const intentUri = `intent://r/${code}#Intent;scheme=verdicta;package=com.yfryildirim.whoisright;end`;
  const customScheme = `verdicta://r/${code}`;

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsAndroid(/android/i.test(ua));
    setIsIOS(/iphone|ipad|ipod/i.test(ua));

    // Try to open app immediately
    if (/android/i.test(ua)) {
      window.location.href = intentUri;
    } else {
      window.location.href = customScheme;
    }

    // If page is still visible after 2s, app is not installed
    const timer = setTimeout(() => setAppOpened(false), 2000);
    return () => clearTimeout(timer);
  }, [intentUri, customScheme]);

  const handleCopyAndDownload = async () => {
    // 1. Copy referral code to clipboard with prefix for app detection
    try {
      await navigator.clipboard.writeText(`VERDICTA_REF:${upperCode}`);
      setCopied(true);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = `VERDICTA_REF:${upperCode}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
    }

    // 2. Redirect to store after short delay
    setTimeout(() => {
      if (isAndroid) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.yfryildirim.whoisright";
      } else if (isIOS) {
        window.location.href =
          "https://apps.apple.com/app/verdicta/id6760935023";
      } else {
        window.location.href = "/download";
      }
    }, 500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-gray-950">
      <div className="mb-4 text-5xl">{"\u2696\uFE0F"}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
        Your friend invited you to Verdicta
      </h1>
      <p className="mt-4 max-w-md text-gray-400">
        AI settles arguments with humor. Download the app, sign up, and both of
        you earn free cases!
      </p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 max-w-sm w-full">
        <p className="text-sm text-gray-500">Referral Code</p>
        <p className="mt-1 text-2xl font-bold tracking-widest text-cyan-400">
          {upperCode}
        </p>
        <p className="mt-3 text-xs text-gray-600">
          The code will be copied automatically when you tap the download button
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-sm">
        {/* Primary: Copy code + go to store */}
        <button
          onClick={handleCopyAndDownload}
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400 w-full"
        >
          {copied ? "\u2705 Code Copied! Redirecting..." : "\uD83D\uDCE5 Copy Code & Download App"}
        </button>

        {/* Secondary: Open in app (if already installed) */}
        <a
          href={isAndroid ? intentUri : customScheme}
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800 block text-center"
        >
          Already have the app? Open
        </a>
      </div>

      {copied && (
        <p className="mt-4 text-sm text-green-400">
          {"\u2705"} Referral code <span className="font-bold">{upperCode}</span> copied!
          It will be applied automatically when you sign up.
        </p>
      )}
    </main>
  );
}
