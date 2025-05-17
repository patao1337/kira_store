"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dispatch, SetStateAction } from "react";
import { IoMdCheckmark } from "react-icons/io";

interface DressStyleSectionProps {
  selectedStyles: string[];
  setSelectedStyles: Dispatch<SetStateAction<string[]>>;
}

const dressStyles = [
  { id: "casual", title: "Casual" },
  { id: "formal", title: "Formal" },
  { id: "party", title: "Party" },
  { id: "gym", title: "Gym" },
];

const DressStyleSection = ({ selectedStyles, setSelectedStyles }: DressStyleSectionProps) => {
  // Toggle style selection
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter(s => s !== styleId));
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {dressStyles.map((style, idx) => (
              <button
                key={idx}
                onClick={() => toggleStyle(style.id)}
                className="flex items-center justify-between py-2 text-left"
              >
                <span className={selectedStyles.includes(style.id) ? "font-medium text-black" : ""}>
                  {style.title}
                </span>
                {selectedStyles.includes(style.id) && <IoMdCheckmark className="text-green-600" />}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
