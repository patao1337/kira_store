import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import FilterForm from "./FilterForm";

// Convert to async server component
const Filters = async () => {
  return (
    <>
      <hr className="border-t-black/10" />
      {/* Categories Section as Server Component */}
      <CategoriesSection />
      <hr className="border-t-black/10" />
      
      {/* Client-side filtering form */}
      <FilterForm />
    </>
  );
};

export default Filters;
