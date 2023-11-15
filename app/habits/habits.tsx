'use client';
import React, { useEffect, useState } from 'react';
import { Habit } from '../../database/habits';

type NewHabit = {
  name: string;
  description: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
};

type FetchError = {
  message: string;
};

function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<NewHabit>({
    name: '',
    description: '',
    frequency: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHabits() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/habits');
        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }
        const habitsData = await response.json();
        if (!Array.isArray(habitsData.habits)) {
          throw new TypeError('Fetched data is not an array');
        }
        console.log('Fetched habits data:', habitsData.habits);
        setHabits(habitsData.habits);
      } catch (catchError: unknown) {
        // Changed to catchError for consistency
        if (catchError instanceof Error) {
          console.error('Error caught in handleAddHabit:', catchError);
          setError({
            message: catchError.message || 'Failed to add new habit',
          });
        } else {
          setError({ message: 'An unexpected error occurred' });
        }
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    }

    fetchHabits().catch((catchError) => {
      console.error('Failed to fetch habits', catchError);
      setError({
        message:
          catchError instanceof Error
            ? catchError.message
            : 'An unexpected error occurred',
      });
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
        } else {
          setError({ message: 'Could not get user information' });
        }
      } catch (catchError: unknown) {
        // Renamed to catchError
        if (catchError instanceof Error) {
          setError({
            message: catchError.message || 'Failed to fetch user data',
          });
        } else {
          setError({ message: 'An unexpected error occurred' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser().catch((catchError) => {
      console.error('Failed to fetch user data', catchError);
      setError({
        message:
          catchError instanceof Error
            ? catchError.message
            : 'Could not get user information',
      });
    });
  }, []);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const habitData = {
      user_Id: userId,
      habitName: newHabit.name,
      habitDescription: newHabit.description,
      frequency: newHabit.frequency || null,
    };

    try {
      console.log('Sending habit data to server:', habitData);
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Error response from server:', errorResponse);
        throw new Error('Failed to create habit');
      } else {
        const createdHabit = await response.json();
        console.log('Habit created successfully:', createdHabit);
        setHabits([...habits, createdHabit]);
      }
    } catch (err: any) {
      console.error('Error caught in handleAddHabit:', err);
      setError({ message: err.message || 'Failed to add new habit' });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-black mb-6">My Habits</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white mb-8 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
      >
        Add New Habit
      </button>
      <ul className="w-full md:w-1/2 space-y-4">
        {habits.map((habit) => (
          <li
            key={`habit-${habit.habitId}`}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold text-black">
              {habit.habitName}
            </h3>
            <p className="text-gray-700">{habit.habitDescription}</p>
            <p className="text-sm text-green-700">
              Frequency: {habit.frequency || 'Not specified'}
            </p>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="modal-box bg-white rounded-lg shadow-xl w-full md:max-w-3xl mx-auto p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-black bg-transparent hover:bg-gray-200 rounded-lg text-lg p-2"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-center text-black mb-4">
              Add a new habit
            </h3>

            <form onSubmit={handleAddHabit} className="space-y-6 px-6 pb-4">
              {/* Habit Name Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="habitName"
                  className="block text-green-700 text-sm font-bold mb-2"
                >
                  Habit Name
                </label>
                <input
                  id="habitName"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  required
                  className="input input-bordered w-full p-2"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="habitDescription"
                  className="block text-green-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <input
                  id="habitDescription"
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                  required
                  className="input input-bordered w-full p-2"
                />
              </div>

              {/* Frequency Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="habitFrequency"
                  className="block text-green-700 text-sm font-bold mb-2"
                >
                  Frequency
                </label>
                <select
                  id="habitFrequency"
                  value={newHabit.frequency || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewHabit({
                      ...newHabit,
                      frequency:
                        value === 'daily' ||
                        value === 'weekly' ||
                        value === 'monthly'
                          ? value
                          : undefined,
                    });
                  }}
                  className="select select-bordered w-full p-2"
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50">
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;
