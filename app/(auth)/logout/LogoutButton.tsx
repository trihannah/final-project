'use client';

import { redirect } from 'next/navigation';
import React from 'react';
import { logout } from './actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout(); // Assuming logout is an async function
    redirect('/');
  };

  return (
    <form>
      <button
        className="bg-transparent hover:bg-custom-green text-custom-green font-semibold hover:text-white py-3 px-6 text-xl border border-custom-green hover:border-transparent rounded-2xl"
        onClick={handleLogout}
      >
        Logout
      </button>
    </form>
  );
}
