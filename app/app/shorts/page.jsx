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
import axios from 'axios';
import { toast } from 'sonner';

function Dashboard() {
  const { user } = useUser();
  const[userLocal, setUserLocal] = useState(user?.primaryEmailAddress?.emailAddress);
  const [videos, setVideos] = useState([]);
  const [progressVideos, setProgressVideos] = useState(localStorage.currentVideoJobId ? JSON.parse(localStorage.currentVideoJobId) : []);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if (user) {
      setUserLocal(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  useEffect(() => {
    if (userLocal) {
      console.log('userLocal updated:', userLocal);
      getVideos();
    }
  }, [userLocal]);

  const getVideos = async () => {
    if (!userLocal) {
      console.log('getVideos: userLocal is not set yet');
      return;
    }
    
    try {
      const res = await db.select().from(VideoData).where(eq(VideoData.createdBy, userLocal));
      setVideos(res);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }

  const deleteFromLocalStorageJobId = (jobid) => {
    let currentJobIdArr = getLocalStorageJobIds();
    currentJobIdArr = currentJobIdArr.filter(id => id !== jobid);
    localStorage.setItem('currentVideoJobId', JSON.stringify(currentJobIdArr));
  }

  const getLocalStorageJobIds = () => {
    let currentJobIdArr = !!localStorage.getItem('currentVideoJobId') ? JSON.parse(localStorage.getItem('currentVideoJobId')) : [];
    return currentJobIdArr;
  }

  useEffect(() => {
    const currentJobIds = getLocalStorageJobIds();


    currentJobIds.forEach((currentJobId) => {

      if (!currentJobId) return;

      const intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`/api/video-job-status?jobId=${currentJobId}`);
          const job = res.data;


        console.log('user:')
        console.log(userLocal);

          const currentJobIdArr = getLocalStorageJobIds();
          setProgressVideos(currentJobIdArr);

          if (job.status === 'completed') {
            // if (user?.primaryEmailAddress?.emailAddress) {
            //   const userRes = await db.select().from(Users).where(eq(Users.email, user.primaryEmailAddress.emailAddress));
            //   if (userRes[0]) {
            //     // setUserDetail(userRes[0]);
            //   }
            // }
            clearInterval(intervalId);
            if (typeof window !== 'undefined') {
              deleteFromLocalStorageJobId(currentJobId);
            }
          } else if (job.status === 'failed') {

            toast.error(job.error || 'Video generation failed');
            clearInterval(intervalId);
            if (typeof window !== 'undefined') {
              deleteFromLocalStorageJobId(currentJobId);
            }
          }
        } catch (error) {
          deleteFromLocalStorageJobId(currentJobId);
          console.error('Error checking job status:', error);
        }

        const newJobs = getLocalStorageJobIds();

        if (newJobs.length != progressVideos.length) {
          console.log(newJobs)
          console.log(progressVideos);

          setProgressVideos(newJobs);
          getVideos();
        }
      }, 5000);

      return () => clearInterval(intervalId);
    })
  }, []);

  return (
    <div className='px-10 py-10'>
      <div className="justify-between items-center flex">
        <h2 className='font-bold text-2xl text-primary'>Generated Shorts</h2>
        {
          progressVideos.length > 0 && <span className='text-sm text-muted-foreground'>{progressVideos.length} videos generating</span>
        }
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