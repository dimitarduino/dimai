"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    router.push("/app"); // Redirect programmatically
  }, [user]);

  return <div>Redirecting...</div>;
}