import { NextRequest, NextResponse } from 'next/server';
import { deleteProgress } from '../../../../database/userProgress';

export async function DELETE(req: NextRequest): Promise<NextResponse<null>> {
  try {
    const progressId = req.nextUrl.pathname.split('/').pop();

    if (!progressId) {
      return new NextResponse(
        JSON.stringify({ error: 'Progress ID is required' }),
        { status: 400 },
      );
    }

    // delete the journal entry from database
    await deleteProgress(parseInt(progressId));

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete progress' }),
      { status: 500 },
    );
  }
}
