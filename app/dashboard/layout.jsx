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
  const {user} = useUser();

  useEffect(() => {
    user && getUserDetails();
  }, [user]);

  const getUserDetails = async () => {
    const res = await db.select().from(Users).where(eq(Users.email, user.primaryEmailAddress.emailAddress))


    setUserDetail(res[0]);
  }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div className="hidden md:block h-screen bg-white fixed mt-[65px] w-64">
          <SideNav />
        </div>

        <div>
          <Header />
          <div className='ml-64 p-10'>
            {children}
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default DashboaardLayout