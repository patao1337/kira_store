'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'error' | 'success' | 'info'}>({
    text: '',
    type: 'info'
  });

  // Get error parameters from URL
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Handle different error types
    if (errorCode === 'otp_expired') {
      setMessage({
        text: 'Your email verification link has expired. Please request a new one below.',
        type: 'error'
      });
    } else if (error) {
      setMessage({
        text: errorDescription || 'An authentication error occurred',
        type: 'error'
      });
    } else {
      // No error in URL, redirect to homepage
      router.push('/');
    }
  }, [error, errorCode, errorDescription, router]);

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({
        text: 'Please enter your email address',
        type: 'error'
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      setMessage({
        text: 'Confirmation email sent! Please check your inbox.',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.message || 'Failed to resend confirmation email',
        type: 'error'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] py-12">
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-sm text-gray-500 mt-2">
            {errorCode === 'otp_expired' 
              ? 'Your verification link has expired'
              : 'We encountered an issue with your authentication'}
          </p>
        </div>
        
        {message.text && (
          <div className={`p-3 rounded-md ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 
            message.type === 'success' ? 'bg-green-50 text-green-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            <p>{message.text}</p>
          </div>
        )}
        
        {errorCode === 'otp_expired' && (
          <form onSubmit={handleResendConfirmation} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </form>
        )}
        
        <div className="text-center space-y-4">
          <div>
            <Link href="/login" className="text-primary hover:underline">
              Return to Login
            </Link>
          </div>
          <div>
            <Link href="/" className="text-gray-500 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 