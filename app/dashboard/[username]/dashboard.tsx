'use client';
import './heatmap.css';
import 'react-calendar-heatmap/dist/styles.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Habit } from '../../../database/habits';
import { UserProgress } from '../../../database/userProgress';

type HeatmapDataPoint = {
  date: string;
  count: number;
};

type UserProgressExtended = UserProgress & {
  habitName: string;
};

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [journalEntries, setJournalEntries] = useState<
    Record<number, UserProgress[]>
  >({});
  const [currentJournalEntry, setCurrentJournalEntry] = useState<
    Record<number, string>
  >({});
  const [completedToday, setCompletedToday] = useState<Record<number, boolean>>(
    {},
  );
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedHabitForJournal, setSelectedHabitForJournal] =
    useState<Habit | null>(null);
  const [expandedHabit, setExpandedHabit] = useState(null);

  // Function to open journal modal for a specific habit
  const openJournalModal = async (habit: Habit) => {
    setSelectedHabitForJournal(habit);
    setIsJournalModalOpen(true);

    try {
      const response = await fetch(
        `/api/userProgress?habitId=${habit.habitId}`,
      );
      if (!response.ok) throw new Error('Failed to fetch journal entries');

      const responseData = await response.json();
      const entries = responseData.progress; // Accessing the array from the 'progress' key

      if (!Array.isArray(entries)) {
        console.error('Entries is not an array:', entries);
        return;
      }

      setJournalEntries((prevEntries) => ({
        ...prevEntries,
        [habit.habitId]: entries,
      }));
    } catch (fetchError) {
      console.error('Error fetching journal entries:', fetchError);
    }
  };

  // Function to close journal modal
  const closeJournalModal = () => {
    setIsJournalModalOpen(false);
    setSelectedHabitForJournal(null);
  };

  const updateHeatmapWithHabitCreationDates = (habits) => {
    const habitCreationDates = habits.map((habit) => ({
      date: habit.creationDate,
      count: 1,
    }));

    // Combine with existing heatmap data
    const combinedHeatmapData = [...heatmapData, ...habitCreationDates];
    setHeatmapData(combinedHeatmapData);
  };

  const toggleHabit = (habitId) => {
    setExpandedHabit(expandedHabit === habitId ? null : habitId);
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch('/api/habits');
        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }
        const data = await response.json();

        if (Array.isArray(data.habits)) {
          setHabits(data.habits);
          updateHeatmapWithHabitCreationDates(data.habits);
        } else {
          setError('Error fetching habits');
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

  const handleJournalSubmit = async (habitId: number) => {
    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const journalEntry = currentJournalEntry[habitId];
    if (!journalEntry) {
      console.error('Journal entry is empty');
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
        setCurrentJournalEntry((prevEntries) => ({
          ...prevEntries,
          [habitId]: '',
        })); // Clear the textarea after submitting
      }
    } catch (err) {
      console.error('Error caught in handleJournalSubmit:', err);
    }
  };

  const markAsCompleted = (habitId: number) => {
    setCompletedToday({ ...completedToday, [habitId]: true });

    // Here, you can add any additional logic you need to handle
    // when a habit is marked as completed, such as making an API call.
  };

  // Function to render recent journal entries
  const renderRecentJournalEntries = () => {
    // Gather all entries from all habits
    const allEntries: UserProgressExtended[] = [];
    habits.forEach((habit) => {
      const entries = journalEntries[habit.habitId] || [];
      entries.forEach((entry) => {
        allEntries.push({
          ...entry,
          habitName: habit.habitName, // Include the habit name for reference
        });
      });
    });

    // Sort all entries by date and get the top three
    const recentEntries = allEntries
      .sort(
        (a, b) =>
          new Date(b.progressDate).getTime() -
          new Date(a.progressDate).getTime(),
      )
      .slice(0, 3);

    // Render the top three entries
    return recentEntries.map((entry) => (
      <div key={`entry-${entry.progressId}`}>
        <h3>{entry.habitName}</h3>
        <p>
          {new Date(entry.progressDate).toLocaleDateString()}:{' '}
          {entry.progressNote}
        </p>
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
    } catch (updateError) {
      console.error('Error updating habit status:', updateError);
    }
  };

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('/api/userProgress?heatmap=true');
        if (response.ok) {
          const data = await response.json();

          // Assuming the array is under the 'progress' key in the response
          const progressData = data.progress;
          if (!Array.isArray(progressData)) {
            console.error('Progress data is not an array:', progressData);
            return;
          }

          const transformedData = progressData.map((item) => ({
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

    fetchHeatmapData().catch((err) => {
      console.error('Error in fetchHeatmapData:', err);
    });
  }, []);

  // Function to delete a journal entry
  const deleteJournalEntry = async (habitId: number, entryId: number) => {
    try {
      await fetch(`/api/userProgress/${entryId}`, {
        method: 'DELETE',
      });

      // Filter out the deleted entry from the journalEntries state
      setJournalEntries((prevEntries = {}) => ({
        ...prevEntries,
        [habitId]:
          prevEntries[habitId]?.filter(
            (entry) => entry.progressId !== entryId,
          ) ?? [],
      }));
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  // Function to render journal entries modal
  const renderJournalModal = () => {
    if (!isJournalModalOpen || !selectedHabitForJournal) return null;
    const entries = journalEntries[selectedHabitForJournal.habitId];

    if (!Array.isArray(entries)) {
      console.error('Entries is not an array:', entries);
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
        <div className="bg-white rounded-lg shadow-xl p-5 max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">
            {selectedHabitForJournal.habitName} Journal
          </h2>
          <div className="overflow-y-auto max-h-96">
            {entries.map((entry) => (
              <div
                key={`journal-entry-${entry.progressId}`}
                className="mb-4 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.progressDate).toLocaleDateString()}
                  </p>
                  <p>{entry.progressNote}</p>
                </div>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() =>
                    deleteJournalEntry(
                      selectedHabitForJournal.habitId,
                      entry.progressId,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-error mt-4" onClick={closeJournalModal}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 pt-12 mt-24 mb-20">
      <div className="relative">
        {/* Heatmap */}
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return 'color-scale-0';
            }
            if (value.count === 1) {
              return 'color-scale-1';
            }
            if (value.count === 2) {
              return 'color-scale-2';
            }
            return 'color-scale-3';
          }}
        />

        <div className="absolute bottom-0 right-0 p-12">
          <span className="text-6xl font-bold text-custom-green">
            Make Your Year Greener
          </span>
        </div>
      </div>

      {/* Recent Journal Entries Section */}
      <div className="mb-4 mt-10 p-4 bg-yellow-300 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-green-800">
          Recent Activity
        </h2>
        {renderRecentJournalEntries()}
      </div>

      <div className="flex justify-between items-center m-10">
        <h1 className="text-2xl font-bold">Your Habits</h1>
        <Link href="/habits" className="btn btn-primary">
          Go to Habits
        </Link>
      </div>

      {/* List of Habits */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={`habit-${habit.habitId}`}
            className="bg-white shadow rounded-lg p-4"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleHabit(habit.habitId)}
            >
              <h2 className="text-xl font-semibold">{habit.habitName}</h2>
              <span className="text-green-600">
                {expandedHabit === habit.habitId
                  ? 'Hide Details'
                  : 'Show Details'}
              </span>
            </div>

            {expandedHabit === habit.habitId && (
              <div className="flex flex-col md:flex-row mt-2 w-full md:max-w-6xl h-64">
                <div className="flex-1">
                  <p className="text-gray-600">{habit.habitDescription}</p>
                  <p className="text-gray-500">
                    Frequency: {habit.frequency || 'Not specified'}
                  </p>
                </div>

                <div className="bg-yellow-100 rounded p-4 ml-4 w-120">
                  {/* Journal Entry Section */}
                  <textarea
                    className="textarea textarea-bordered w-full bg-white"
                    placeholder="Write your journal entry here..."
                    value={currentJournalEntry[habit.habitId] || ''}
                    onChange={(e) =>
                      setCurrentJournalEntry({
                        ...currentJournalEntry,
                        [habit.habitId]: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-between mt-6">
                    <button
                      className="bg-custom-beige hover:bg-green-600 text-stone-300 font-bold py-1 px-2 text-sm rounded-full mt-24"
                      onClick={() => handleJournalSubmit(habit.habitId)}
                    >
                      Submit Entry
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 text-sm rounded-full mt-24"
                      onClick={() => openJournalModal(habit)}
                    >
                      View Journal Entries
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              className={`btn mt-2 ${
                completedToday[habit.habitId] ? 'btn-success' : 'btn-warning'
              } shadow-lg`}
              onClick={(e) => {
                e.stopPropagation();
                markAsCompleted(habit.habitId);
              }}
              disabled={completedToday[habit.habitId]}
            >
              {completedToday[habit.habitId]
                ? 'Completed Today'
                : 'Mark as Completed'}
            </button>
          </div>
        ))}
      </div>

      {/* Render Journal Modal */}
      {isJournalModalOpen && renderJournalModal()}
    </div>
  );
};

export default Dashboard;
