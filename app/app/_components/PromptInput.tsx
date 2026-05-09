"use client";

import React from "react";
import { Input } from "@/ui/input";

type PromptInputProps = {
  onUserSelect: (kind: "text", value: string) => void;
  title: string;
  description: string;
  name?: string;
};

function PromptInput({ onUserSelect, title, description }: PromptInputProps) {
  return (
    <div className="w-full">
      <h2 className="font-bold text-xl text-primary mb-2">{title}</h2>
      <p className="text-gray-500">{description}</p>

      <Input
        className={`py-6`}
        placeholder={title}
        type="text"
        onChange={(e) => {
          onUserSelect("text", e.target.value);
        }}
      />
    </div>
  );
}

export default PromptInput;
