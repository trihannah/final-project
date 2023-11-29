import { cookies } from 'next/headers';
import Link from 'next/link';
import { getValidSessionByToken } from '../../database/sessions';
import UserStatus from './userStatus';

export default function Header() {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session = sessionTokenCookie
    ? getValidSessionByToken(sessionTokenCookie.value)
    : null;

  return (
    <header className=" text-white p-2 w-full z-50">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl hover:text-gray-600">
          <img src="/images/logo.png" alt="LOGO" className="h-16 md:h-20" />
        </Link>

        <UserStatus session={session} />
      </nav>
    </header>
  );
}
