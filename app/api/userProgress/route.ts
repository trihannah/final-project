import { NextRequest, NextResponse } from 'next/server';
import {
  createProgress,
  deleteProgress,
  getAggregatedUserProgress,
  getUserProgress,
  getUserProgressByHabitId,
  UserProgress,
} from '../../../database/userProgress';

type UserProgressResponseBodyGet = {
  progress?: UserProgress[];
  error?: string;
};

type UserProgressResponseBodyPost = {
  progress?: UserProgress;
  error?: string;
};

export async function GET(
  req: NextRequest,
): Promise<NextResponse<UserProgressResponseBodyGet>> {
  try {
    const url = new URL(req.url);
    const heatmap = url.searchParams.get('heatmap') === 'true';
    const habitId = url.searchParams.get('habitId');

    let progress;

    if (heatmap) {
      // Fetch aggregated data for heatmap
      progress = await getAggregatedUserProgress();
    } else if (habitId) {
      // Fetch journal entries for a specific habit
      progress = await getUserProgressByHabitId(parseInt(habitId));
    } else {
      progress = await getUserProgress();
    }

    return new NextResponse(JSON.stringify({ progress }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch progress' }),
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<UserProgressResponseBodyPost>> {
  try {
    const body = await req.json();
    const { userId, habitId, progressNote } = body;

    const progress = await createProgress(userId, habitId, progressNote);
    return new NextResponse(JSON.stringify({ progress }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create progress' }),
      { status: 500 },
    );
  }
}
