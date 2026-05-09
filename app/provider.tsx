"use client";
import React, { useEffect } from 'react'
import { useUser } from "@clerk/nextjs";
import { ElementProps } from '@/types/elements';
import { ensureClerkUserRegistered } from "@/app/app/_actions/dashboard-data";

function Provider({ children } : ElementProps) : React.JSX.Element | null {
  const { user } = useUser();

  useEffect(() => {
    user && void proveriNovUser();
  }, [user]);

  const proveriNovUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    await ensureClerkUserRegistered();
  }

  return (
    <div>{children}</div>
  )
}

export default Provider