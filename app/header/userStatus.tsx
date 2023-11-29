'use client';

import { useEffect, useState } from 'react';
import LogoutButton from '../(auth)/logout/LogoutButton';

type Props = {
  session: any;
  username: string;
};

export default function UserStatus({ session, username }: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean>(Boolean(session));

  useEffect(() => {
    setLoggedIn(Boolean(session));
  }, [session]);

  return loggedIn ? (
    <div className="flex space-x-4">
      <a
        href={`/dashboard/${username}`}
        className="bg-custom-green hover:bg-transparent text-white font-semibold hover:text-custom-green py-3 px-6 text-xl border border-transparent hover:border-custom-green rounded-2xl"
      >
        Dashboard
      </a>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex space-x-4">
      <a
        href="/login"
        className="bg-custom-green hover:bg-transparent text-white font-semibold hover:text-custom-green py-3 px-6 text-xl border border-transparent hover:border-custom-green rounded-2xl"
      >
        Login
      </a>
      <a
        href="/register"
        className="bg-transparent hover:bg-custom-green text-custom-green font-semibold hover:text-white py-3 px-6 text-xl border border-custom-green hover:border-transparent rounded-2xl"
      >
        Register
      </a>
    </div>
  );
}
