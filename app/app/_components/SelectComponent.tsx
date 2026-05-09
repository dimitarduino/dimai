"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectComponentProps = {
  onUserSelect: (name: string, value: string) => void;
  value?: string;
  defaultValue?: string;
  optionsAvailable?: string[];
  placeholder?: string;
  title?: string;
  description?: string;
  name?: string;
  className?: string;
};

function SelectComponent({
  onUserSelect,
  value = "",
  defaultValue = "",
  optionsAvailable = [],
  placeholder = "",
  title = "",
  description = "",
  name = "style",
  className,
}: SelectComponentProps) {
  const options = optionsAvailable;
  return (
    <div className="w-full">
      <h2 className="font-bold text-xl text-primary">{title}</h2>
      <p className="text-gray-500">{description}</p>
      <Select
        value={value || defaultValue}
        onValueChange={(val) => {
          onUserSelect(name, val);
        }}
      >
        <SelectTrigger className={cn("w-full mt-2 p-6 text-lg", className)}>
          <SelectValue placeholder={placeholder} />
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

export default SelectComponent;
