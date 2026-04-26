"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getStoredPreferences,
  savePreferences,
} from "@/lib/cookie-preferences";
import { cn } from "@/lib/utils";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const syncFromStorage = useCallback(() => {
    const p = getStoredPreferences();
    if (p) setAnalytics(!!p.analytics);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!getStoredPreferences()) {
      setShowBar(true);
    } else {
      syncFromStorage();
    }
  }, [syncFromStorage]);

  useEffect(() => {
    const onOpen = () => {
      syncFromStorage();
      setManageOpen(true);
    };
    window.addEventListener("dimn:open-cookie-preferences", onOpen);
    return () => window.removeEventListener("dimn:open-cookie-preferences", onOpen);
  }, [syncFromStorage]);

  if (!mounted) return null;

  const acceptAll = () => {
    savePreferences(true);
    setShowBar(false);
    setManageOpen(false);
  };

  const essentialOnly = () => {
    savePreferences(false);
    setShowBar(false);
    setManageOpen(false);
  };

  const saveCustom = () => {
    savePreferences(analytics);
    setShowBar(false);
    setManageOpen(false);
  };

  const openManage = () => {
    syncFromStorage();
    setManageOpen(true);
  };

  return (
    <>
      {showBar && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md md:px-6",
            "supports-[padding:max(0px)]:pb-[max(1rem,env(safe-area-inset-bottom))]"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
        >
          <div className="container mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-1 gap-3">
              <Cookie
                className="text-primary mt-0.5 size-5 shrink-0"
                aria-hidden
              />
              <div>
                <h2
                  id="cookie-banner-title"
                  className="text-foreground text-base font-semibold"
                >
                  Cookies
                </h2>
                <p id="cookie-banner-desc" className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  We use essential cookies to run the site and optional analytics
                  to improve Dimn AI. See our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary font-medium underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={essentialOnly}
                className="w-full sm:w-auto"
              >
                Reject non-essential
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={openManage}
                className="w-full sm:w-auto"
              >
                <Settings2 className="size-4" />
                Manage
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={manageOpen}
        onOpenChange={(open) => {
          setManageOpen(open);
          if (open) syncFromStorage();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which cookies we can use. Essential cookies are always on
              so the app can work.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-4 py-2">
            <li className="flex items-start justify-between gap-3 rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Essential</p>
                <p className="text-muted-foreground text-xs">
                  Security, sign-in, and core features. Always active.
                </p>
              </div>
              <span className="text-muted-foreground text-xs font-medium">
                On
              </span>
            </li>
            <li className="space-y-2 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Label
                    htmlFor="cookie-analytics"
                    className="text-sm font-medium"
                  >
                    Analytics
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Help us understand how the site is used (Google Analytics).
                  </p>
                </div>
                <input
                  id="cookie-analytics"
                  type="checkbox"
                  className="border-input bg-background text-primary focus-visible:ring-ring size-4 shrink-0 cursor-pointer rounded border shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
              </div>
            </li>
          </ul>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={essentialOnly}>
              Reject non-essential
            </Button>
            <Button type="button" onClick={saveCustom}>
              Save choices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
