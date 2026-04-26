import { clsx } from "clsx";
import { db } from "configs/db";
import { Users, VideoData } from "configs/schema";
import { eq } from "drizzle-orm";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

type IskoristPoeniArgs = {
  momentalnoKrediti: number;
  kolkuMinus: number;
  email: string;
};

export const iskoristPoeni = async ({
  momentalnoKrediti,
  kolkuMinus,
  email
}: IskoristPoeniArgs): Promise<number> => {
  await db.update(Users)
    .set({ credits: momentalnoKrediti - kolkuMinus })
    .where(eq(Users.email, email));
  return momentalnoKrediti - kolkuMinus;
};

type NamestiDownloadUrlArgs = {
  id: number;
  downloadUrl: string;
};

export const namestiDownloadUrl = async ({
  id,
  downloadUrl
}: NamestiDownloadUrlArgs): Promise<unknown> => {
  const res = await db.update(VideoData as any)
    .set({ downloadUrl })
    .where(eq(VideoData.id, id));
  return res;
};

export const proveriPoeni = (poeni : number, potrebni : number) : boolean => {
  return poeni >= potrebni;
}