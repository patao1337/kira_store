import React from "react";
import { FooterLinks } from "./footer.types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinksData: FooterLinks[] = [
  {
    id: 1,
    title: "Компанія",
    children: [
      {
        id: 11,
        label: "Про нас",
        url: "#",
      },
      {
        id: 12,
        label: "Можливості",
        url: "#",
      },
      {
        id: 13,
        label: "Наші Проєкти",
        url: "#",
      },
      {
        id: 14,
        label: "Кар'єра",
        url: "#",
      },
    ],
  },
  {
    id: 2,
    title: "Допомога",
    children: [
      {
        id: 21,
        label: "Підтримка клієнтів",
        url: "#",
      },
      {
        id: 22,
        label: "Інформація про доставку",
        url: "#",
      },
      {
        id: 23,
        label: "Політика конфіденційності",
        url: "#",
      },
      {
        id: 24,
        label: "Умови використання",
        url: "#",
      },
    ],
  },
  {
    id: 3,
    title: "FAQ",
    children: [
      {
        id: 31,
        label: "Обліковий запис",
        url: "#",
      },
      {
        id: 32,
        label: "Керування Доставками",
        url: "#",
      },
      {
        id: 33,
        label: "Замовлення",
        url: "#",
      },
      {
        id: 34,
        label: "Оплата",
        url: "#",
      },
    ],
  },
  {
    id: 4,
    title: "Корисні матеріали",
    children: [
      {
        id: 41,
        label: "Буклети",
        url: "#",
      },
      {
        id: 42,
        label: "Посібник розмірів",
        url: "#",
      },
      {
        id: 43,
        label: "Блог",
        url: "#",
      },
      {
        id: 44,
        label: "Відео-інструкції",
        url: "#",
      },
    ],
  },
];

const LinksSection = () => {
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              className={cn([
                link.id !== 41 && link.id !== 43 && "capitalize",
                "text-black/60 text-sm md:text-base mb-4 w-fit",
              ])}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
};

export default LinksSection;
