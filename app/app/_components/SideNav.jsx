"use client"
import { CircleUser, FileVideo, House, ImageIcon, Images, ImageUpscale, Laugh, PanelsTopLeft, ShieldPlus, SmilePlus, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {

    const MenuOption = [{
        id: 1,
        name: "Home",
        path: "/app",
        icon: House
    }, {
        id: 2,
        name: "Generate Shorts",
        path: "/app/shorts",
        icon: FileVideo
    }, {
        id: 3,
        name: "Upscale Images",
        path: "/app/upscale",
        icon: ImageUpscale
    }, {
        id: 4,
        name: "Remove Background",
        path: "/app/removebg",
        icon: ImageIcon
    }, {
        id: 5,
        name: "Face Swap",
        path: "/app/swapface",
        icon: Laugh
    }, {
        id: 6,
        name: "Emoji Generator",
        path: "/app/imagemod",
        icon: SmilePlus
    }, {
        id: 7,
        name: "Video Dubbing",
        path: "/app/speech-text",
        icon: Video
    }]

    const pathname = usePathname();
    return (
        <div className='w-68 h-screen shadow-sm p-2'>
            <div className="grid gap-2">
                <div className="flex py-4 gap-3 items-center">
                    <Image alt='Logo' src={'/logo.svg'} width={32} height={30} />
                    <h2 className='font-bold text-2xl'>AI Generator</h2>
                </div>
                {MenuOption.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <div className={`flex py-3 px-3 text-md hover:bg-gray-200 rounded-md cursor-pointer items-center gap-3 ${pathname == item.path ? "bg-gray-200 text-primary dark:bg-neutral-700 dark:text-white font-bold" : ""}`}>
                            <item.icon size={20} />
                            <p>{item.name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav