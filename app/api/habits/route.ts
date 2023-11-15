import { NextRequest, NextResponse } from 'next/server';
import { createHabit, getUserHabits, Habit } from '../../../database/habits';
import { getValidSessionByToken } from '../../../database/sessions';

type HabitsResponseBody = {
  habits?: Habit[];
  error?: string;
};

type HabitCreateResponseBody = {
  habit?: Habit;
  error?: string;
};

// Handle GET requests
export async function GET(
  request: NextRequest,
): Promise<NextResponse<HabitsResponseBody>> {
  try {
    // Authenticate the user
    const sessionTokenCookie = request.cookies.get('sessionToken');
    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const sessionToken = sessionTokenCookie.value;
    const session = await getValidSessionByToken(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 },
      );
    }

    // Fetch habits associated with the authenticated user
    const habits = await getUserHabits(session.userId);
    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 },
    );
  }
}

// Handle POST requests
export async function POST(
  request: NextRequest,
): Promise<NextResponse<HabitCreateResponseBody>> {
  try {
    // Authenticate the user
    const sessionTokenCookie = request.cookies.get('sessionToken');
    if (!sessionTokenCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const sessionToken = sessionTokenCookie.value;
    const session = await getValidSessionByToken(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 },
      );
    }

    // Extract the user id from the session
    const userId = session.userId;

    // Parse the request body to get the habit data
    const body = await request.json();
    const { habitName, habitDescription, frequency } = body;

    // Server-side validation for required fields
    if (!habitName || !habitDescription) {
      return NextResponse.json(
        { error: 'Habit name and description are required.' },
        { status: 400 },
      );
    }

    // Check if frequency is provided and trim it if it is
    const trimmedFrequency = frequency ? frequency.trim() : '';

    // Call createHabit with each argument
    const habit = await createHabit(
      userId,
      habitName.trim(),
      habitDescription.trim(),
      trimmedFrequency,
    );

    if (!habit) {
      return NextResponse.json(
        { error: 'Failed to create habit' },
        { status: 500 },
      );
    }

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 },
    );
  }
}
