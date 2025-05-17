"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ColorsSection from "./ColorsSection";
import DressStyleSection from "./DressStyleSection";
import PriceSection from "./PriceSection";
import SizeSection from "./SizeSection";
import { Button } from "@/components/ui/button";

const FilterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States for filters
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  // Set initial states from URL on component mount
  useEffect(() => {
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    
    if (minPriceParam) setMinPrice(minPriceParam);
    if (maxPriceParam) setMaxPrice(maxPriceParam);
    
    // Add other filters if needed in the future
  }, [searchParams]);
  
  // Handle form submission
  const handleApplyFilter = () => {
    // Get current URL params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove price params
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    
    // Preserve the category if it exists
    const category = searchParams.get("category");
    if (category) {
      params.set("category", category);
    }
    
    // Reset to page 1 when applying new filters
    params.set("page", "1");
    
    // Navigate to the new URL
    router.push(`/shop?${params.toString()}`);
  };
  
  return (
    <>
      <PriceSection 
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
      <hr className="border-t-black/10" />
      <ColorsSection 
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
      />
      <hr className="border-t-black/10" />
      <SizeSection 
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
      />
      <hr className="border-t-black/10" />
      <DressStyleSection 
        selectedStyles={selectedStyles}
        setSelectedStyles={setSelectedStyles}
      />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={handleApplyFilter}
      >
        Apply Filter
      </Button>
    </>
  );
};

export default FilterForm; 