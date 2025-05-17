"use client";

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';
import { AuthState, SignInCredentials, SignUpCredentials, UserProfile } from '@/types/auth';
import { debounce } from 'lodash';
import React from 'react';

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  signIn: (credentials: SignInCredentials) => Promise<{ error: any }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}>({
  state: initialState,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  
  // Use a ref to track if we're already processing an auth state change
  const isProcessingAuthChange = useRef(false);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        console.log("Fetching session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session fetch error:", error);
          throw error;
        }

        if (session) {
          console.log("Session found, fetching profile...", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            
            // If profile doesn't exist, create one
            if (profileError.code === 'PGRST116') {
              console.log("Profile not found, creating minimal profile");
              const minimalProfile = {
                id: session.user.id,
                email: session.user.email || '',
                created_at: new Date().toISOString(),
              };
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([minimalProfile]);
                
              if (insertError) {
                console.error("Failed to create minimal profile:", insertError);
                // Continue without profile data
              } else {
                // Set state with the minimal profile
                setState({
                  session,
                  user: minimalProfile as UserProfile,
                  loading: false,
                  error: null,
                });
                console.log("Auth state updated with minimal profile");
                return;
              }
            }
          } else {
            console.log("Profile data:", profile);
            setState({
              session,
              user: profile as UserProfile,
              loading: false,
              error: null,
            });
            console.log("Auth state updated with profile");
            return;
          }
          
          // If we get here, we have a session but couldn't get/create profile
          // Just update the session part of state
          setState({
            session,
            user: null,
            loading: false,
            error: "Could not load or create profile",
          });
        } else {
          console.log("No session found");
          setState({
            ...initialState,
            loading: false,
          });
        }
      } catch (error: any) {
        console.error("fetchSession error:", error);
        setState({
          ...initialState,
          loading: false,
          error: error.message,
        });
      }
    };

    // Debounce function to prevent multiple rapid auth state changes from causing issues
    const handleAuthChange = debounce(async (event: string, session: any) => {
      // If already processing an auth change, skip
      if (isProcessingAuthChange.current) {
        console.log("Already processing auth change, skipping");
        return;
      }
      
      isProcessingAuthChange.current = true;
      
      try {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session) {
          console.log("Session in auth change, fetching profile...");
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error in auth change:", profileError);
              // If profile doesn't exist, create a minimal one
              if (profileError.code === 'PGRST116') {
                console.log("Profile not found, creating minimal profile");
                const minimalProfile = {
                  id: session.user.id,
                  email: session.user.email || '',
                  created_at: new Date().toISOString(),
                };
                
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([minimalProfile]);
                  
                if (insertError) {
                  console.error("Failed to create minimal profile:", insertError);
                  // Update state with session only if we can't create a profile
                  setState({
                    session,
                    user: null,
                    loading: false,
                    error: "Failed to create user profile"
                  });
                } else {
                  // Use the minimal profile we just created
                  setState({
                    session,
                    user: minimalProfile as UserProfile,
                    loading: false,
                    error: null,
                  });
                  console.log("Minimal profile created and state updated");
                }
              } else {
                // For other profile errors, just update the session
                setState({
                  session,
                  user: null,
                  loading: false,
                  error: profileError.message
                });
              }
            } else {
              console.log("Profile data in auth change:", profile);
              setState({
                session,
                user: profile as UserProfile,
                loading: false,
                error: null,
              });
              console.log("Auth state updated with profile in auth change");
            }
          } catch (error) {
            console.error("Unexpected error in auth change:", error);
            setState({
              session,
              user: null,
              loading: false,
              error: error instanceof Error ? error.message : "Unknown error occurred"
            });
          }
        } else {
          console.log("No session in auth change");
          setState({
            ...initialState,
            loading: false,
          });
        }
      } finally {
        isProcessingAuthChange.current = false;
      }
    }, 300); // Debounce for 300ms

    fetchSessionAndProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      console.log("Sign in attempt for:", email);
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in result:", error ? "Error" : "Success", data?.user?.id);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email not confirmed. Please check your inbox for the confirmation link.');
        } else {
          throw error;
        }
      }
      
      // If we have a user, immediately get their profile data
      if (data?.user) {
        console.log("Getting profile data for user:", data.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error("Failed to fetch profile after login:", profileError);
          // Continue without profile data, onAuthStateChange will try again
        } else {
          console.log("Profile found after login:", profile);
          // Set the state with both session and user profile
          setState({
            session: data.session,
            user: profile as UserProfile,
            loading: false,
            error: null
          });
          console.log("Auth state fully updated with session and profile");
          return { error: null };
        }
      }
      
      // If we don't have profile data, just update session and let onAuthStateChange handle the profile
      console.log("Sign in successful, updating session state only");
      setState(prevState => ({ 
        ...prevState, 
        session: data.session,
        loading: false, 
        error: null 
      }));
      console.log("Session state updated after successful sign in");
      return { error: null };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      setState(prevState => ({ ...prevState, error: error.message, loading: false }));
      return { error };
    }
  };

  const signUp = async ({ email, password, full_name }: SignUpCredentials) => {
    try {
      setState({ ...state, loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Password should be at least')) {
          throw new Error(error.message);
        } else if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please use the login page or reset your password.');
        } else {
          throw error;
        }
      }

      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email,
            full_name,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      return { error: null };
    } catch (error: any) {
      setState({ ...state, error: error.message, loading: false });
      return { error };
    }
  };

  const signOut = async () => {
    setState({ ...state, loading: true });
    await supabase.auth.signOut();
    setState({ ...initialState, loading: false });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      if (!state.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);

      if (error) throw error;

      setState({
        ...state,
        user: { ...state.user, ...data },
        loading: false,
      });

      return { error: null };
    } catch (error: any) {
      setState({ ...state, error: error.message, loading: false });
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 