'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSlider from '@/components/dashboard/MoodSlider';
import SleepInput from '@/components/dashboard/SleepInput';
import JournalEditor from '@/components/dashboard/JournalEditor';
import MedicationInput from '@/components/dashboard/MedicationInput';
import SubmitButton from '@/components/dashboard/SubmitButton';
import AIResponseCard from '@/components/dashboard/AIResponseCard';

export default function Dashboard() {
  const [name] = useState('Ahmed');
  const [today] = useState(new Date());
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [journal, setJournal] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [aiResponse, setAIResponse] = useState<{
    summary: string;
    suggestion: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!mood || !sleep || journal.trim() === '') return;
    setIsSubmitting(true);

    setTimeout(() => {
      setAIResponse({
        summary: `Mood: ${mood}/5 · Sleep: ${sleep} hrs`,
        suggestion: `Try some sunlight or a short walk!`,
      });
      setEntrySubmitted(true);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-8">MindfulTrack</h1>
          <ul className="space-y-4 text-gray-600">
            <li className="font-semibold text-blue-600">📅 Calendar (soon)</li>
            <li>📊 Trends (soon)</li>
            <li>🧘 Resources (soon)</li>
          </ul>
        </div>
        <p className="text-xs text-gray-400 mt-10">© 2025 MindfulTrack</p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center w-full md:w-auto">
            <p className="text-sm text-gray-500">
              {today.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">Welcome back, {name}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-800 shadow">
            {name.charAt(0)}
          </div>
        </div>

        {/* Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {!entrySubmitted ? (
            <>
              <motion.div
                className="bg-white rounded-xl p-5 shadow"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <MoodSlider onChange={setMood} />
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-5 shadow"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <SleepInput onChange={setSleep} />
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-5 shadow md:col-span-2"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <MedicationInput onChange={setMedications} />
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-5 shadow md:col-span-2"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <JournalEditor onChange={setJournal} />
              </motion.div>

              <motion.div
                className="md:col-span-2"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <SubmitButton
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!mood || !sleep || journal.trim() === ''}
                />
              </motion.div>
            </>
          ) : (
            <motion.div
              className="bg-white rounded-xl p-5 shadow md:col-span-2 text-center"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Today's Summary</h3>
              <p>Mood: {mood} / 5</p>
              <p>Sleep: {sleep} hrs</p>
              <p>Journal: Submitted</p>
              <p>Medications: {medications.length > 0 ? '✔️ Taken' : '—'}</p>
            </motion.div>
          )}

          {/* AI Card */}
          <AnimatePresence>
            {aiResponse && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="md:col-span-2"
              >
                <AIResponseCard
                  summary={aiResponse.summary}
                  suggestion={aiResponse.suggestion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
