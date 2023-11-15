'use client';

import { useEffect, useState } from 'react';
import LogoutButton from '../(auth)/logout/LogoutButton';

type Props = {
  session: any;
};

export default function UserStatus({ session }: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean>(Boolean(session));

  useEffect(() => {
    setLoggedIn(Boolean(session));
  }, [session]);

  return loggedIn ? (
    <div className="flex space-x-4">
      <LogoutButton />
    </div>
  ) : (
    <div className="flex space-x-4">
      <a href="/login" className="text-white hover:text-gray-300">
        Login
      </a>
      <a href="/register" className="text-white hover:text-gray-300">
        Register
      </a>
    </div>
  );
}
