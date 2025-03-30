import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/app");
}