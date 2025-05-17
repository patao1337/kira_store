import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, state } = useAuth();
  const router = useRouter();

  // Function to resend confirmation email
  const handleResendConfirmation = async () => {
    setIsLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    setIsLoading(false);
    
    if (error) {
      setError(`Failed to resend confirmation: ${error.message}`);
    } else {
      setError('Confirmation email sent! Please check your inbox.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check if we already have a session - if so, just redirect without another login attempt
    if (state.session) {
      console.log("Login form detected existing session, redirecting to account page");
      router.push('/account');
      return;
    }
    
    console.log("Login form submission with email:", email);
    const { error } = await signIn({ email, password });
    console.log("Login form got sign-in result:", error ? "Error" : "Success");
    
    if (!error) {
      console.log("Login successful, redirecting to account page");
      // Use setTimeout to ensure state updates have time to propagate
      // before attempting the redirect
      setTimeout(() => {
        router.push('/account');
      }, 500); // Increased timeout to allow for state updates
    } else {
      console.log("Login error:", error.message);
      // Check for specific error messages
      if (error.message?.includes('Email not confirmed')) {
        setError('Email not confirmed. Please check your inbox for the confirmation link or click below to resend.');
      } else {
        setError(error.message || 'Failed to sign in');
      }
      setIsLoading(false);
    }
    
    console.log("Login form submission completed");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login to ki•ra</h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email and password to access your account
        </p>
      </div>
      
      {error && (
        <div className={`p-3 rounded-md ${error.includes('Confirmation email sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <p>{error}</p>
          {error.includes('Email not confirmed') && (
            <button 
              onClick={handleResendConfirmation}
              className="text-sm font-medium underline mt-1"
              disabled={isLoading}
            >
              Resend confirmation email
            </button>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
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
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
} 