import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
function EmptyState() {
  return (
    <div className='px-5 py-24 rounded-md flex items-center mt-10 border-2 border-dashed flex-col'>
      <p className='font-bold text-3xl'>You don't have any short videos created!</p>
      <Link href="/dashboard/create">

        <Button className="mt-4 py-7 cursor-pointer">Create New Short Video</Button>
      </Link>
    </div>
  )
}

export default EmptyState