"use client";

import { useState } from "react";

export function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs text-cyan-400 transition hover:bg-gray-700 active:scale-95 cursor-pointer"
      title="Tap to copy"
    >
      <span className="font-mono tracking-wider">{code}</span>
      <span className="text-gray-500">{copied ? "\u2705" : "\uD83D\uDCCB"}</span>
    </button>
  );
}
