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
        icon: House,
        sub: []
    }, {
        id: 2,
        name: "Generate Shorts",
        path: "/app/shorts",
        icon: FileVideo,
        sub: [`/app/shorts/create`],
    }, {
        id: 3,
        name: "Upscale Images",
        path: "/app/upscale",
        icon: ImageUpscale,
        sub: []
    }, {
        id: 4,
        name: "Remove Background",
        path: "/app/removebg",
        icon: ImageIcon,
        sub: []
    }, {
        id: 5,
        name: "Face Swap",
        path: "/app/swapface",
        icon: Laugh,
        sub: []
    }, {
        id: 6,
        name: "Emoji Generator",
        path: "/app/imagemod",
        icon: SmilePlus,
        sub: []
    }, {
        id: 7,
        name: "Video Dubbing",
        path: "/app/dubbing",
        icon: Video,
        sub: []
    }]

    const pathname = usePathname();
    return (
        <div className='w-68 h-screen p-2'>
            <div className="grid gap-2">
                <div className="flex py-4 gap-3 items-center">
                    <Image className='pl-3' alt='Logo' src={'/logo.png'} width={120} height={30} />
                    <h2 className='font-bold text-2xl'></h2>
                </div>
                {MenuOption.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <div className={`flex py-3 px-3 text-md hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md cursor-pointer items-center gap-3 ${(pathname == item.path || item.sub.includes(pathname)) ? "bg-gray-200 text-primary dark:bg-neutral-700 dark:text-white font-bold" : ""}`}>
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