"use client"
import { Card } from '@/ui/card';  // Assuming you are using ShadCN's Card component for images
import Image from 'next/image';
import { JSX, useState } from 'react';

interface DashboardGalleryProps {
  imagesGallery: { src: string; title?: string; alt?: string }[];
}

function DashboardGallery({ imagesGallery }: DashboardGalleryProps): JSX.Element {
  const [images, setImages] = useState(imagesGallery);

  return (
    <div className="py-12">
    <h2 className="text-4xl font-bold text-primary mb-8">#Explore DimnAI</h2>
    
    {/* Masonry Layout with CSS Columns */}
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
      {images.map((image, index) => (
        <div key={index} className="">
          <div className="overflow-hidden rounded-sm shadow-sm">
            <Image 
              src={image.src} 
              alt={image.alt ?? image.title ?? "Gallery"} 
              width={400} 
              height={300} 
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default DashboardGallery;