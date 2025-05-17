'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, Order } from '@/lib/services/order.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, ShoppingCart, User } from 'lucide-react';

function OrderConfirmationDisplay() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then(fetchedOrder => {
          if (fetchedOrder) {
            setOrder(fetchedOrder);
          } else {
            setError('Замовлення не знайдено або у вас немає дозволу на його перегляд.');
          }
        })
        .catch(err => {
          console.error("Error fetching order details:", err);
          setError(err.message || 'Не вдалося завантажити деталі замовлення.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Не вказано ID замовлення.');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Завантаження деталей замовлення...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Помилка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
            <Button asChild><Link href="/shop">Перейти до магазину</Link></Button>
        </div>
      </div>
    );
  }

  if (!order) {
    // This case should ideally be covered by the error state from getOrderById returning null
    return <div className="container mx-auto p-4 text-center">Не вдалося завантажити деталі замовлення.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-green-50">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div>
              <CardTitle className="text-2xl text-green-700">Замовлення підтверджено!</CardTitle>
              <p className="text-sm text-gray-600">Дякуємо за покупку.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-lg">
            Ваше замовлення <span className="font-semibold text-blue-600">#{order.id.substring(0,8)}...</span> успішно розміщено.
          </p>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Підсумок замовлення:</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {order.order_items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-3">
                    {item.product?.src_url && (
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image src={item.product.src_url} alt={item.product.title || 'Зображення товару'} layout="fill" objectFit="cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.product?.title || 'Назва товару'}</p>
                      <p className="text-xs text-gray-500">К-сть: {item.quantity} x ${item.price_at_purchase.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.quantity * item.price_at_purchase).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />

          <div className="text-sm">
            <h3 className="text-lg font-semibold mb-2">Деталі доставки:</h3>
            <p><strong>Ім'я:</strong> {order.shipping_address.fullName}</p>
            <p><strong>Адреса:</strong> {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.postalCode}, {order.shipping_address.country}</p>
            {order.shipping_address.phone && <p><strong>Телефон:</strong> {order.shipping_address.phone}</p>}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Загальна сума:</p>
            <p className="text-xl font-bold text-green-600">${order.total_amount.toFixed(2)}</p>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Незабаром ви отримаєте електронний лист з підтвердженням та деталями вашого замовлення.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 p-6 bg-gray-50">
          <Button asChild variant="outline">
            <Link href="/shop" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Продовжити покупки</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/account?tab=orders" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Переглянути історію замовлень</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    // Suspense is required by Next.js when using useSearchParams in a page
    <Suspense fallback={<div className="container mx-auto p-4 text-center">Завантаження підтвердження...</div>}>
      <OrderConfirmationDisplay />
    </Suspense>
  );
} 