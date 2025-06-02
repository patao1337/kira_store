import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import { getProducts } from "@/lib/services/product.service";

// Keep static data for reviews and related products (for fallback)
export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "Поло з контрастною окантовкою",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 242,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 4.0,
  },
  {
    id: 13,
    title: "Футболка з градієнтним принтом",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.5,
  },
  {
    id: 14,
    title: "Поло з декоративними деталями",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 15,
    title: "Футболка в чорну смужку",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 150,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 5.0,
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Олена М.",
    content:
      'Я в захваті від якості та стилю одягу з KIRA. Від повсякденних речей до вечірніх образів — усе виглядає стильно і дорого. Улюблений бренд!',
    rating: 5,
  },
  {
    id: 2,
    user: "Андрій К.",
    content: `Знайти одяг, який підходить до мого стилю — завжди було складно. Але з KIRA це стало приємним відкриттям. Асортимент дійсно широкий і враховує різні смаки.`,
    rating: 5,
  },
  {
    id: 3,
    user: "Максим Л.",
    content: `Постійно шукаю щось оригінальне. Радію, що натрапив на цей магазин. Речі не тільки модні, а й дійсно якісні. Те, що треба для тих, хто слідкує за трендами.`,
    rating: 5,
  },
  {
    id: 4,
    user: "Василь П.",
    content: `Як ентузіаст UI/UX, я ціную простоту та функціональність. Ця футболка не лише відображає ці принципи, а й чудово носиться. Очевидно, що дизайнер вклав свою креативність, щоб ця футболка виділялася.`,
    rating: 5,
  },
  {
    id: 5,
    user: "Сергій К.",
    content: `Ця футболка — поєднання комфорту та креативності. Тканина м'яка, а дизайн багато говорить про майстерність дизайнера. Це як носити витвір мистецтва, який відображає мою пристрасть до дизайну та моди.`,
    rating: 5,
  },
  {
    id: 6,
    user: "Cвітлана Д.",
    content: `Я просто обожнюю цю футболку! Дизайн унікальний, а тканина така комфортна. Як дизайнер, я ціную увагу до деталей. Вона стала моєю улюбленою футболкою.`,
    rating: 5,
  },
];

export default async function Home() {
  // Fetch real product data from Supabase
  const newArrivalsData = await getProducts({
    sort: 'newest',
    limit: 4,
  });

  const topSellingData = await getProducts({
    sort: 'rating-desc',
    limit: 4,
  });

  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="НОВИНКИ"
          data={newArrivalsData}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="БЕСТСЕЛЕРИ"
            data={topSellingData}
            viewAllLink="/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
