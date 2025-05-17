"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoMdCheckmark } from "react-icons/io";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface ColorsSectionProps {
  selectedColors: string[];
  setSelectedColors: Dispatch<SetStateAction<string[]>>;
}

const colors = [
  { id: "green", className: "bg-green-600", displayName: "Green" },
  { id: "red", className: "bg-red-600", displayName: "Red" },
  { id: "yellow", className: "bg-yellow-300", displayName: "Yellow" },
  { id: "orange", className: "bg-orange-600", displayName: "Orange" },
  { id: "cyan", className: "bg-cyan-400", displayName: "Cyan" },
  { id: "blue", className: "bg-blue-600", displayName: "Blue" },
  { id: "purple", className: "bg-purple-600", displayName: "Purple" },
  { id: "pink", className: "bg-pink-600", displayName: "Pink" },
  { id: "white", className: "bg-white", displayName: "White" },
  { id: "black", className: "bg-black", displayName: "Black" },
];

const ColorsSection = ({ selectedColors, setSelectedColors }: ColorsSectionProps) => {
  // Toggle color selection
  const toggleColor = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                className={cn([
                  color.className,
                  "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                ])}
                onClick={() => toggleColor(color.id)}
                aria-label={`Select ${color.displayName} color`}
              >
                {selectedColors.includes(color.id) && (
                  <IoMdCheckmark className={`text-base ${color.id === 'black' || color.id === 'blue' || color.id === 'purple' || color.id === 'green' ? 'text-white' : 'text-black'}`} />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
