"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy `/app/modifyimage` route. The previous JS page was incomplete; send users to HuggingFace flows.
 */
export default function ModifyImageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/hugface");
  }, [router]);

  return null;
}
