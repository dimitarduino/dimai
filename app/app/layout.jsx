"use client";
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from 'app/_context/VideoDataContext'
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { db } from 'configs/db';
import { Users } from 'configs/schema';
import { eq } from 'drizzle-orm';

function DashboaardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getUserDetails();
  }, [user]);

  const getUserDetails = async () => {
    const res = await db.select().from(Users).where(eq(Users.email, user.primaryEmailAddress.emailAddress))
    console.log('eve novo')

    setUserDetail(res[0]);
  }
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div className="flex h-full w-full bg-neutral-50 dark:bg-zinc-950">
          <div className="hidden md:block h-full w-68 sticky top-0 left-0">
            <SideNav />
          </div>

          <div className='w-full'>
            <Header />
            <div className=''>
              {children}
            </div>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default DashboaardLayout