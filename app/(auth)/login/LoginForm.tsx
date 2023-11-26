'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import { LoginResponseBodyPost } from '../../api/(auth)/login/route';

type Props = { returnTo?: string | string[] };

export default function LoginForm(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const data: LoginResponseBodyPost = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }

        router.push(
          getSafeReturnToPath(props.returnTo) ||
            `/dashboard/${data.user.username}`,
        );

        router.refresh();
      } else {
        throw new Error('Response was not in JSON format');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ message: 'Login failed. Please try again.' }]);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={async (event) => await handleRegister(event)}
        className="flex flex-col justify-between p-4 max-w-md w-full mx-4 my-10 bg-white shadow-md rounded"
        style={{ minHeight: '40vh' }}
      >
        <div className="flex-grow space-y-10">
          {' '}
          {/* Increase space-y-6 for more space and flex-grow to push the button down */}
          <label className="font-bold mb-2">
            Username
            <input
              className="border-2 border-gray-300 rounded p-2 w-full"
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </label>
          <label className="font-bold mb-2">
            Password
            <input
              type="password"
              className="border-2 border-gray-300 rounded p-2 w-full"
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>
          {errors.map((error) => (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              key={`error-${error.message}`}
            >
              Error: {error.message}
            </div>
          ))}
        </div>

        <div>
          {' '}
          {/* This div remains unchanged, holding the button at the bottom */}
          <button className="bg-green-700 text-white font-bold py-2 px-4 rounded hover:bg-green-900 transition-colors w-full">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
