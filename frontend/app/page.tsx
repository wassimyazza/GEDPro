'use client';

// Homepage
// Redirects to login or dashboard based on authentication status

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">GEDPro</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
