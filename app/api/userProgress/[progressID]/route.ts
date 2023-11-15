// app/api/userProgress/[progressId]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteUserProgressById } from '../../../../database/userProgress';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { progressId } = req.query;

  if (req.method === 'DELETE') {
    const progress = await deleteUserProgressById(Number(progressId));
    res.status(200).json(progress);
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
