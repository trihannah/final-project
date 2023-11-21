'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LandingPageContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const titleClass = 'text-6xl mb-4 font-bold';
  const subTitleClass = 'text-2xl font-semibold mt-4';
  const handleDashboardClick = () => {
    router.push(`/dashboard/[username]`);
  };
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(!!data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus().catch((error) => {
      console.error('Error checking login status:', error);
    });
  }, []);

  if (isLoggedIn) {
    return (
      <div className="w-1/2 bg-custom-beige p-12 flex flex-col justify-center items-center text-center text-custom-green">
        <h1 className={titleClass}>Welcome Back</h1>
        <button onClick={handleDashboardClick} className="btn btn-primary mb-3">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-custom-beige p-12 flex flex-col justify-center items-center text-center text-custom-green">
      <h1 className={titleClass}>Get Started</h1>
      <Link href="/register" passHref className="btn btn-primary mb-3">
        Sign Up
      </Link>
      <h3 className={subTitleClass}>Already have an account?</h3>
      <Link href="/login" passHref className="btn btn-secondary mt-3">
        Login
      </Link>
    </div>
  );
};

export default LandingPageContent;
