// app/api/habits/[habitId]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteHabitById,
  getHabitById,
  updateHabitById,
} from '../../../../database/habits';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { habitId } = req.query;

  if (req.method === 'GET') {
    const habit = await getHabitById(Number(habitId));
    if (habit) {
      res.status(200).json(habit);
    } else {
      res.status(404).end(`Habit not found`);
    }
  } else if (req.method === 'PUT') {
    const { habitName, habitDescription, frequency } = req.body;
    const habit = await updateHabitById(
      Number(habitId),
      habitName,
      habitDescription,
      frequency,
    );
    res.status(200).json(habit);
  } else if (req.method === 'DELETE') {
    const habit = await deleteHabitById(Number(habitId));
    res.status(200).json(habit);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
