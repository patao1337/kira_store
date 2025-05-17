"use client";

import { cn } from "@/lib/utils";
import { leagueSpartan } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import { useAuth } from "@/lib/hooks/useAuth";

const data: NavMenu = [
  {
    id: 1,
    label: "Каталог",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Чоловічий одяг",
        url: "/shop#men-clothes",
        description: "В привабливих та ефектних кольорах і дизайнах",
      },
      {
        id: 12,
        label: "Жіночий одяг",
        url: "/shop#women-clothes",
        description: "Дами, ваш стиль і смаки важливі для нас",
      },
      {
        id: 13,
        label: "Дитячий одяг",
        url: "/shop#kids-clothes",
        description: "Для всіх вікових груп, з яскравими та красивими кольорами",
      },
      {
        id: 14,
        label: "Сумки та взуття",
        url: "/shop#bag-shoes",
        description: "Підходить для чоловіків, жінок та всіх смаків і стилів",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Знижки",
    url: "/shop#on-sale",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "Новинки",
    url: "/shop#new-arrivals",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Бренди",
    url: "/shop#brands",
    children: [],
  },
];

const TopNavbar = () => {
  const { state } = useAuth();
  const isAuthenticated = !!state.user;

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              leagueSpartan.className,
              "font-bold text-2xl lg:text-[32px] mb-2 mr-3 lg:mr-10",
            ])}
          >
            KI•RA
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <InputGroup className="hidden md:flex bg-[#F0F0F0] mr-3 lg:mr-10">
          <InputGroup.Text>
            <Image
              priority
              src="/icons/search.svg"
              height={20}
              width={20}
              alt="search"
              className="min-w-5 min-h-5"
            />
          </InputGroup.Text>
          <InputGroup.Input
            type="search"
            name="search"
            placeholder="Пошук товарів..."
            className="bg-transparent placeholder:text-black/40"
          />
        </InputGroup>
        <div className="flex items-center">
          <Link href="/search" className="block md:hidden mr-[14px] p-1">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-w-[22px] max-h-[22px]"
            />
          </Link>
          <CartBtn />
          {isAuthenticated ? (
            <Link href="/account" className="p-1 relative">
              <Image
                priority
                src="/icons/user.svg"
                height={100}
                width={100}
                alt="account"
                className="max-w-[22px] max-h-[22px]"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
            </Link>
          ) : (
            <Link href="/login" className="p-1">
              <Image
                priority
                src="/icons/user.svg"
                height={100}
                width={100}
                alt="login"
                className="max-w-[22px] max-h-[22px]"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
