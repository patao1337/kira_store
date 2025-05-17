import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getProducts, getProductsCount } from "@/lib/services/product.service";

// Define page size
const PAGE_SIZE = 9;

type SearchParamsType = { [key: string]: string | string[] | undefined };

export default async function ShopPage(props: { 
  params: Promise<{}>;
  searchParams: Promise<SearchParamsType>; 
}) {
  // Get params and searchParams by resolving their promises
  const searchParams = await props.searchParams;
  
  // Get current page from query params
  const page = typeof searchParams.page === 'string' 
    ? parseInt(searchParams.page) || 1 
    : 1;
  
  // Get sorting option from query params
  const sort = typeof searchParams.sort === 'string' 
    ? searchParams.sort as 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'
    : 'newest';
  
  // Get category filter from query params
  const category = typeof searchParams.category === 'string'
    ? searchParams.category
    : undefined;
  
  // Calculate offset for pagination
  const offset = (page - 1) * PAGE_SIZE;
  
  // Fetch products with pagination and filters
  const products = await getProducts({
    category,
    sort,
    limit: PAGE_SIZE,
    offset,
  });
  
  // Get total count of products with applied filters (excluding pagination)
  const totalCount = await getProductsCount({ category });
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">
                  {category ? category : 'All Products'}
                </h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  Showing {offset + 1}-{Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount} Products
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select defaultValue={sort || "newest"}>
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating-desc">Most Popular</SelectItem>
                      <SelectItem value="price-asc">Low Price</SelectItem>
                      <SelectItem value="price-desc">High Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {products.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="w-full py-16 text-center">
                <p className="text-black/60 text-lg">No products found.</p>
              </div>
            )}
            <hr className="border-t-black/10" />
            {totalPages > 1 && (
              <Pagination className="justify-between">
                <PaginationPrevious 
                  href={page > 1 ? `/shop?page=${page - 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}` : '#'} 
                  className={`border border-black/10 ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`} 
                />
                <PaginationContent>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    // Logic to show correct page numbers based on current page
                    let pageNum = 1;
                    
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all pages 1 through totalPages
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      // If on pages 1-3, show pages 1-5
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      // If on last 3 pages, show last 5 pages
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Otherwise show current page and 2 on each side
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/shop?page=${pageNum}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`}
                          className="text-black/50 font-medium text-sm"
                          isActive={pageNum === page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href={`/shop?page=${totalPages}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`}
                        className="text-black/50 font-medium text-sm"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </PaginationContent>

                <PaginationNext 
                  href={page < totalPages ? `/shop?page=${page + 1}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}` : '#'} 
                  className={`border border-black/10 ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`} 
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
