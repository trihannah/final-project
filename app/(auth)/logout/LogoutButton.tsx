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
      <button className="logoutButton" onClick={handleLogout}>
        Logout{' '}
      </button>
    </form>
  );
}
