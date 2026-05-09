"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectModeProps = {
  onUserSelect: (key: string, value: string) => void;
};

function SelectMode({ onUserSelect }: SelectModeProps) {
  const options = ["3D", "Emoji", "Video game", "Pixels", "Clay", "Toy"];
  return (
    <div className="w-full">
      <h2 className="font-bold text-xl text-primary">Content</h2>
      <p className="text-gray-500">What is the topic of your video?</p>
      <Select
        onValueChange={(val) => {
          val !== options[0] && onUserSelect("style", val);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectMode;
