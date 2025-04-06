import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'


export const metadata = {
  title: "Dimn AI | Sign in",
  description: "Create stunning AI-generated videos, upscale images, remove backgrounds, and dub videos effortlessly with Dimn AI. Transform your content with cutting-edge AI tools!",
  icons: {
      icon: "/favicon.png",
  },
};

export default function Page() {
  return (
    <div className='grid overflow-hidden grid-cols-1 md:grid-cols-2'>
      <div className='h-full flex bg-emerald-800'>
        <Image alt='Login screen image' className='w-full object-cover animated-image' src={'/hero.png'} width={500} height={500} />

      </div>
      <div className="flex justify-center items-center h-screen">
        <SignIn />
      </div>
    </div>
  )
}