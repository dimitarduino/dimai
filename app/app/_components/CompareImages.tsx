"use client";

import { ArrowLeftRightIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface ImageComparisonSliderProps {
  originalSrc: string;
  upscaledSrc: string;
}


const ImageComparisonSlider = ({ originalSrc, upscaledSrc } : ImageComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(20); // Initial position of the slider (50% width)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isBefore, setIsBefore] = useState(true);
  const [isAfter, setIsAfter] = useState(false);

  const handleSliderChange = (e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const containerWidth = el.offsetWidth;
    if (containerWidth === 0) return;
    const offsetX = e.clientX - el.getBoundingClientRect().left;
    const newSliderPosition = Math.min(
      Math.max((offsetX / containerWidth) * 100, 0),
      100
    );
    if (newSliderPosition < 50) {setIsAfter(false); setIsBefore(true)}
    if (newSliderPosition >= 50) {setIsAfter(true); setIsBefore(false)}
    setSliderPosition(newSliderPosition);
  };

  const handleMouseDown = (e : React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e : MouseEvent) => {
    if (isDragging) {
      handleSliderChange(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach mousemove and mouseup event listeners on mouse down
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);


  return (
    <div className="relative w-full max-w-2xl flex justify-center items-center mx-auto mt-2" ref={containerRef}>

      <div className="relative w-auto flex justify-center items-center">
        {/* Container for the images */}
        <div className="w-auto mx-auto h-auto relative">
          <div className="absolute statuses flex justify-between items-center top-2 left-2 right-2">
            <span className={`text-white px-2 py-1 bg-primary rounded-md z-3 font-bold text-lg ${isBefore ? 'hidden' : ''}`}>After</span>
            <span className={`text-white px-2 py-1 bg-primary rounded-md z-3 font-bold text-lg ${isAfter ? 'hidden' : ''}`}>Before</span>
          </div>
          {/* Original Image */}
          <img
            src={originalSrc}
            alt="Original"
            className="w-auto max-h-[50vh] h-auto object-cover rounded-md"
          />
          <img
            src={upscaledSrc}
            alt="Upscaled"
            className="w-auto max-h-[50vh] h-auto object-cover absolute top-0 left-0 rounded-md"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // Only show part of the upscaled image based on the slider position
            }}
          />
        </div>

        <div
          className="absolute flex items-center justify-center top-0 left-0 z-10 cursor-ew-resize h-full rounded-md"
          style={{ left: `calc(${sliderPosition}% - 15px)` }}
          onMouseDown={(e) => handleMouseDown(e)}
        >
          <div className="absolute w-1 h-full bg-primary top-0 left-1/2 transform -translate-x-1/2">

          </div>
          <div className="bg-white w-8 h-8 rounded-full z-2 relative flex items-center justify-center">
            <ArrowLeftRightIcon className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;