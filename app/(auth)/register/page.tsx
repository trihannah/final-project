import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  // add redirect to home if user is logged in
  // check sessionToken cookie
  const sessionTokenCookie = cookies().get('sessionToken');
  // check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // if sessionToken cookie is valid, redirect to home

  if (session) redirect('/');
  // If sessionToken cookie is invalid or doesn't exist, -> login form

  return (
    <div className="min-h-screen bg-gradient-to-tr from-custom-beige to-gray-200">
      <RegisterForm />
    </div>
  );
}
