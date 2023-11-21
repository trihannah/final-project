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

export async function GET(
  request: NextRequest,
): Promise<NextResponse<HabitsResponseBody>> {
  try {
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

    const habits = await getUserHabits(session.userId);
    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<HabitCreateResponseBody>> {
  try {
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

    // user id from the session
    const userId = session.userId;

    // Parse the request body to get the habit data
    const body = await request.json();
    const { habitName, habitDescription, frequency } = body;

    // validation for required fields
    if (!habitName || !habitDescription) {
      return NextResponse.json(
        { error: 'Habit name and description are required.' },
        { status: 400 },
      );
    }

    const habit = await createHabit(
      userId,
      habitName,
      habitDescription,
      frequency,
    );
    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 },
    );
  }
}
