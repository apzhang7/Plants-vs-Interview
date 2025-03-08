"use client"; 

import { SignedIn, SignedOut, UserButton, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function ClientUserInfo() {
  const { user } = useUser(); // Now you can safely use useUser in this client component

  return (
    <div className="flex gap-4">
      <SignedIn>
        <span className="text-sm font-medium text-gray-700">
          Welcome back, {user?.firstName || 'User'}!
        </span>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm font-medium text-gray-700 hover:text-green-600">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="text-sm font-medium text-gray-700 hover:text-green-600">
            Sign up
          </button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}
