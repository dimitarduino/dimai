import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { BadgePlusIcon, CircleDollarSign, CoinsIcon, ConeIcon, Crown, DollarSign, PlusCircle } from 'lucide-react';
import Link from 'next/link';

function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    return (
        <div className="p-3 sticky top-0 left-0 bg-neutral-50 z-3 w-full px-5 flex items-center items-center justify-end">


            <div className="flex gap-3">
                <div className='flex items-center gap-2 bg-gray-200 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-300'>
                    <div className="bg-primary p-1 rounded-full">
                        <DollarSign className='font-bold text-white' alt='Dollar' size={12} />
                    </div>
                    <span className='font-bold text-primary'>
                        {userDetail?.credits}
                    </span>

                </div>
                <Link href="/app/upgrade" className={``}>
                    <Button className={`py-5 cursor-pointer`}>
                        <Crown className='text-white font-bold' size={20} />
                        Upgrade
                    </Button>
                </Link>
                <div className="w-10 h-10 bg-primary rounded-full">
                    <UserButton className='scale-150' />
                </div>
            </div>

        </div>
    )
}

export default Header