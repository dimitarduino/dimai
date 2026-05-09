"use client";

import React from "react";
import { Input } from "@/ui/input";

type PromptImageProps = {
  onUserSelect: (name: string, value: string) => void;
  handleFileChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  name: string;
  accept?: string;
};

function PromptImage({
  onUserSelect,
  handleFileChange,
  title,
  description,
  name,
  accept = "image/*",
}: PromptImageProps) {
  return (
    <div className="w-full">
      <h2 className="font-bold text-xl text-primary">{title}</h2>
      <p className="text-gray-500">{description}</p>

      <Input
        type="file"
        accept={accept}
        onChange={(ev) => {
          handleFileChange(ev);
          onUserSelect(name, ev.target.value);
        }}
      />
    </div>
  );
}

export default PromptImage;
