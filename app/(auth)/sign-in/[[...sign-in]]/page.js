import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div>
        <Image className='w-full object-cover' src={'/login.webp'} width={500} height={500} />

      </div>
      <div className="flex justify-center items-center h-screen">
        <SignIn />
      </div>
    </div>
  )
}