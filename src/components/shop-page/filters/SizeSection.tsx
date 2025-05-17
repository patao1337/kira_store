"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface SizeSectionProps {
  selectedSizes: string[];
  setSelectedSizes: Dispatch<SetStateAction<string[]>>;
}

const sizes = [
  "XX-S",
  "X-S",
  "S",
  "M",
  "L",
  "X-L",
  "XX-L",
  "3X-L",
  "4X-L",
];

const SizeSection = ({ selectedSizes, setSelectedSizes }: SizeSectionProps) => {
  // Toggle size selection
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizes.map((size, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                  selectedSizes.includes(size) && "bg-black font-medium text-white",
                ])}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
