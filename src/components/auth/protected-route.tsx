import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [waitingForProfile, setWaitingForProfile] = useState(false);
  const [waitTimer, setWaitTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("Protected route state:", 
      "loading:", state.loading, 
      "user:", state.user ? "exists" : "null",
      "session:", state.session ? "exists" : "null"
    );
    
    // If we have a session but no user yet, set a timeout to wait for profile
    if (state.session && !state.user && !waitingForProfile) {
      setWaitingForProfile(true);
      console.log("Protected route has session but waiting for profile data");
      
      // Set a timeout to eventually redirect if profile doesn't load
      const timer = setTimeout(() => {
        if (!state.user) {
          console.log("Profile load timed out after 5 seconds, redirecting to login");
          setRedirecting(true);
          router.push('/login?error=profile_load_timeout');
        }
      }, 5000); // Wait 5 seconds maximum for profile
      
      setWaitTimer(timer);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    
    // Clear timer if user is loaded
    if (state.user && waitTimer) {
      clearTimeout(waitTimer);
      setWaitTimer(null);
      setWaitingForProfile(false);
    }
    
    // Don't redirect multiple times and only redirect when we're sure there's no session
    if (!redirecting && !state.loading && !state.user && !state.session) {
      console.log("No user found and not loading, redirecting to login");
      setRedirecting(true);
      router.push('/login');
    }
  }, [state.loading, state.user, state.session, router, redirecting, waitingForProfile, waitTimer]);

  // If we have a session but no user profile yet, show a more specific loading message
  if ((state.session && !state.user) || waitingForProfile) {
    console.log("Protected route has session but no profile yet or waiting");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (state.loading) {
    console.log("Protected route is loading");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    console.log("Protected route: No user, returning null");
    return null;
  }

  console.log("Protected route: User found, rendering children");
  return <>{children}</>;
} 