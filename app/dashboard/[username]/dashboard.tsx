'use client';
import 'react-calendar-heatmap/dist/styles.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Habit } from '../../../database/habits';

type HeatmapDataPoint = {
  date: string;
  count: number;
};

type FetchedHeatmapData = {
  progressDate: string;
  completionCount: number;
};

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<{
    [key: number]: string;
  }>({});
  const [selectedDates, setSelectedDates] = useState<{
    [key: number]: string[];
  }>({});
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const startDate = new Date(`2023-01-01`);
  const endDate = new Date(`2023-12-31`);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        const data = await response.json();

        // Log the fetched habits data
        console.log('Fetched habits data:', data.habits);

        if (response.ok) {
          setHabits(data.habits);
        } else {
          setError(data.error || 'Error fetching habits');
        }
      } catch (err) {
        setError('Failed to fetch habits');
      }
    };

    fetchHabits().catch(() => {
      setError('Failed to fetch habits');
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        if (response.ok && userData.user) {
          setUserId(userData.user.id);
        } else {
          console.error('Error fetching user:', userData.error);
        }
      } catch (fetchError) {
        console.error('Error fetching user data:', fetchError);
      }
    };

    fetchUser().catch((fetchError) => {
      console.error('Error fetching user data:', fetchError);
    });
  }, []);

  const handleJournalSubmit = async (habitId: number, journalEntry: string) => {
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const progressData = {
      userId,
      habitId,
      progressNote: journalEntry,
    };

    try {
      const response = await fetch('/api/userProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Error response from server:', errorResponse);
        throw new Error('Failed to save progress');
      } else {
        console.log('Progress saved successfully');
        setJournalEntries({ ...journalEntries, [habitId]: '' }); // Clear the textarea after submitting
      }
    } catch (err) {
      console.error('Error caught in handleJournalSubmit:', err);
    }
  };

  const handleDateSelection = (habitId: number, date: string) => {
    const updatedDates = { ...selectedDates };

    // Check if the date is already included, if undefined, treat as empty array
    const isDateIncluded = updatedDates[habitId]?.includes(date) ?? false;

    if (isDateIncluded) {
      // If the date is included, filter it out
      updatedDates[habitId] =
        updatedDates[habitId]?.filter((d) => d !== date) ?? [];
    } else {
      // If the date is not included, add it
      // Ensure we're working with an array
      const currentDates = updatedDates[habitId] ?? [];
      updatedDates[habitId] = [...currentDates, date];
    }

    setSelectedDates(updatedDates);
  };

  // Function to render recent journal entries
  const renderRecentJournalEntries = () => {
    return habits.map((habit) => (
      <div key={`habit-${habit.habitId}`}>
        <h3>{habit.habitName}</h3>
        <p>{journalEntries[habit.habitId]}</p>
      </div>
    ));
  };

  const handleSubmit = async (habitId: number) => {
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    // Example implementation
    try {
      // Call an API to update the habit's status
      // Or perform any other action related to the habit
      const response = await fetch('/api/updateHabitStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, habitId, newStatus: 'completed' }), // for example
      });

      if (!response.ok) {
        throw new Error('Failed to update habit status');
      }

      // Handle successful update
      console.log('Habit status updated successfully');
      // Optionally, update the local state to reflect the change
    } catch (error) {
      console.error('Error updating habit status:', error);
    }
  };

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('/api/userProgress?heatmap=true');
        if (response.ok) {
          const data: FetchedHeatmapData[] = await response.json();
          const transformedData = data.map((item) => ({
            date: item.progressDate,
            count: item.completionCount,
          }));
          setHeatmapData(transformedData);
        } else {
          console.error('Non-OK response from server');
        }
      } catch (fetchError) {
        console.error('Error fetching heatmap data:', fetchError);
      }
    };

    fetchHeatmapData().catch((fetchError) => {
      console.error('Error fetching heatmap data:', fetchError);
    });
  }, []);

  return (
    <div className="container mx-auto p-4 pt-12 mt-7">
      <h1 className="text-2xl font-bold mb-4">Your Habits</h1>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${value.count}`;
        }}
      />

      <div className="mb-4 p-4 bg-green-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Recent Activity
        </h2>
        {renderRecentJournalEntries()}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <Link href="/habits" className="btn btn-primary">
          Go to Habits
        </Link>
      </div>

      <ul className="space-y-4">
        {habits.map((habit) => (
          <li
            key={`habit-${habit.habitId}`}
            className="p-4 bg-white shadow rounded-lg"
          >
            <h2 className="text-xl font-semibold">{habit.habitName}</h2>
            <p className="text-gray-600">{habit.habitDescription}</p>
            <p className="text-gray-500">
              Frequency: {habit.frequency || 'Not specified'}
            </p>

            <textarea
              className="textarea textarea-bordered w-full mt-2"
              placeholder="Write your journal entry here..."
              value={journalEntries[habit.habitId] || ''}
              onChange={(e) =>
                setJournalEntries({
                  ...journalEntries,
                  [habit.habitId]: e.target.value,
                })
              }
            />
            <button
              className="btn btn-primary mt-2"
              onClick={() =>
                handleJournalSubmit(
                  habit.habitId,
                  journalEntries[habit.habitId] || '',
                )
              }
            >
              Submit Entry
            </button>

            <div className="flex space-x-2 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <label
                  key={`day-${day}`}
                  className="flex items-center space-x-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedDates[habit.habitId]?.includes(day)}
                    onChange={() => handleDateSelection(habit.habitId, day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => handleSubmit(habit.habitId)}
            >
              Save Progress
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
