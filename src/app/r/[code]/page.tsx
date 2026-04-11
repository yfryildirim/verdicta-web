"use client";

import { useState, useEffect } from "react";

const translations = {
  tr: {
    title: "Arkadaşın seni Verdicta'ya davet etti!",
    subtitle:
      "AI tartışmaları mizahla çözüyor. Uygulamayı indir, kayıt ol — ikiniz de ücretsiz dava hakkı kazan!",
    codeLabel: "Davet Kodu",
    codeHint: "İndir butonuna basınca kod otomatik kopyalanacak",
    downloadBtn: "📥 Kodu Kopyala & İndir",
    downloadBtnDone: "✅ Kod Kopyalandı! Yönlendiriliyor...",
    openBtn: "Uygulama zaten yüklü? Aç",
    copiedMsg: "✅ Davet kodu",
    copiedMsg2: "kopyalandı! Kayıt olurken otomatik uygulanacak.",
  },
  en: {
    title: "Your friend invited you to Verdicta!",
    subtitle:
      "AI settles arguments with humor. Download the app, sign up, and both of you earn free cases!",
    codeLabel: "Referral Code",
    codeHint: "The code will be copied automatically when you tap the download button",
    downloadBtn: "📥 Copy Code & Download App",
    downloadBtnDone: "✅ Code Copied! Redirecting...",
    openBtn: "Already have the app? Open",
    copiedMsg: "✅ Referral code",
    copiedMsg2: "copied! It will be applied automatically when you sign up.",
  },
};

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
  const [lang, setLang] = useState<"tr" | "en">("en");

  const intentUri = `intent://r/${code}#Intent;scheme=verdicta;package=com.yfryildirim.whoisright;end`;
  const customScheme = `verdicta://r/${code}`;

  const t = translations[lang];

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroidDevice = /android/i.test(ua);
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua);
    setIsAndroid(isAndroidDevice);
    setIsIOS(isIOSDevice);

    const browserLang = navigator.language || "";
    setLang(browserLang.startsWith("tr") ? "tr" : "en");

    if (isAndroidDevice) {
      window.location.href = intentUri;
    } else {
      window.location.href = customScheme;
    }
  }, [intentUri, customScheme]);

  const handleCopyAndDownload = async () => {
    try {
      await navigator.clipboard.writeText(`VERDICTA_REF:${upperCode}`);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = `VERDICTA_REF:${upperCode}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
    }

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
      <div className="mb-4 text-5xl">{"⚖️"}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
        {t.title}
      </h1>
      <p className="mt-4 max-w-md text-gray-400">{t.subtitle}</p>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 max-w-sm w-full">
        <p className="text-sm text-gray-500">{t.codeLabel}</p>
        <p className="mt-1 text-2xl font-bold tracking-widest text-cyan-400">
          {upperCode}
        </p>
        <p className="mt-3 text-xs text-gray-600">{t.codeHint}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={handleCopyAndDownload}
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400 w-full"
        >
          {copied ? t.downloadBtnDone : t.downloadBtn}
        </button>

        <a
          href={isAndroid ? intentUri : customScheme}
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800 block text-center"
        >
          {t.openBtn}
        </a>
      </div>

      {copied && (
        <p className="mt-4 text-sm text-green-400">
          {t.copiedMsg} <span className="font-bold">{upperCode}</span>{" "}
          {t.copiedMsg2}
        </p>
      )}
    </main>
  );
}
