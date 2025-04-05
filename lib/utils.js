import { clsx } from "clsx";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const iskoristPoeni = async ({ momentalnoKrediti, kolkuMinus, email }) => {
  const res = await db.update(Users).set({
    credits: momentalnoKrediti - kolkuMinus
  }).where(eq(Users.email, email))

  return (momentalnoKrediti - kolkuMinus);
}

export const proveriPoeni = (poeni, potrebni) => {
  return poeni >= potrebni;
}