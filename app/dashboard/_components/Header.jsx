import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from 'app/_context/UserDetailContext';

function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    return (
        <div className="p-3 px-5 flex items-center justify-between shadow-md">
            <div className="flex gap-3 items-center">
                <Image alt='Logo' src={'/logo.svg'} width={32} height={30} />
                <h2 className='font-bold text-xl'>AI Short Generator</h2>
            </div>

            <div className="flex gap-3">
                <div className='flex items-center gap-2'>
                    <Image src={`/dollar.png`} alt='Dollar' width={24} height={16} />
                    <span className='font-bold text-primary'>
                        {userDetail.credits}
                    </span>
                </div>
                <Button>Dashboard</Button>

                <UserButton />
            </div>

        </div>
    )
}

export default Header