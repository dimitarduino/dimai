"use client"
import { ExpandIcon, FileVideo, House, ImageIcon, ImageUpscale, Laugh, MessageSquare, SmilePlus, Video, VideoIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { MobileNavContext } from '../layout'
import { Button } from '@/components/ui/button'

function MobileBottomNav() {
    // All navigation items matching SideNav
    const MobileMenuOptions = [
        {
            id: 1,
            name: "Home",
            path: "/app",
            icon: House,
            sub: []
        },
        {
            id: 2,
            name: "Shorts",
            path: "/app/shorts",
            icon: FileVideo,
            sub: [`/app/shorts/create`],
        },
        {
            id: 3,
            name: "Upscale",
            path: "/app/upscale",
            icon: ImageUpscale,
            sub: []
        },
        {
            id: 4,
            name: "Remove BG",
            path: "/app/removebg",
            icon: ImageIcon,
            sub: []
        },
        {
            id: 5,
            name: "Expand",
            path: "/app/expand-image",
            icon: ExpandIcon,
            sub: []
        },
        {
            id: 6,
            name: "Face Swap",
            path: "/app/swapface",
            icon: Laugh,
            sub: []
        },
        {
            id: 7,
            name: "Emoji",
            path: "/app/imagemod",
            icon: SmilePlus,
            sub: []
        },
        {
            id: 8,
            name: "Dubbing",
            path: "/app/dubbing",
            icon: Video,
            sub: []
        },
        {
            id: 9,
            name: "Video",
            path: "/app/image-to-video",
            icon: VideoIcon,
            sub: []
        },
        {
            id: 10,
            name: "Chat",
            path: "/app/chat",
            icon: MessageSquare,
            sub: []
        },
    ]

    const pathname = usePathname();
    const { setShowBottomNav } = useContext(MobileNavContext);

    return (
        <div 
            className='fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800'
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
        >
            {/* Close button for all pages except home */}
            {pathname !== '/app' && (
                <div className="flex justify-end px-2 pt-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowBottomNav(false)}
                        className="h-6 w-6"
                        title="Hide navigation"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center px-2 py-2 min-w-max">
                    {MobileMenuOptions.map((item) => {
                        const isActive = pathname === item.path || (item.sub && item.sub.includes(pathname));
                        return (
                            <Link href={item.path} key={item.id} className="flex-shrink-0">
                                <div className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-all active:scale-95 mx-1 ${
                                    isActive 
                                        ? "text-primary dark:text-primary bg-primary/10 dark:bg-primary/20" 
                                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                                }`}>
                                    <item.icon 
                                        size={20} 
                                        className={isActive ? "text-primary" : ""}
                                    />
                                    <span className={`text-[10px] mt-0.5 font-medium whitespace-nowrap ${isActive ? "text-primary" : ""}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default MobileBottomNav

