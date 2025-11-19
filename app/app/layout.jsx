"use client";
import React, { useEffect, useState, createContext, useContext } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import MobileBottomNav from './_components/MobileBottomNav'
import MobileNavToggle from './_components/MobileNavToggle'
import { VideoDataContext } from 'app/_context/VideoDataContext'
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { db } from 'configs/db';
import { Users } from 'configs/schema';
import { eq } from 'drizzle-orm';

// Context for mobile bottom nav visibility
export const MobileNavContext = createContext({
  showBottomNav: true,
  setShowBottomNav: () => {}
});

function DashboaardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
        getUserDetail();
    }
  }, [user]);

  // Hide bottom nav on chat page by default on mobile, keep visible on home
  useEffect(() => {
    if (pathname === '/app/chat') {
      setShowBottomNav(false);
    } else if (pathname === '/app') {
      setShowBottomNav(true); // Always show on home
    }
    // For other pages, maintain current state (user can toggle)
  }, [pathname]);

  const getUserDetail = async () => {
    const res = await db.select().from(Users).where(eq(Users.email, user.primaryEmailAddress.emailAddress))

    setUserDetail(res[0]);
  }
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <MobileNavContext.Provider value={{ showBottomNav, setShowBottomNav }}>
          <div className="flex h-full w-full bg-neutral-50 dark:bg-zinc-950">
            <div className="hidden md:block h-full w-68 sticky top-0 left-0">
              <SideNav />
            </div>

            <div className={`w-full ${pathname === '/app' ? 'pb-16 md:pb-0' : showBottomNav ? 'pb-16 md:pb-0' : 'pb-0'}`}>
              <Header />
              <div className=''>
                {children}
              </div>
            </div>
          </div>
          {showBottomNav && <MobileBottomNav />}
          {/* Show toggle button on all pages except home */}
          {pathname !== '/app' && <MobileNavToggle />}
        </MobileNavContext.Provider>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default DashboaardLayout