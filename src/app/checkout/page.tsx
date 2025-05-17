'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddressForm, AddressFormData } from '@/components/checkout/AddressForm';
import { OrderSummary, CartItem as OrderCartItem } from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { createOrder, CreateOrderPayload, Address } from '@/lib/services/order.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import Link from 'next/link';
import { CartItem, clearCart } from '@/lib/features/carts/cartsSlice';

// Map from Redux cart item to OrderSummary cart item
const mapCartItem = (item: CartItem): OrderCartItem => ({
  id: String(item.id),
  title: item.name,
  quantity: item.quantity,
  price: item.price,
  src_url: item.srcUrl
});

export default function CheckoutPage() {
  const router = useRouter();
  const { state: { user, loading: authLoading } } = useAuth();
  const dispatch = useAppDispatch();
  
  // Use real Redux cart state
  const cartState = useAppSelector(state => state.carts);
  const cartItems = cartState.cart?.items || [];
  const cartTotal = cartState.adjustedTotalPrice;

  const [shippingAddress, setShippingAddress] = useState<AddressFormData | null>(null);
  const [billingAddress, setBillingAddress] = useState<AddressFormData | null>(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Redirect if not authenticated or cart is empty (after initial load)
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("Checkout: No authenticated user, redirecting to login");
      toast.error("Будь ласка, увійдіть", {
        description: "Ви повинні увійти в систему для оформлення замовлення"
      });
      router.push('/login?redirect=/checkout');
    }
    
    if (cartItems.length === 0 && !isPlacingOrder) {
      console.log("Checkout: Empty cart, redirecting to shop");
      toast.error("Ваш кошик порожній", {
        description: "Будь ласка, додайте товари до кошика перед оформленням замовлення."
      });
      router.push('/shop');
    }
  }, [user, authLoading, cartItems, router, isPlacingOrder]);

  const handleShippingSubmit = (data: AddressFormData) => {
    setShippingAddress(data);
    if (billingSameAsShipping) {
      setBillingAddress(data);
    }
    toast.success("Адресу доставки збережено!");
  };

  const handleBillingSubmit = (data: AddressFormData) => {
    setBillingAddress(data);
    toast.success("Адресу оплати збережено!");
  };

  const handlePlaceOrder = async () => {
    if (!user || !user.id) {
      toast.error("Помилка", {
        description: "Ви повинні увійти в систему, щоб оформити замовлення."
      });
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!shippingAddress) {
      toast.error("Помилка", {
        description: "Будь ласка, вкажіть адресу доставки."
      });
      return;
    }
    if (!billingSameAsShipping && !billingAddress) {
      toast.error("Помилка", {
        description: "Будь ласка, вкажіть адресу оплати."
      });
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Помилка", {
        description: "Ваш кошик порожній."
      });
      return;
    }

    setIsPlacingOrder(true);

    const finalBillingAddress = billingSameAsShipping ? shippingAddress : billingAddress;

    try {
      // Debug the cart items
      console.log("Cart items for order:", JSON.stringify(cartItems.map(item => ({
        id: item.id,
        name: item.name
      }))));

      const orderPayload: CreateOrderPayload = {
        userId: user.id,
        items: cartItems.map(item => {
          // Ensure product_id is a valid number
          const productId = typeof item.id === 'string' 
            ? parseInt(item.id, 10) 
            : item.id;
          
          // Verify it's a valid number  
          if (isNaN(productId)) {
            throw new Error(`Invalid product ID: ${item.id}`);
          }
          
          return {
            product_id: productId,
            quantity: item.quantity,
            price_at_purchase: item.price,
          };
        }),
        totalAmount: cartTotal,
        shippingAddress: shippingAddress as Address,
        billingAddress: finalBillingAddress as Address | undefined,
      };

      console.log("Submitting order with payload:", JSON.stringify({
        userId: orderPayload.userId,
        itemCount: orderPayload.items.length,
        totalAmount: orderPayload.totalAmount,
        // Log the first few items for debugging
        sampleItems: orderPayload.items.slice(0, 2)
      }));

      const orderId = await createOrder(orderPayload);
      toast.success("Замовлення оформлено!", {
        description: `Ваше замовлення #${orderId} успішно оформлено.`
      });
      dispatch(clearCart());
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Не вдалось оформити замовлення", { 
        description: error instanceof Error ? error.message : "Сталася неочікувана помилка."
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p>Завантаження автентифікації...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mb-4">Необхідний вхід</h2>
        <p className="mb-6">Ви повинні увійти в систему, щоб отримати доступ до сторінки оформлення замовлення.</p>
        <Button asChild>
          <Link href="/login?redirect=/checkout">Увійти</Link>
        </Button>
      </div>
    );
  }
  
  if (cartItems.length === 0 && !isPlacingOrder) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mb-4">Ваш кошик порожній</h2>
        <p className="mb-6">Додайте товари до кошика перед оформленням замовлення.</p>
        <Button asChild>
          <Link href="/shop">Продовжити покупки</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Оформлення замовлення</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <AddressForm 
              formTitle="Адреса доставки"
              onSubmit={handleShippingSubmit} 
              initialData={shippingAddress || undefined} 
              submitButtonText="Зберегти адресу доставки"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="billingSameAsShipping"
                checked={billingSameAsShipping}
                onCheckedChange={(checked) => {
                  setBillingSameAsShipping(Boolean(checked));
                  if (Boolean(checked) && shippingAddress) {
                    setBillingAddress(shippingAddress);
                  }
                }}
              />
              <label htmlFor="billingSameAsShipping" className="text-sm font-medium">
                Адреса оплати така ж, як і адреса доставки
              </label>
            </div>
            {!billingSameAsShipping && (
              <AddressForm 
                formTitle="Адреса оплати" 
                onSubmit={handleBillingSubmit} 
                initialData={billingAddress || undefined}
                submitButtonText="Зберегти адресу оплати"
              />
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Інформація про оплату</h2>
            <p className="text-gray-600">
              Для цього дипломного проєкту процес оплати симульований. 
              Натискання "Оформити замовлення" симулюватиме успішну оплату.
            </p>
          </div>
        </div>

        <div className="md:col-span-1">
          <OrderSummary items={cartItems.map(mapCartItem)} />
          <Button 
            onClick={handlePlaceOrder} 
            disabled={isPlacingOrder || !shippingAddress || (!billingSameAsShipping && !billingAddress)}
            className="w-full mt-6"
            size="lg"
          >
            {isPlacingOrder ? 'Оформлення замовлення...' : 'Оформити замовлення'}
          </Button>
        </div>
      </div>
    </div>
  );
} 