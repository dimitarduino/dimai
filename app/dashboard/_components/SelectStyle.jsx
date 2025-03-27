import Image from 'next/image';
import React, { useState } from 'react'

function SelectStyle({onUserSelect}) {
    const styleOptions = [

        {
            name: "Realistic",
            image: "/real.jpeg"
        },
        {
            name: "Cartoon",
            image: "/cartoon.png"
        },

        {
            name: "Comic",
            image: "/comic.jpeg"
        },
        {
            name: "Watercolor",
            image: "/watercolor.jpeg"
        },
        {
            name: "GTA",
            image: "/gta.jpeg"
        }
    ];

    const [odbrano, namestiOdbrano] = useState("");
    return (
        <div>
            <h2 className='font-bold text-xl text-primary'>Style</h2>
            <p className='text-gray-500'>Select your video style</p>

            <div className="grid grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {styleOptions.map((item, index) => (
                    <div key={index} onClick={() => {namestiOdbrano(item.name); onUserSelect("style", item.name)}} className={`relative transition-all cursor-pointer rounded-xl hover:scale-105 ${odbrano == item.name ? `border-4 border-primary` : ``}`}>
                        <Image className='h-64 object-cover w-full rounded-md' src={item.image} alt={item.name} width={500} height={500} />
                        <h2 className={`absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg cursor-pointer p-3 ${odbrano == item.name && `bg-primary` }`}>{item.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectStyle
