"use client";
import React, { useEffect } from 'react'
import { db } from "@/configs/db"
import { useUser } from "@clerk/nextjs";
import { Users } from "@/configs/schema"
import { eq } from 'drizzle-orm';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user && proveriNovUser();
  }, [user]);

  const proveriNovUser = async () => {
    const res = await db.select().from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    if (!!res[0] == false) {
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