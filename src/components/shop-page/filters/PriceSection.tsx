"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Dispatch, SetStateAction } from "react";

interface PriceSectionProps {
  minPrice: string;
  maxPrice: string;
  setMinPrice: Dispatch<SetStateAction<string>>;
  setMaxPrice: Dispatch<SetStateAction<string>>;
}

const PriceSection = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }: PriceSectionProps) => {
  // Convert string values to numbers for slider
  const minValue = minPrice ? parseInt(minPrice) : 0;
  const maxValue = maxPrice ? parseInt(maxPrice) : 250;
  
  // Handle slider value change
  const handleSliderChange = (values: number[]) => {
    setMinPrice(values[0].toString());
    setMaxPrice(values[1].toString());
  };
  
  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            value={[minValue, maxValue]}
            min={0}
            max={1000}
            step={10}
            label="₴"
            onValueChange={handleSliderChange}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>₴{minValue}</span>
            <span>₴{maxValue}</span>
          </div>
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
