'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSlider from '@/components/dashboard/MoodSlider';
import SleepInput from '@/components/dashboard/SleepInput';
import JournalEditor from '@/components/dashboard/JournalEditor';
import MedicationInput from '@/components/dashboard/MedicationInput';
import SubmitButton from '@/components/dashboard/SubmitButton';
import AIResponseCard from '@/components/dashboard/AIResponseCard';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<string>(''); // Supabase Auth UID
  const [today] = useState(new Date());
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [journal, setJournal] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [aiResponse, setAIResponse] = useState<{ summary: string; suggestion: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id, name')
        .eq('id', user.id) // CORRECT RELATION: match UUID
        .single();

      if (!userData) return;

      setName(userData.name);
      setUserId(userData.id); // UUID-based user id

      // Today's UTC range
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);

      const { data: todayLog } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('user_id', userData.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (todayLog) {
        setMood(todayLog.mood);
        setSleep(todayLog.sleep);
        setJournal(todayLog.journal);
        setMedications(todayLog.medications || []);
        setEntrySubmitted(true);
        setAIResponse({
          summary: `Mood: ${todayLog.mood}/5 · Sleep: ${todayLog.sleep} hrs`,
          suggestion: todayLog.suggestion || 'Take care today!',
        });
      } else {
        setMood(3);
        setSleep(0);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!mood || !sleep || journal.trim() === '') return;
    setIsSubmitting(true);

    const now = new Date().toISOString();

    const { error } = await supabase.from('login_sessions').insert({
      user_id: userId,
      mood,
      sleep,
      journal,
      medications,
      created_at: now,
    });

    if (!error) {
      setAIResponse({
        summary: `Mood: ${mood}/5 · Sleep: ${sleep} hrs`,
        suggestion: `Try some sunlight or a short walk!`,
      });
      setEntrySubmitted(true);
    }

    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center w-full md:w-auto">
            <p className="text-sm text-gray-500">
              {today.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
              Welcome back, {name}
            </h2>
          </div>

          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-800 shadow hover:bg-blue-300"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {name.slice(0, 2).toUpperCase()}
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-40 text-sm">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  Logout
                </button>
                <button
                  disabled
                  className="block w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed"
                >
                  Delete Account (coming soon)
                </button>
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {!entrySubmitted ? (
            <>
              <motion.div className="bg-white rounded-xl p-5 shadow" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <MoodSlider onChange={setMood} defaultValue={mood ?? 3} />
              </motion.div>

              <motion.div className="bg-white rounded-xl p-5 shadow" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <SleepInput onChange={setSleep} defaultValue={sleep ?? 0} />
              </motion.div>

              <motion.div className="bg-white rounded-xl p-5 shadow md:col-span-2" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <MedicationInput onChange={setMedications} defaultValue={medications} />
              </motion.div>

              <motion.div className="bg-white rounded-xl p-5 shadow md:col-span-2" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <JournalEditor onChange={setJournal} defaultValue={journal} />
              </motion.div>

              <motion.div className="md:col-span-2 text-center" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <p className="text-sm text-gray-500 mb-2">
                  Please fill mood, sleep and journal to submit your entry.
                </p>
                <SubmitButton
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!mood || !sleep || journal.trim() === ''}
                />
              </motion.div>
            </>
          ) : (
            <motion.div className="bg-white rounded-xl p-5 shadow md:col-span-2 text-center" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Today's Summary</h3>
              <p>Mood: {mood} / 5</p>
              <p>Sleep: {sleep} hrs</p>
              <p>Journal: Submitted</p>
              <p>Medications: {medications.length > 0 ? '✔️ Taken' : '—'}</p>
            </motion.div>
          )}

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
