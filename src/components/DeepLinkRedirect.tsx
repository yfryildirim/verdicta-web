"use client";

import { useEffect } from "react";

interface DeepLinkRedirectProps {
  token: string;
}

export function DeepLinkRedirect({ token }: DeepLinkRedirectProps) {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);

    // Custom scheme URI
    const customScheme = `verdicta://invite/${token}`;

    // Android intent URI — works in most in-app browsers (WhatsApp, Telegram etc.)
    const intentUri = `intent://invite/${token}#Intent;scheme=verdicta;package=com.yfryildirim.whoisright;end`;

    if (isAndroid) {
      // Try intent URI first (most reliable for Android in-app browsers)
      window.location.href = intentUri;
    } else if (isIOS) {
      // iOS: try universal link first, then custom scheme
      // Small delay to let the page render before redirect attempt
      setTimeout(() => {
        window.location.href = customScheme;
      }, 100);
    }
  }, [token]);

  return null;
}
