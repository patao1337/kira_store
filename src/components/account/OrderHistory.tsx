'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrdersByUserId, Order } from '@/lib/services/order.service';
import { useAuth } from '@/lib/hooks/useAuth'; // Make sure this path is correct
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShoppingBag, ExternalLink } from 'lucide-react';

// --- Mocking Removed ---
// const MOCKED_USER_ID = 'mock-user-123'; 
// const useAuth = () => ({ user: { id: MOCKED_USER_ID }, loading: false });
// --- End Mocking Removed ---

export default function OrderHistory() {
  const { state: { user, loading: authLoading } } = useAuth(); // Correctly access the user and loading from state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getOrdersByUserId(user.id)
        .then(fetchedOrders => {
          setOrders(fetchedOrders);
        })
        .catch(err => {
          console.error("Error fetching order history:", err);
          setError(err.message || 'Не вдалося завантажити історію замовлень.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (!user && !authLoading) {
        setError("Ви повинні увійти, щоб переглянути історію замовлень.");
        setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return <div className="p-4 text-center">Завантаження історії замовлень...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Помилка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ще немає замовлень</h3>
        <p className="mt-1 text-sm text-gray-500">Ви ще не робили замовлень.</p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/shop">Почати покупки</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline'; // Or another variant for shipped
      case 'delivered':
        return 'default'; // bg-green-500 or similar if custom
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'В очікуванні';
      case 'processing':
        return 'Обробляється';
      case 'shipped':
        return 'Відправлено';
      case 'delivered':
        return 'Доставлено';
      case 'cancelled':
        return 'Скасовано';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Ваші замовлення</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID замовлення</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Сума</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.substring(0, 8)}...</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>{translateStatus(order.status)}</Badge>
              </TableCell>
              <TableCell className="text-right">${order.total_amount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/order-confirmation?orderId=${order.id}`} title="Переглянути замовлення">
                    Перегляд <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 