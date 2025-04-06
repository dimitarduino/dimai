"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import EmptyState from './_components/EmptyState'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { db } from 'configs/db';
import { VideoData } from 'configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import VideosDashboard from './_components/VideosDashboard';
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { Input } from '@/ui/input';
import { SelectScrollUpButton } from '@/ui/select';
import { ChevronLeft, ChevronRight, Dices, SparkleIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from 'next/image';
import DashboardGallery from './_components/DashboardGallery';

function Dashboard() {
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
      <div className="dashboard-top rounded-3xl px-10 items-center justify-center w-full flex py-14 flex flex-col bg-gradient-to-tl dark:from-black dark:to-emerald-800 from-emerald-300 to-green-100">
        <h1 className='font-bold text-4xl text-primary'>Describe your ideas and generate 🚀</h1>
        <h2 className='py-4'>Transform your words into visual masterpieces: Leverage AI technology to craft breathtaking images.</h2>

        <div className="form flex flex-col relative w-full max-w-2xl">
          <Input placeholder="Write a prompt to generate" className={`bg-white pr-40 w-full focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:outline-none mx-auto py-7 shadow-sm border-none focus:border-none w-full`} />

          <div className="buttons absolute flex items-center right-2 top-2 gap-3">
            <Button className={`bg-transparent cursor-pointer text-black hover:text-primary text-3xl hover:bg-transparent`}>
              <Dices size={32} className='dark:text-white' />
            </Button>
            <Button className={`bg-primary dark:text-white cursor-pointer px-10 py-5`}>
              <SparkleIcon />
              <p>Generate</p>
            </Button>
          </div>
        </div>
      </div>

      <div className="dashboard-generations py-12 w-full flex flex-col gap-2">
        <h3 className='font-bold text-3xl text-primary'>Our AI Tools for you</h3>
        <div className="relative" ref={scrollRef}>
          {/* Buttons to control scrolling */}
          <button className='absolute dark:bg-neutral-800 dark:text-white left-[-20px] cursor-pointer top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md z-2' onClick={scrollLeft}>
            <ChevronLeft />
          </button>
          <button className='absolute dark:bg-neutral-800 dark:text-white right-[-20px] cursor-pointer top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md z-2' onClick={scrollRight}>
            <ChevronRight />
          </button>
          <div className="w-fit whitespace-nowrap rounded-md pt-4">
            <div useref={scrollRef} className="flex snap-x space-x-4 overflow-auto scrollable-container">
              {services.map((service) => (
                <figure key={service.title} className="shrink-0 snap-start cursor-pointer relative">
                  <div className="overflow-hidden rounded-md">
                    <video className="aspect-[16/12] transition h-40 h-fit hover:scale-120 w-80 object-cover"
                      width={300}
                      height={400} poster={service.poster} loop="" autoPlay muted playsInline="">
                      <source src={service.video} type="video/webm" />
                    </video>

                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <figcaption className="absolute bottom-4 left-4 right-4 text-xl text-white font-semibold">
                    {service.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DashboardGallery imagesGallery={imagesGallery} />
    </div>
  )
}

export default Dashboard