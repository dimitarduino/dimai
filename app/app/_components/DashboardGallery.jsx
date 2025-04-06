"use client"
import { Card } from '@/ui/card';  // Assuming you are using ShadCN's Card component for images
import Image from 'next/image';
import { useState } from 'react';

function DashboardGallery({imagesGallery}) {
  const [images, setImages] = useState(imagesGallery);

  return (
    <div className="py-12">
    <h2 className="text-4xl font-bold text-primary mb-8">#Explore DimnAI</h2>
    
    {/* Masonry Layout with CSS Columns */}
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
      {images.map((image, index) => (
        <div key={index} className="">
          <div className="overflow-hidden rounded-sm shadow-sm">
            <Image 
              src={image.src} 
              alt={image.alt || `Gallery one`} 
              width={400} 
              height={300} 
              layout="responsive"
              objectFit="cover"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default DashboardGallery;