import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

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