'use client';

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

// Assuming a CartItem type like this. Adjust if your structure is different.
export interface CartItem {
  id: string | number; // product id
  title: string;
  quantity: number;
  price: number; // Price per unit
  src_url?: string; // Image URL
  // Add any other relevant fields like size, color, etc.
}

interface OrderSummaryProps {
  items: CartItem[];
  shippingCost?: number; // Optional: if not provided, can display a message
}

const MOCKED_SHIPPING_COST = 5.00;

export function OrderSummary({ items, shippingCost }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const actualShippingCost = shippingCost ?? MOCKED_SHIPPING_COST;
  const total = subtotal + actualShippingCost;

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Підсумок замовлення</h2>
      <ScrollArea className="h-[300px] pr-4 mb-4">
        <div className="space-y-4">
          {items.length === 0 && <p>Ваш кошик порожній.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              {item.src_url && (
                <div className="w-16 h-16 relative rounded overflow-hidden">
                  <Image 
                    src={item.src_url} 
                    alt={item.title} 
                    layout="fill" 
                    objectFit="cover" 
                  />
                </div>
              )}
              <div className="flex-grow">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">
                  К-сть: {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Проміжна сума</p>
          <p className="font-medium">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Доставка</p>
          <p className="font-medium">
            {shippingCost !== undefined 
              ? `$${actualShippingCost.toFixed(2)}` 
              : 'Розраховується на наступному кроці'}
          </p>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between text-lg font-bold">
        <p>Загалом</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  );
} 