import 'server-only';
import { cache } from 'react';
import { sql } from '../database/connect';

export type Habit = {
  habitId: number;
  userId: number;
  habitName: string;
  habitDescription: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | null;
  completedDates: string[];
};

// Cache the result of the getHabits function
export const getHabits = cache(async () => {
  const habits = await sql<Habit[]>`
    SELECT * FROM habits
  `;
  return habits;
});

// Cache the result of the getUserHabits function
export const getUserHabits = cache(async (user_id: number) => {
  const habits = await sql<Habit[]>`
    SELECT * FROM habits WHERE user_id = ${user_id}
  `;
  return habits;
});

// Cache the result of the getHabitById function
export const getHabitById = cache(async (habit_id: number) => {
  const [habit] = await sql<Habit[]>`
    SELECT * FROM habits WHERE habit_id = ${habit_id}
  `;
  return habit;
});

// Cache the result of the createHabit function
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

// Cache the result of the deleteHabitById function
export const deleteHabitById = cache(async (habit_id: number) => {
  const [habit] = await sql<Habit[]>`
    DELETE FROM habits WHERE habit_id = ${habit_id} RETURNING *
  `;
  return habit;
});

// Cache the result of the updateHabitById function
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
