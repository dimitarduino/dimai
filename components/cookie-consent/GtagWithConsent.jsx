"use client";

import { useEffect } from "react";
import {
  COOKIE_PREFS_KEY,
  COOKIE_PREFS_VERSION,
  GA_MEASUREMENT_ID,
} from "@/lib/cookie-preferences";

/**
 * Injects gtag with Consent Mode v2: analytics denied by default, granted if
 * valid preferences in localStorage say so (returning visitors).
 */
export function GtagWithConsent() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__DIMN_GTAG_INIT__) return;
    window.__DIMN_GTAG_INIT__ = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    s.onload = () => {
      gtag("js", new Date());
      let analytics = false;
      try {
        const raw = localStorage.getItem(COOKIE_PREFS_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p.v === COOKIE_PREFS_VERSION && p.analytics) analytics = true;
        }
      } catch {
        /* ignore */
      }
      gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: analytics ? "granted" : "denied",
      });
      gtag("config", GA_MEASUREMENT_ID);
    };
    document.head.appendChild(s);
  }, []);

  return null;
}
