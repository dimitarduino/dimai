"use client";

import { ArrowLeftRightIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";


const ImageComparisonSlider = ({ originalSrc, upscaledSrc }) => {
  const [sliderPosition, setSliderPosition] = useState(20); // Initial position of the slider (50% width)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [isBefore, setIsBefore] = useState(true);
  const [isAfter, setIsAfter] = useState(false);

  const handleSliderChange = (e) => {
    const containerWidth = containerRef.current.offsetWidth;
    const offsetX = e.clientX - containerRef.current.getBoundingClientRect().left;
    const newSliderPosition = Math.min(
      Math.max((offsetX / containerWidth) * 100, 0),
      100
    );
    if (newSliderPosition < 50) {setIsAfter(false); setIsBefore(true)}
    if (newSliderPosition >= 50) {setIsAfter(true); setIsBefore(false)}
    setSliderPosition(newSliderPosition);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
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
    <div className="relative w-full max-w-2xl mx-auto mt-2" ref={containerRef}>

      <div className="relative">
        {/* Container for the images */}
        <div className="w-full h-auto relative">
          <div className="absolute statuses flex justify-between items-center top-2 left-2 right-2">
            <span className={`text-white px-2 py-1 bg-primary rounded-md z-3 font-bold text-lg ${isBefore ? 'hidden' : ''}`}>After</span>
            <span className={`text-white px-2 py-1 bg-primary rounded-md z-3 font-bold text-lg ${isAfter ? 'hidden' : ''}`}>Before</span>
          </div>
          {/* Original Image */}
          <img
            src={originalSrc}
            alt="Original"
            className="w-full max-h-[50vh] h-auto object-cover rounded-md"
          />
          <img
            src={upscaledSrc}
            alt="Upscaled"
            className="w-full max-h-[50vh] h-auto object-cover absolute top-0 left-0 rounded-md"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // Only show part of the upscaled image based on the slider position
            }}
          />
        </div>

        <div
          className="absolute flex items-center justify-center top-0 left-0 z-10 cursor-ew-resize h-full rounded-md"
          style={{ left: `calc(${sliderPosition}% - 15px)` }}
          onMouseDown={handleMouseDown}
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