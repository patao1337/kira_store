'use client';

import LoginForm from '@/components/auth/login-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state } = useAuth();
  const registered = searchParams.get('registered');
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Login page mounted, auth state:", 
      "session:", state.session ? "exists" : "null",
      "user:", state.user ? "exists" : "null",
      "loading:", state.loading
    );
    
    // If user is already logged in, redirect to account page
    if (state.session && state.user && !state.loading) {
      console.log("User already logged in, redirecting to account page");
      router.push('/account');
      return;
    }
    
    // Handle successful registration message
    if (registered === 'true') {
      setShowRegisteredMessage(true);
      const timer = setTimeout(() => {
        setShowRegisteredMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Handle errors in URL parameters
    if (error || errorCode) {
      console.log("Login page has error params:", error, errorCode);
      // Redirect to dedicated error page for expired OTP or other known error codes
      if (errorCode === 'otp_expired' || error === 'access_denied') {
        router.push(`/auth-error?${searchParams.toString()}`);
      } else if (error) {
        setErrorMessage(`Authentication error: ${searchParams.get('error_description') || error}`);
      }
    }
  }, [registered, error, errorCode, searchParams, router, state]);

  return (
    <main className="min-h-[calc(100vh-80px)] py-12">
      {showRegisteredMessage && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          Account created successfully! Please check your email for a confirmation link before logging in.
        </div>
      )}
      
      {errorMessage && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <LoginForm />
    </main>
  );
} 