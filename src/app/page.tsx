import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Футболка з декоративними деталями",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 120,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 2,
    title: "Джинси скінні",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 260,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
  },
  {
    id: 3,
    title: "Сорочка в клітинку",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Футболка в смужку",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 160,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 4.5,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Сорочка з вертикальними смужками",
    srcUrl: "/images/pic5.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 232,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Футболка з графічним принтом",
    srcUrl: "/images/pic6.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.0,
  },
  {
    id: 7,
    title: "Вільні шорти-бермуди",
    srcUrl: "/images/pic7.png",
    gallery: ["/images/pic7.png"],
    price: 80,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.0,
  },
  {
    id: 8,
    title: "Потерті джинси скінні",
    srcUrl: "/images/pic8.png",
    gallery: ["/images/pic8.png"],
    price: 210,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
];

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

export default function Home() {
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
