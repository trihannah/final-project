import 'server-only';
import { cache } from 'react';
import { sql } from '../database/connect';

export type UserProgress = {
  progressId: number;
  userId: number;
  habitId: number;
  progressDate: Date;
  progressNote?: string;
};

export type AggregatedUserProgress = {
  progressDate: Date;
  completionCount: number;
};

export const getUserProgress = cache(async () => {
  const progress = await sql<UserProgress[]>`
    SELECT * FROM user_progress
  `;
  return progress;
});

export const getUserProgressByHabitId = cache(
  async (habitId: number): Promise<UserProgress[]> => {
    const progress = await sql<UserProgress[]>`
    SELECT * FROM user_progress
    WHERE habit_id = ${habitId}
  `;
    return progress;
  },
);

export const createProgress = async (
  user_id: number,
  habit_id: number,
  progress_note: string,
) => {
  const [progress] = await sql<UserProgress[]>`
  INSERT INTO user_progress (user_id, habit_id, progress_note)
  VALUES (${user_id}, ${habit_id}, ${progress_note})
  RETURNING *
`;

  return progress;
};

export const deleteUserProgressById = cache(async (progress_id: number) => {
  const [progress] = await sql<UserProgress[]>`
    DELETE FROM user_progress WHERE progress_id = ${progress_id} RETURNING *
  `;
  return progress;
});

export const deleteProgress = async (progressId: number): Promise<void> => {
  await sql`
    DELETE FROM user_progress
    WHERE progress_id = ${progressId}
  `;
};

export const getAggregatedUserProgress = cache(
  async (): Promise<AggregatedUserProgress[]> => {
    const aggregatedProgress = await sql<AggregatedUserProgress[]>`
    SELECT progress_date, COUNT(*) AS completion_count
    FROM user_progress
    GROUP BY progress_date
  `;
    return aggregatedProgress;
  },
);
