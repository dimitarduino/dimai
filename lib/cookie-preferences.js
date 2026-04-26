/** @typedef {{ v: number, necessary: true, analytics: boolean, savedAt: number }} CookiePreferences */

export const COOKIE_PREFS_KEY = "dimn-cookie-preferences";
export const COOKIE_PREFS_VERSION = 1;
export const GA_MEASUREMENT_ID = "G-P3GN4RXL6E";

const defaultDeny = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

/**
 * @returns {CookiePreferences | null}
 */
export function getStoredPreferences() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p.v !== COOKIE_PREFS_VERSION || !Object.prototype.hasOwnProperty.call(p, "analytics")) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

/**
 * @param {boolean} analytics
 */
export function applyConsentToGtag(analytics) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    ...defaultDeny,
    analytics_storage: analytics ? "granted" : "denied",
  });
}

/**
 * @param {boolean} analytics
 */
export function savePreferences(analytics) {
  /** @type {CookiePreferences} */
  const payload = {
    v: COOKIE_PREFS_VERSION,
    necessary: true,
    analytics: !!analytics,
    savedAt: Date.now(),
  };
  localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(payload));
  applyConsentToGtag(payload.analytics);
}
