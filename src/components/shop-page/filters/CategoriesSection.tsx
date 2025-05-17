import Link from "next/link";
import { getCategories } from "@/lib/services/product.service";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSearchParams } from "next/navigation";

// Convert component to async server component
const CategoriesSection = async () => {
  // Fetch categories from the database
  const categories = await getCategories();
  
  // Default categories in case DB fetch fails
  const fallbackCategories = [
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Shorts", slug: "shorts" },
    { name: "Shirts", slug: "shirts" },
    { name: "Jeans", slug: "jeans" },
    { name: "Polos", slug: "polos" },
  ];
  
  // Use categories from DB or fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      <Link
        href="/shop"
        className="flex items-center justify-between py-2 font-medium"
      >
        All Products <MdKeyboardArrowRight />
      </Link>
      
      {displayCategories.map((category, idx) => (
        <Link
          key={idx}
          href={`/shop?category=${category.slug}`}
          className="flex items-center justify-between py-2"
        >
          {category.name} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;
