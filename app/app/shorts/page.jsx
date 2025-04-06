"use client"
import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { db } from 'configs/db';
import { VideoData } from 'configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import VideosDashboard from 'app/app/_components/VideosDashboard';
import EmptyState from 'app/app/_components/EmptyState';
import { UserDetailContext } from 'app/_context/UserDetailContext';

function Dashboard() {
  const {user} = useUser();
  const [videos, setVideos] = useState([]);
  const {userDetail, setUserDetail} = useContext(UserDetailContext);

  useEffect(() => {
    console.log(user)
    user && getVideosList();
  }, [user]);

  const getVideosList =  async () => {
    const res = await db.select().from(VideoData).where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress));
    setVideos(res);  
  }

  return (
    <div className='px-10 py-10'>
      <div className="justify-between items-center flex">
        <h2 className='font-bold text-2xl text-primary'>Generated Shorts</h2>
        <Link href="/app/shorts/create" className='cursor-pointer dark:text-white'>
          <Button className={`cursor-pointer dark:text-white`}>+ Create New</Button>
        </Link>
      </div>

      {videos.length == 0 && <EmptyState />}
      {videos.length > 0 && <VideosDashboard videoList={videos} />}
    </div>
  )
}

export default Dashboard