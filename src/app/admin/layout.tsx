"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login?redirect=/admin');
          return;
        }

        // Check if user is admin
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin, email')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          router.push('/');
          return;
        }

        // Check if the user is an admin
        if (!profile.is_admin) {
          // Fallback to email check if is_admin field doesn't exist or is false
          // This is for backward compatibility until you run the admin-schema-update.sql
          if (!profile.email?.endsWith('@admin.com')) {
            router.push('/');
            return;
          }
        }

        setSession(session);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login?redirect=/admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Панель адміністратора</h1>
        <p className="text-gray-500">Керування товарами магазину</p>
      </div>
      {children}
    </div>
  );
} 