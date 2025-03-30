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

function SelectComponent({ onUserSelect, defaultValue = '', optionsAvailable = [], placeholder = '', title = '', description = '', name = "style" }) {
  const options = optionsAvailable;
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  return (
    <div className='w-full'>
      <h2 className='font-bold text-xl text-primary'>{title}</h2>
      <p className='text-gray-500'>{description}</p>
      <Select value={selectedOption} onValueChange={(val) => {
        setSelectedOption(val);
        onUserSelect(name, val)
      }
      }>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {
            options.map((item, index) => (
              <SelectItem key={index} value={item}>{item}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectComponent
