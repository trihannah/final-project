import { NextRequest, NextResponse } from 'next/server';
import { getUserBySessionToken } from '../../../database/users';
import { User } from '../../../migrations/00000-createTableUsers';

type UserResponseBody = {
  user?: User;
  error?: string;
};

export async function GET(
  req: NextRequest,
): Promise<NextResponse<UserResponseBody>> {
  const sessionTokenCookie = req.cookies.get('sessionToken');
  const sessionToken: string = sessionTokenCookie
    ? sessionTokenCookie.value
    : '';

  if (!sessionToken) {
    return new NextResponse(
      JSON.stringify({ error: 'No session token provided' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  try {
    const user = await getUserBySessionToken(sessionToken);

    if (user) {
      return new NextResponse(JSON.stringify({ user }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid session token' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
