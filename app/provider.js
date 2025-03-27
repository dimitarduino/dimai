"use client";
import React, { useEffect } from 'react'
import {db} from "@/configs/db" 
import { useUser } from "@clerk/nextjs";
import {Users} from "@/configs/schema" 
import { eq } from 'drizzle-orm';

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    user&&proveriNovUser();
  }, [user]);

  const proveriNovUser = async () => {
    const res = await db.select().from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    console.log(res);

    if (!res[0]) {
      const dodaeno = await db.insert(Users).values({
        ime: user.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        slika: user?.imageUrl
      })

      console.log(dodaeno);
    }


  }
  return (
    <div>{children}</div>
  )
}

export default Provider