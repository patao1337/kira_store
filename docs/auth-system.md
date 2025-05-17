# Authentication System Documentation

## Overview

This document explains the authentication system implemented for the KI•RA e-commerce platform. The authentication is built using Supabase for backend services and Next.js for the frontend.

## Features

- User registration with email and password
- User login with email and password
- Email confirmation flow with resend functionality
- Password reset functionality
- Comprehensive error handling and user feedback
- Protected routes for authenticated users
- User profile management (update profile information)
- Avatar upload and management

## Technology Stack

- **Frontend**: Next.js, React
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Context API for auth state

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run the SQL schema in `supabase/schema.sql` in the Supabase SQL Editor to set up your tables and policies

## Database Schema

The authentication system uses the following table structure:

### Profiles Table

| Column      | Type               | Description                              |
|-------------|-------------------|------------------------------------------|
| id          | UUID (Primary Key) | References auth.users.id                 |
| email       | TEXT               | User's email address                     |
| full_name   | TEXT               | User's full name                         |
| username    | TEXT               | User's chosen username                   |
| avatar_url  | TEXT               | URL to user's profile picture            |
| phone       | TEXT               | User's phone number                      |
| address     | TEXT               | User's address                           |
| created_at  | TIMESTAMP          | When the profile was created             |
| updated_at  | TIMESTAMP          | When the profile was last updated        |

## Routes

- `/login` - User login page
- `/register` - User registration page
- `/account` - Protected user account management page
- `/auth-error` - Handles authentication errors (expired links, etc.)
- `/forgot-password` - Allows users to request a password reset
- `/reset-password` - Allows users to set a new password after reset

## User Authentication Flow

1. **Registration**:
   - User fills out registration form
   - On successful registration, user is informed to check email for confirmation
   - Confirmation email is sent via Supabase

2. **Email Confirmation**:
   - User clicks the confirmation link in their email
   - If link is valid, user is redirected to login page
   - If link is expired, user is redirected to auth-error page to request a new one

3. **Login**:
   - User attempts to login with email/password
   - If email is not confirmed, user is notified and offered to resend confirmation
   - If credentials are correct and email is confirmed, user is logged in

4. **Password Reset**:
   - User requests password reset on forgot-password page
   - User receives email with reset link
   - Link redirects to reset-password page where user can set a new password
   - After successful reset, user is redirected to login page

5. **Error Handling**:
   - Specific error messages for common issues (invalid credentials, unconfirmed email)
   - Option to resend confirmation emails when needed
   - Dedicated page for handling authentication errors from URL parameters

## Components

- `LoginForm` - Handles user login with error displays
- `RegisterForm` - Handles user registration with success/error messages
- `AccountForm` - Manages user profile information
- `ProtectedRoute` - Higher-order component to protect routes
- `AuthProvider` - Provides authentication context to the application
- `AuthErrorPage` - Handles expired verification links and other auth errors
- `ForgotPasswordPage` - Handles requests for password resets
- `ResetPasswordPage` - Handles password reset process

## Usage

### Authentication Hook

```jsx
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { state, signIn, signUp, signOut, updateProfile } = useAuth();
  
  // Use auth methods and state as needed
  // state.user - Current user object or null
  // state.loading - Whether auth is being checked
  // state.error - Any auth errors
}
```

### Protected Routes

To protect a route from unauthenticated access:

```jsx
import ProtectedRoute from '@/components/auth/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Error Handling Examples

```jsx
// Handle unconfirmed email in login form
if (error.message?.includes('Email not confirmed')) {
  setError('Email not confirmed. Please check your inbox for the confirmation link or click below to resend.');
}

// Resend confirmation email
const { error } = await supabase.auth.resend({
  type: 'signup',
  email,
});
```

### Password Reset Example

```jsx
// Request password reset
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});

// Update password
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

## Security Considerations

- Row Level Security (RLS) is enabled on the profiles table
- Users can only access and modify their own profile information
- File uploads are restricted to authorized users
- Email confirmation required before login
- Secure password reset flow with email verification

## Future Enhancements

- Social login (Google, Facebook, etc.)
- Two-factor authentication 