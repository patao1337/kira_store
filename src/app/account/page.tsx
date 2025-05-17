'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AccountForm from '@/components/auth/account-form';
import ProtectedRoute from '@/components/auth/protected-route';
import OrderHistory from '@/components/account/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AccountPageContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';

  return (
    <ProtectedRoute>
      <main className="min-h-[calc(100vh-80px)] py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto max-w-4xl">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Налаштування профілю</TabsTrigger>
              <TabsTrigger value="orders">Історія замовлень</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <AccountForm />
            </TabsContent>
            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedRoute>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4 text-center">Завантаження сторінки облікового запису...</div>}>
      <AccountPageContent />
    </Suspense>
  );
} 