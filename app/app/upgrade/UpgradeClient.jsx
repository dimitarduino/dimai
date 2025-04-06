"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EmptyState from '../_components/EmptyState'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { db } from 'configs/db';
import { VideoData } from 'configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import VideosDashboard from '../_components/VideosDashboard';
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { Input } from '@/ui/input';
import { SelectScrollUpButton } from '@/ui/select';
import { ChevronLeft, ChevronRight, Dices, SparkleIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from 'next/image';
import DashboardGallery from '../_components/DashboardGallery';

function Upgrade() {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    document.querySelectorAll("video").forEach((video) => video.play());
  }, []);

  useEffect(() => {
    user && getVideosList();
  }, [user]);

  const getVideosList = async () => {
    const res = await db.select().from(VideoData).where(eq(VideoData.createdBy, user?.primaryEmailAddress?.emailAddress));
    setVideos(res);
  }

  return (
    <div className='dashboard px-6'>
      <div className="dashboard-top rounded-3xl px-10 items-center container-md justify-center w-full flex py-14 flex flex-col bg-gradient-to-tl from-emerald-300 to-green-100 dark:from-black dark:to-emerald-800">
        <h1 className='font-bold text-4xl text-primary'>Coming Soon 🚀</h1>
        <h2 className='py-4'>The Upgrade feature will soon let you unlock even more powerful AI tools, faster processing, and exclusive access to premium features.</h2>
      </div>
    </div>
  )
}

export default Upgrade