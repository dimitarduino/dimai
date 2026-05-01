"use client";
import React, { useEffect } from 'react'
import { db } from "@/configs/db"
import { useUser } from "@clerk/nextjs";
import { Users } from "@/configs/schema"
import { eq, type InferSelectModel } from "drizzle-orm";
import { ElementProps } from '@/types/elements';

function Provider({ children } : ElementProps) : React.JSX.Element | null {
  const { user } = useUser();

  useEffect(() => {
    user && proveriNovUser();
  }, [user]);

  const proveriNovUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return null;
    const res: InferSelectModel<typeof Users>[] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    if (!res[0]) {
      let vrednosti = {
        ime: user?.fullName || user?.primaryEmailAddress?.emailAddress,
        email: user?.primaryEmailAddress?.emailAddress,
        slika: user?.imageUrl,
        credits: 20,
      };
      const dodaeno = await db.insert(Users).values(vrednosti)
    } else {

    }
  }

  return (
    <div>{children}</div>
  )
}

export default Provider