"use client";

import { useState } from "react";
import { getPredefinedOptions, PredefinedCategory } from "@/lib/profile-utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PredefinedInputProps {
  category: PredefinedCategory;
  onChange: (value: string) => void;
  value: string;
}

export default function PredefinedInput({
  category,
  onChange,
  value,
}: PredefinedInputProps) {
  const [options] = useState(getPredefinedOptions(category));

  return (
    <div className="space-y-2">
      {/* Input */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Entrer ${category}...`}
        className="border-green-300 focus-visible:ring-green-400"
      />

      {/* Predefined options */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Badge
            key={opt}
            variant="outline"
            onClick={() => onChange(opt)}
            className={`cursor-pointer px-3 py-1 rounded-full transition-colors
              ${
                value === opt
                  ? "bg-green-100 text-green-700 border-green-400"
                  : "hover:bg-green-50"
              }`}
          >
            {opt}
          </Badge>
        ))}
      </div>
    </div>
  );
}
