"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { EmailOtpType } from "@supabase/supabase-js";

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        // Hash fragment'tan token'ları al (implicit flow için)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        
        // Query paramlardan token_hash ve type'ı al (PKCE flow için)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenHash = urlParams.get("token_hash");
        const type = urlParams.get("type") as EmailOtpType | null;
        const errorParam = urlParams.get("error");

        if (accessToken && refreshToken) {
          // ✅ Implicit Flow
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Session set error:", error);
            setStatus("error");
          } else {
            setStatus("success");
          }
        } else if (tokenHash && type) {
          // ✅ PKCE Flow
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type,
          });
          
          if (error) {
            console.error("OTP verify error:", error);
            setStatus("error");
          } else {
            setStatus("success");
          }
        } else if (errorParam) {
          // Supabase'den gelen hata
          const errorDescription = urlParams.get("error_description");
          console.error("Auth error:", errorParam, errorDescription);
            setStatus("error");
        } else {
          // Son çare: mevcut session var mı?
          const { data } = await supabase.auth.getSession();
          setStatus(data.session ? "success" : "error");
        }
      } catch (e) {
        console.error("Unexpected error:", e);
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
