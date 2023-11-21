// app/api/habits/[habitId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  deleteHabitById,
  getHabitById,
  Habit,
  updateHabitById,
} from '../../../../database/habits';

type HabitResponseBody = {
  habit?: Habit;
  error?: string;
};

// Function to handle GET requests
export async function GET(
  request: NextRequest,
): Promise<NextResponse<HabitResponseBody>> {
  const habitId = request.nextUrl.pathname.split('/').pop();

  if (!habitId) {
    return NextResponse.json(
      { error: 'Habit ID is required' },
      { status: 400 },
    );
  }

  const habit = await getHabitById(Number(habitId));
  return habit
    ? NextResponse.json({ habit })
    : NextResponse.json({ error: 'Habit not found' }, { status: 404 });
}

// Function to handle DELETE requests
export async function DELETE(
  request: NextRequest,
): Promise<NextResponse<null>> {
  const habitId = request.nextUrl.pathname.split('/').pop();

  if (!habitId) {
    return new NextResponse(JSON.stringify({ error: 'Habit ID is required' }), {
      status: 400,
    });
  }

  await deleteHabitById(Number(habitId));
  return new NextResponse(null, { status: 204 });
}

// Function to handle PUT requests
export async function PUT(
  request: NextRequest,
): Promise<NextResponse<HabitResponseBody>> {
  const habitId = request.nextUrl.pathname.split('/').pop();

  if (!habitId) {
    return NextResponse.json(
      { error: 'Habit ID is required' },
      { status: 400 },
    );
  }

  const body = await request.json();
  const { habitName, habitDescription, frequency } = body;

  const updatedHabit = await updateHabitById(
    Number(habitId),
    habitName,
    habitDescription,
    frequency,
  );

  return updatedHabit
    ? NextResponse.json({ habit: updatedHabit })
    : NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
}
