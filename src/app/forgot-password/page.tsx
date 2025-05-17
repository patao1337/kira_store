'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'error' | 'success'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setMessage({
        text: 'Password reset instructions sent to your email. Please check your inbox.',
        type: 'success'
      });
    } catch (error: any) {
      setMessage({
        text: error.message || 'Failed to send reset instructions',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] py-12">
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>
        
        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <p>{message.text}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading || (message?.type === 'success')}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <p>
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 