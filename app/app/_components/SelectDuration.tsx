"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectDurationProps = {
  onUserSelect: (key: string, value: string) => void;
  value: string;
};

function SelectDuration({ onUserSelect, value }: SelectDurationProps) {
  return (
    <div>
      <h2 className="font-bold text-xl text-primary">Duration</h2>
      <p className="text-gray-500">Select the duration of your video?</p>
      <Select
        value={value}
        onValueChange={(val) => {
          onUserSelect("duration", val);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Duration (in seconds)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30 seconds">30 seconds</SelectItem>
          <SelectItem value="60 seconds">60 seconds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectDuration;
