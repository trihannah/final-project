// app/api/userProgress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  createProgress,
  getAggregatedUserProgress,
  getUserProgress,
  UserProgress,
} from '../../../database/userProgress';

// Define types for your response bodies
type UserProgressResponseBodyGet = {
  progress?: UserProgress[]; // Use UserProgress[] for GET response
  error?: string;
};

type UserProgressResponseBodyPost = {
  progress?: UserProgress; // Use UserProgress for POST response
  error?: string;
};

// Handle GET requests
export async function GET(
  req: NextRequest,
): Promise<NextResponse<UserProgressResponseBodyGet>> {
  try {
    const url = new URL(req.url);
    const heatmap = url.searchParams.get('heatmap') === 'true';

    let progress;

    if (heatmap) {
      // Fetch aggregated data for heatmap
      // This would involve writing a new function in your database layer
      // that performs an SQL query to aggregate the progress data by date.
      progress = await getAggregatedUserProgress(); // Implement this function
    } else {
      // Fetch regular user progress data
      progress = await getUserProgress();
    }

    return new NextResponse(JSON.stringify({ progress }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch progress' }),
      { status: 500 },
    );
  }
}

// Handle POST requests
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
