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
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const services = [
    {
      title: "Text to Image",
      poster: "/dashboards/text-to-image-v2.webp",
      video: "./dashboards/texttoimage.webm"
    },
    {
      title: "Face to Portrait",
      poster: "/dashboards/face-portrait.webp",
      video: "./dashboards/face-portrait.webm"
    },
    {
      title: "Creative Upscale",
      poster: "/dashboards/creative-upscale.webp",
      video: "./dashboards/creative-upscale.webm"
    },

    {
      title: "Reimagine",
      poster: "/dashboards/reimagine.webp",
      video: "/dashboards/reimagine.webm"
    },
    {
      title: "Generate transparent images",
      poster: "/dashboards/png.webp",
      video: "./dashboards/png.webm"
    },
    {
      title: "Image to video",
      poster: "/dashboards/image-to-video.webp",
      video: "./dashboards/image-to-video.webm"
    },
    {
      title: "Text to video",
      poster: "/dashboards/text-to-video.webp",
      video: "./dashboards/text-to-video.webm"
    },
  ];

  const imagesGallery = [
    { src: '/gallery/dash1.jpg', title: 'Image 1' },
    { src: '/gallery/dash2.jpg', title: 'Image 2' },
    { src: '/gallery/dash3.jpg', title: 'Image 3' },
    { src: '/gallery/dash4.jpg', title: 'Image 4' },
    { src: '/gallery/dash5.jpg', title: 'Image 5' },
    { src: '/gallery/dash6.jpg', title: 'Image 6' },
    { src: '/gallery/dash7.jpg', title: 'Image 6' },
    { src: '/gallery/dash8.jpg', title: 'Image 6' },
    { src: '/gallery/dash8.jpg', title: 'Image 6' },
    { src: '/gallery/dash7.jpg', title: 'Image 6' },
    { src: '/gallery/dash6.jpg', title: 'Image 6' },
    { src: '/gallery/dash5.jpg', title: 'Image 5' },
    { src: '/gallery/dash4.jpg', title: 'Image 4' },
    { src: '/gallery/dash3.jpg', title: 'Image 3' },
    { src: '/gallery/dash2.jpg', title: 'Image 2' },
    { src: '/gallery/dash1.jpg', title: 'Image 1' }
  ];

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

  const scrollRef = useRef(null);

  const scrollRight = () => {
    const scrollArea = document.querySelector(".scrollable-container");
    if (scrollArea) {
      scrollArea.scrollTo({
        left: scrollArea.scrollLeft + 200,
        behavior: 'smooth',
      });
    }
  };

  // Function to scroll to the left
  const scrollLeft = () => {
    const scrollArea = document.querySelector(".scrollable-container");
    if (scrollArea) {
      scrollArea.scrollTo({
        left: scrollArea.scrollLeft - 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='dashboard px-6'>
      <div className="dashboard-top rounded-3xl px-10 items-center justify-center w-full flex py-14 flex flex-col bg-gradient-to-tl from-emerald-300 to-green-100">
        <h1 className='font-bold text-4xl text-primary'>Coming Soon 🚀</h1>
        <h2 className='py-4'>The Upgrade feature will soon let you unlock even more powerful AI tools, faster processing, and exclusive access to premium features.</h2>
      </div>
    </div>
  )
}

export default Upgrade