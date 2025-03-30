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

function SelectTopic({onUserSelect}) {
  const options = ["Custom Prompt", "Random AI Story", "Scary Story", "Motivational", "Historical Facts", "Bed time story", "Fun Facts"];
  const [selectedOption, setSelectedOption] = useState("Random AI Story");
  
  return (
    <div>
      <h2 className='font-bold text-xl text-primary'>Content</h2>
      <p className='text-gray-500'>What is the topic of your video?</p>
      <Select value={selectedOption} onValueChange={(val) => {
        setSelectedOption(val);
        val!=options[0]&&onUserSelect("topic", val)
      }
        }>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Your Topic" />
        </SelectTrigger>
        <SelectContent>
          {
            options.map((item, index) => (
              <SelectItem key={index} value={item}>{item}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>

      {selectedOption == "Custom Prompt" && (
        <Textarea onChange={(e) => onUserSelect('topic', e.target.value)} className="my-2" placeholder="Your Topic..." />
      )}
    </div>
  )
}

export default SelectTopic
