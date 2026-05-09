"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { type InferSelectModel } from "drizzle-orm";

import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import MobileBottomNav from "./_components/MobileBottomNav";
import MobileNavToggle from "./_components/MobileNavToggle";
import { MobileNavContext } from "@/app/_context/MobileNavContext";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { UserDetailContext, type UserDetails } from "@/app/_context/UserDetailContext";
import { VideoData } from "@/configs/schema";
import { fetchMyUserDetail } from "@/app/app/_actions/dashboard-data";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [videoData, setVideoData] = useState<InferSelectModel<typeof VideoData>[]>([]);
  const [userDetail, setUserDetail] = useState<UserDetails | null>(null);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      void getUserDetail();
    }
  }, [user]);

  useEffect(() => {
    if (pathname === "/app/chat") {
      setShowBottomNav(false);
    } else if (pathname === "/app") {
      setShowBottomNav(true);
    }
  }, [pathname]);

  const getUserDetail = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    const row = await fetchMyUserDetail();
    setUserDetail(row ?? null);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <MobileNavContext.Provider value={{ showBottomNav, setShowBottomNav }}>
          <div className="flex h-full w-full bg-neutral-50 dark:bg-zinc-950">
            <div className="hidden md:block h-full w-68 sticky top-0 left-0">
              <SideNav />
            </div>

            <div
              className={`w-full ${pathname === "/app" ? "pb-16 md:pb-0" : showBottomNav ? "pb-16 md:pb-0" : "pb-0"}`}
            >
              <Header />
              <div className="">{children}</div>
            </div>
          </div>
          {showBottomNav && <MobileBottomNav />}
          {pathname !== "/app" && <MobileNavToggle />}
        </MobileNavContext.Provider>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout;
