"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function SelectDuration({ onUserSelect }) {
  const options = ["Custom Prompt", "Random AI Story", "Scary Story", "Motivational", "Historical Facts", "Bed time story", "Fun Facts"];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div>
      <h2 className='font-bold text-xl text-primary'>Duration</h2>
      <p className='text-gray-500'>Select the duration of your video?</p>
      <Select onValueChange={(val) => {
        setSelectedOption(val);
        onUserSelect("duration", val);
      }
      }>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Duration (in seconds)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30 seconds">30 seconds</SelectItem>
          <SelectItem value="60 seconds">60 seconds</SelectItem>
        </SelectContent>
      </Select>

      {selectedOption == "Custom Prompt" && (
        <Textarea onChange={(e) => onUserSelect('topic', e.target.value)} className="my-2" placeholder="Your Topic..." />
      )}
    </div>
  )
}

export default SelectDuration
