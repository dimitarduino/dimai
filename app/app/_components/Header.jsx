"use client"
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { BadgePlusIcon, CircleDollarSign, CoinsIcon, ConeIcon, Crown, DollarSign, PlusCircle, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { Moon, Sun } from "lucide-react"
import { useTheme } from 'app/_context/ThemeContext'

function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="p-3 sticky top-0 left-0 bg-white md:bg-transparent dark:bg-zinc-950 z-100 w-full px-5 flex items-center items-center justify-between">
            <div className="flex">
                <Link href={`/app`}>
                    <Image className='md:hidden' alt='Logo' src={'/logo.png'} width={120} height={30} />
                </Link>

            </div>

            <div className="flex gap-3">
                <button onClick={toggleTheme} className="bg-transparent dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer px-4 rounded-full">
                    {
                        isDark ? <Moon size={20} className="" /> : <Sun size={20} className="" />
                    }
                </button>
                <Link href="/app/upgrade" className='flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-300'>
                    <div className="bg-primary p-1 rounded-full">
                        <DollarSign className='font-bold text-white' alt='Dollar' size={12} />
                    </div>
                    <span className='font-bold text-primary'>
                        {userDetail?.credits}
                    </span>

                    <PlusCircleIcon className='text-primary flex md:hidden' width={16} />
                </Link>
                <Link href="/app/upgrade" className={`md:flex hidden`}>
                    <Button className={`py-5 cursor-pointer dark:text-white`}>
                        <Crown className='text-white font-bold dark:text-white' size={20} />
                        Upgrade
                    </Button>
                </Link>
                <div className="w-10 h-10 bg-primary rounded-full">
                    <UserButton className='scale-150' />
                </div>
            </div>

        </div >
    )
}

export default Header