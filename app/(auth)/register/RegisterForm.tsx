'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data: RegisterResponseBodyPost = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }

    router.push(`/profile/${data.user.username}`);

    // revalidatePath() throws unnecessary error, will be used when stable
    // revalidatePath('/(auth)/login', 'page');
    router.refresh();
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={async (event) => await handleRegister(event)}
        className="flex flex-col justify-between p-4 max-w-md w-full mx-4 my-10 bg-white shadow-md rounded"
        style={{ minHeight: '40vh' }}
      >
        <div className="flex-grow space-y-10">
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
          <button className="bg-green-700 text-white font-bold py-2 px-4 rounded hover:bg-green-900 transition-colors w-full">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
