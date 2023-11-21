import 'server-only';
import { cache } from 'react';
import { sql } from '../database/connect';

export type Habit = {
  habitId: number;
  userId: number;
  habitName: string;
  habitDescription: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | null;
  creationDate: Date;
  completedDates: (string | null)[];
};

export const getHabits = cache(async () => {
  const habits = await sql<Habit[]>`
    SELECT h.*, array_agg(up.progress_date) as completedDates
    FROM habits h
    LEFT JOIN user_progress up ON h.habit_id = up.habit_id
    GROUP BY h.habit_id
  `;
  return habits.map((habit) => ({
    ...habit,
    completedDates: habit.completedDates.filter((date) => date != null),
  }));
});

export const getUserHabits = cache(async (user_id: number) => {
  const habits = await sql<Habit[]>`
    SELECT * FROM habits WHERE user_id = ${user_id}
  `;
  return habits;
});

export const getHabitById = cache(async (habit_id: number) => {
  const [habit] = await sql<Habit[]>`
    SELECT * FROM habits WHERE habit_id = ${habit_id}
  `;
  return habit;
});

export const createHabit = cache(
  async (
    userId: number,
    habitName: string,
    habitDescription: string,
    frequency: 'daily' | 'weekly' | 'monthly' | null,
  ) => {
    const [habit] = await sql<Habit[]>`
      INSERT INTO habits (user_id, habit_name, habit_description, frequency)
      VALUES (${userId}, ${habitName}, ${habitDescription}, ${frequency})
      RETURNING *
    `;
    return habit;
  },
);

export const deleteHabitById = async (habit_id: number) => {
  const [habit] = await sql<Habit[]>`
    DELETE FROM habits WHERE habit_id = ${habit_id} RETURNING *
  `;
  return habit;
};

export const updateHabitById = cache(
  async (
    habitId: number,
    habitName: string,
    habitDescription: string,
    frequency: 'daily' | 'weekly' | 'monthly' | null,
  ) => {
    const [habit] = await sql<Habit[]>`
      UPDATE habits
      SET habit_name = ${habitName}, habit_description = ${habitDescription}, frequency = ${frequency}
      WHERE habit_id = ${habitId}
      RETURNING *
    `;
    return habit;
  },
);
