'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'error' | 'success'} | null>(null);
  const [hasResetToken, setHasResetToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the URL contains the access_token parameter
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      setHasResetToken(true);
    } else {
      setMessage({
        text: 'Invalid or missing reset token. Please request a new password reset.',
        type: 'error'
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password.length < 6) {
      setMessage({
        text: 'Password must be at least 6 characters long',
        type: 'error'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({
        text: 'Passwords do not match',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setMessage({
        text: 'Password updated successfully!',
        type: 'success'
      });
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setMessage({
        text: error.message || 'Failed to update password',
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
          <h1 className="text-2xl font-bold">Create New Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below
          </p>
        </div>
        
        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <p>{message.text}</p>
            {!hasResetToken && message.type === 'error' && (
              <div className="mt-2">
                <Link href="/forgot-password" className="text-sm underline">
                  Request a new password reset
                </Link>
              </div>
            )}
          </div>
        )}
        
        {hasResetToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (message?.type === 'success')}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}
        
        <div className="text-center text-sm">
          <p>
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 