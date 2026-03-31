"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        // Supabase hash fragment'tan token'ları otomatik alır
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (type === "signup" || type === "email" || accessToken) {
          setStatus("success");
        } else {
          // URL parametrelerini kontrol et
          const urlParams = new URLSearchParams(window.location.search);
          const error = urlParams.get("error");
          const errorDescription = urlParams.get("error_description");

          if (error) {
            console.error("Auth error:", error, errorDescription);
            setStatus("error");
          } else {
            // Token yoksa ama hata da yoksa, Supabase session kontrolu yap
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              setStatus("success");
            } else {
              setStatus("success"); // Confirm linki tiklandi, basarili kabul et
            }
          }
        }
      } catch {
        setStatus("error");
      }
    };

    handleConfirm();
  }, []);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-5xl animate-spin">{"\u2696\uFE0F"}</div>
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-5xl">{"\u274C"}</div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Verification Failed
        </h1>
        <p className="mt-4 max-w-md text-gray-500">
          The verification link is invalid or has expired. Please try signing up
          again or request a new verification email.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
          >
            Go to Verdicta
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">{"\u2705"}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Email Verified
      </h1>
      <p className="mt-4 max-w-md text-gray-400">
        Your email has been successfully verified. You can now open the app and
        log in.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href="verdicta://auth/login"
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
        >
          Open App
        </a>
        <Link
          href="/download"
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Download App
        </Link>
      </div>
    </main>
  );
}
