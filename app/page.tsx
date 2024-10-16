"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="text-center">
        <h1 className="text-6xl font-bold mb-8 text-blue-600 dark:text-blue-400">
          Welcome to Our Service Booking Platform
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Connect with top-notch service providers in your area. Book appointments easily and manage your services effortlessly.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}