import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { Metadata } from "next";
import { CopyableCode } from "@/components/CopyableCode";
import { DeepLinkRedirect } from "@/components/DeepLinkRedirect";

interface InvitePageProps {
  params: { token: string };
}

interface InviteInfo {
  valid: boolean;
  reason?: string;
  case_topic?: string;
  opponent_name?: string;
  inviter_name?: string;
  expires_at?: string;
}

async function getInviteInfo(token: string): Promise<InviteInfo> {
  try {
    const { data, error } = await supabase.rpc("get_invite_info", {
      p_token: token,
    });
    if (error) return { valid: false, reason: "error" };
    return data as InviteInfo;
  } catch {
    return { valid: false, reason: "error" };
  }
}

export async function generateMetadata({
  params,
}: InvitePageProps): Promise<Metadata> {
  const info = await getInviteInfo(params.token);
  if (info.valid) {
    return {
      title: `Verdicta - ${info.inviter_name || "Someone"} invited you`,
      description: `Join the case: ${info.case_topic || "A debate on Verdicta"}`,
    };
  }
  return {
    title: "Verdicta - Invalid Invite",
    description: "This invitation is no longer valid.",
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = params;
  const info = await getInviteInfo(token);

  if (!info.valid) {
    return <InvalidInvite reason={info.reason} />;
  }

  // Android intent URI — works reliably in WhatsApp/Telegram in-app browsers
  const intentUri = `intent://invite/${token}#Intent;scheme=verdicta;package=com.yfryildirim.whoisright;end`;
  const customScheme = `verdicta://invite/${token}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Auto-redirect: tries to open the app immediately */}
      <DeepLinkRedirect token={token} />

      <div className="mb-4 text-5xl">{"\uD83D\uDCE9"}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        You&apos;ve been invited to a case
      </h1>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 max-w-sm w-full">
        <p className="text-sm text-gray-500">Case topic</p>
        <p className="mt-1 text-lg font-semibold text-cyan-400">
          {info.case_topic}
        </p>
        <div className="mt-4 border-t border-gray-800 pt-4">
          <p className="text-sm text-gray-500">Invited by</p>
          <p className="mt-1 text-white">{info.inviter_name || "Someone"}</p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        Invite code: <CopyableCode code={token} />
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {/* Android: intent URI, iOS: custom scheme */}
        <a
          href={intentUri}
          className="hidden-android rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
          id="open-app-android"
          style={{ display: "none" }}
        >
          Open in App
        </a>
        <a
          href={customScheme}
          className="hidden-ios rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
          id="open-app-ios"
          style={{ display: "none" }}
        >
          Open in App
        </a>
        {/* Fallback visible button that uses JS to pick the right URI */}
        <a
          href={customScheme}
          data-intent={intentUri}
          className="open-app-btn rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
          onClick={undefined}
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

      {/* Client-side script to swap href based on platform */}
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

function InvalidInvite({ reason }: { reason?: string }) {
  const config: Record<string, { icon: string; title: string; desc: string }> = {
    not_found: {
      icon: "\u274C",
      title: "Invalid Invitation",
      desc: "This invite link does not exist or has been removed.",
    },
    expired: {
      icon: "\u23F0",
      title: "Invitation Expired",
      desc: "This invite has expired. Ask the sender for a new one.",
    },
    already_used: {
      icon: "\u2705",
      title: "Already Accepted",
      desc: "This invitation has already been used.",
    },
    cancelled: {
      icon: "\u{1F6AB}",
      title: "Invitation Cancelled",
      desc: "This invitation has been cancelled by the sender.",
    },
    case_resolved: {
      icon: "\u2696\uFE0F",
      title: "Case Already Resolved",
      desc: "This case has already been decided. The verdict is in.",
    },
    already_joined: {
      icon: "\u{1F465}",
      title: "Opponent Already Joined",
      desc: "Someone has already joined this case as the opponent.",
    },
    error: {
      icon: "\u26A0\uFE0F",
      title: "Something Went Wrong",
      desc: "We could not verify this invitation. Please try again later.",
    },
  };

  const msg = config[reason || "error"] || config.error;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">{msg.icon}</div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {msg.title}
      </h1>
      <p className="mt-4 max-w-md text-gray-500">{msg.desc}</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
        >
          Go to Verdicta
        </Link>
        <Link
          href="/download"
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-950 transition hover:bg-cyan-400"
        >
          Download App
        </Link>
      </div>
    </main>
  );
}
