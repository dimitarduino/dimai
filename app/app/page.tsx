"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/ui/input';
import { SelectScrollUpButton } from '@/ui/select';
import { ChevronLeft, ChevronRight, Dices, SparkleIcon } from 'lucide-react';
import DashboardGallery from './_components/DashboardGallery';

function Dashboard() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const services = [
    {
      title: "Expand Image",
      link: "app/expand-image",
      poster: "/dashboards/text-to-image-v2.webp",
      video: "./dashboards/texttoimage.webm"
    },
    {
      title: "Face swap",
      link: "app/swapface",
      poster: "/dashboards/face-portrait.webp",
      video: "./dashboards/face-portrait.webm"
    },
    {
      title: "Creative Upscale",
      link: "app/upscale",
      poster: "/dashboards/creative-upscale.webp",
      video: "./dashboards/creative-upscale.webm"
    },

    {
      title: "Generate Shorts",
      link: "app/shorts",
      poster: "/dashboards/reimagine.webp",
      video: "/dashboards/reimagine.webm"
    },
    {
      title: "Generate transparent images",
      link: "app/expand-images",
      poster: "/dashboards/png.webp",
      video: "./dashboards/png.webm"
    },
    {
      title: "Emoji Generator",
      link: "app/imagemod",
      poster: "/dashboards/image-to-video.webp",
      video: "./dashboards/image-to-video.webm"
    },
    {
      title: "Video Dubbing",
      link: "app/dubbing",
      poster: "/dashboards/text-to-video.webp",
      video: "./dashboards/text-to-video.webm"
    },
    {
      title: "Image to Video",
      link: "app/image-to-video",
      poster: "/dashboards/image-to-video.webp",
      video: "./dashboards/image-to-video.webm"
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

  // Random AI prompts for inspiration
  const randomPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about a robot learning to paint",
    "What are the latest trends in artificial intelligence?",
    "How does machine learning differ from deep learning?",
    "Describe the future of renewable energy",
    "What are the benefits of meditation for productivity?",
    "Explain the concept of blockchain technology",
    "Write a poem about the beauty of nature",
    "What are the key principles of effective communication?",
    "How can I improve my problem-solving skills?",
    "Explain the theory of relativity in simple terms",
    "What are the best practices for sustainable living?",
    "Describe the process of photosynthesis",
    "How does the human brain process memories?",
    "What are the main causes of climate change?",
    "Write a short story about time travel",
    "Explain how vaccines work",
    "What are the benefits of regular exercise?",
    "Describe the water cycle",
    "How can I learn a new language effectively?",
  ];

  // Generate random prompt
  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    setPrompt(randomPrompts[randomIndex]);
  };

  // Handle form submit - navigate to chat with prompt
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim()) {
      // Navigate to chat page with prompt as query parameter
      router.push(`/app/chat?prompt=${encodeURIComponent(prompt.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className='dashboard px-4 sm:px-6'>
      <div className="dashboard-top rounded-3xl px-3 sm:px-10 items-center justify-center w-full flex py-14 flex flex-col bg-gradient-to-tl dark:from-black dark:to-emerald-800 from-emerald-300 to-green-100">
        <h1 className='font-bold text-4xl text-primary'>Describe your ideas and generate 🚀</h1>
        <h2 className='py-4'>Transform your words into visual masterpieces: Leverage AI technology to craft breathtaking images.</h2>

        <form onSubmit={handleSubmit} className="form flex flex-col relative w-full max-w-2xl">
          <Input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a prompt to generate" 
            className={`bg-white pr-40 w-full focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:outline-none mx-auto py-7 shadow-sm border-none focus:border-none w-full`} 
          />

          <div className="buttons absolute flex items-center right-2 top-2 gap-3">
            <Button 
              type="button"
              onClick={generateRandomPrompt}
              className={`bg-transparent cursor-pointer text-black hover:text-primary text-3xl hover:bg-transparent`}
            >
              <Dices size={32} className='dark:text-white' />
            </Button>
            <Button 
              type="submit"
              disabled={!prompt.trim()}
              className={`bg-primary dark:text-white cursor-pointer px-10 py-5 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <SparkleIcon />
              <p>Generate</p>
            </Button>
          </div>
        </form>
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
            <div className="flex snap-x space-x-4 overflow-auto scrollable-container">
              {services.map((service) => (
                <Link href={service.link} key={service.title} className="shrink-0 snap-start cursor-pointer relative">
                  <div className="overflow-hidden rounded-md">
                    <video className="aspect-[16/12] transition h-40 h-fit hover:scale-120 w-60 object-cover"
                      width={300}
                      height={400} poster={service.poster}
                      autoPlay 
                      muted 
                      playsInline
                      loop >
                      <source src={service.video} type="video/webm" />
                    </video>

                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <figcaption className="absolute bottom-4 left-4 right-4 text-xl text-white font-semibold">
                    {service.title}
                  </figcaption>
                </Link>
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