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

// Types for our data
interface JournalEntry {
  id: string;
  content: string;
  summary: string;
  ai_suggestion: string;
  created_at: string;
}

export default function Dashboard() {
  // User state
  const [name, setName] = useState('');
  const [userid, setUserid] = useState<string>('');
  const [today] = useState(new Date());
  
  // Form state
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [journal, setJournal] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [aiResponse, setAIResponse] = useState<{ summary: string; suggestion: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'mood-history' | 'ai-response'>('home');
  
  // History data
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [aiHistory, setAiHistory] = useState<JournalEntry[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('❌ Auth error:', error);
        router.push('/login');
        return;
      }

      console.log('🔍 Auth user UUID:', user.id);

      // Get custom userid (text format: UID_xxxx)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('userid, name')
        .eq('id', user.id)
        .maybeSingle();

      if (userError || !userData) {
        console.error('❌ User fetch error:', userError);
        return;
      }

      console.log('✅ User data found:', userData);
      setName(userData.name);
      setUserid(userData.userid);

      // Today's UTC boundaries
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Check for today's journal entry
      const { data: todayEntry } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('userid', userData.userid)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Always fetch today's mood and sleep data to prefill
      const { data: moodData } = await supabase
        .from('mood_logs')
        .select('mood')
        .eq('userid', userData.userid)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('hours')
        .eq('userid', userData.userid)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Set prefilled values
      if (moodData) {
        console.log('✅ Prefilling mood:', moodData.mood);
        setMood(moodData.mood);
      } else {
        setMood(3); // Default
      }

      if (sleepData) {
        console.log('✅ Prefilling sleep:', sleepData.hours);
        setSleep(sleepData.hours);
      } else {
        setSleep(0); // Default
      }

      // If journal exists, mark as submitted
      if (todayEntry) {
        console.log('✅ Found today\'s journal entry:', todayEntry);
        setJournal(todayEntry.content || '');
        setEntrySubmitted(true);
        setAIResponse({
          summary: todayEntry.summary || 'Entry submitted',
          suggestion: todayEntry.ai_suggestion || 'Take care today!',
        });
      }

      // Fetch journal history (last 2 days excluding today)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const { data: historyData } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('userid', userData.userid)
        .gte('created_at', twoDaysAgo.toISOString())
        .lt('created_at', startOfDay.toISOString()) // Exclude today
        .order('created_at', { ascending: false })
        .limit(2);

      if (historyData) {
        console.log('✅ Journal history loaded:', historyData);
        setJournalHistory(historyData);
      }

      // Fetch AI response history (last 3 entries including today)
      const { data: aiHistoryData } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('userid', userData.userid)
        .order('created_at', { ascending: false })
        .limit(3);

      if (aiHistoryData) {
        console.log('✅ AI history loaded:', aiHistoryData);
        setAiHistory(aiHistoryData);
      }
    };

    fetchUserData();
  }, [router]);

const handleDeleteAccount = async () => {
  const confirmPhrase = prompt('⚠️ This will permanently delete your account.\n\nTo confirm, type exactly:\n"yes delete my account"');

  if (confirmPhrase !== 'yes delete my account') {
    alert('❌ Deletion cancelled. Phrase not matched.');
    return;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) {
    alert('Failed to get current user.');
    return;
  }

  try {
    const userid = user.id;

    // Delete from all relevant tables
    const tables = ['journal_entries', 'sleep_logs', 'mood_logs', 'login_sessions', 'users'];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('userid', userid);
      if (error) throw new Error(`Failed to delete from ${table}: ${error.message}`);
    }

    // Securely delete from Auth using your API route
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userid }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete user from auth');

    alert('🗑️ Your account has been permanently deleted. We’ll miss you!');
    router.push('/');
  } catch (err) {
    console.error('🔥 Account deletion failed:', err);
    alert(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
  }
};

  const fetchAISuggestion = async (input: {
  mood: number,
  sleep: number,
  journal: string
}): Promise<string> => {
  const prompts = [
    {
      url: "https://api.groq.com/openai/v1/chat/completions", // ✅ Replace with your actual endpoints
      key: process.env.NEXT_PUBLIC_GROQ_API_KEY_1
    },
    {
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.NEXT_PUBLIC_GROQ_API_KEY_2
    },
  ];

  const payload = {
    messages: [
      {
        role: 'system',
        content: 'You are a kind and helpful mental health assistant.'+ 
                  'Users will provide their mood, sleep hours, and journal entries.'+ 
                  'Your task is to analyze this information and provide a supportive suggestion or encouragement.'+
                  'Keep responses concise and positive, friendly tone.'+
                  'Help them feel understood and motivated to take care of their mental health.'+
                  'Give energetic and healthy responses.'+
                  'This is not a chat so the response should be final and a very good and proper one so that the user can feel motivated, encouraged and happy.'
      },
      {
        role: 'user',
        content: `Mood: ${input.mood}/5\nSleep: ${input.sleep} hrs\nJournal: ${input.journal}\n\n What kind of encouragement or suggestion would you give this person today? Reply as if you are talking to them as a mental health assistant.'`
      }
    ],
    model: 'llama-3.1-8b-instant', // or gpt-3.5/llama3, mixtral-8x7b-32768 if using a proxy to those 
    temperature: 0.7
  };

  for (const { url, key } of prompts) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        const suggestion = json?.choices?.[0]?.message?.content?.trim();
        if (suggestion) return suggestion;
      }
    } catch (err) {
      console.warn(`AI fallback failed: ${url}`, err);
    }
  }

  return 'Try some fresh air or journaling again tomorrow!'; // Final fallback
};



  const handleSubmit = async () => {
    console.log('🚀 handleSubmit triggered');
    
    if (!mood || !sleep || journal.trim() === '' || !userid) {
      alert('Please fill in all required fields (mood, sleep, journal)');
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();

    try {
      const sleepData = {
        userid: userid,
        hours: Number(sleep),
        quality: null,
        created_at: now,
      };

      const moodData = {
        userid: userid,
        mood: Number(mood),
        note: '',
        created_at: now,
      };

      const journalData = {
        userid: userid,
        content: journal.trim(),
        summary: `Mood: ${mood}/5 · Sleep: ${sleep} hrs`,
        ai_suggestion: 'Try some sunlight or a short walk!',
        created_at: now,
      };

      const loginData = {
        userid: userid,
        logged_in_at: now,
      };

      // Insert all data
      const [sleepResult, moodResult, journalResult, sessionResult] = await Promise.all([
        supabase.from('sleep_logs').insert(sleepData).select(),
        supabase.from('mood_logs').insert(moodData).select(),
        supabase.from('journal_entries').insert(journalData).select(),
        supabase.from('login_sessions').insert(loginData).select()
      ]);

      if (sleepResult.error) throw new Error(`Sleep log error: ${sleepResult.error.message}`);
      if (moodResult.error) throw new Error(`Mood log error: ${moodResult.error.message}`);
      if (journalResult.error) throw new Error(`Journal entry error: ${journalResult.error.message}`);
      if (sessionResult.error) throw new Error(`Login session error: ${sessionResult.error.message}`);

      console.log('🎉 All entries submitted successfully!');
      // ✨ Generate AI suggestion using Groq + fallback
      const aiSuggestion = await fetchAISuggestion({
          mood: Number(mood),
          sleep: Number(sleep),
          journal: journal.trim()
      });

// Update the journal entry with AI suggestion
const updateResult = await supabase
  .from('journal_entries')
  .update({ ai_suggestion: aiSuggestion })
  .eq('id', journalResult.data?.[0]?.id);

if (updateResult.error) {
  throw new Error(`Failed to update journal with AI suggestion: ${updateResult.error.message}`);
}

setAIResponse({
  summary: `Mood: ${mood}/5 · Sleep: ${sleep} hrs`,
  suggestion: aiSuggestion,
});



      setEntrySubmitted(true);

      // Refresh AI history
      const { data: newAiHistory } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('userid', userid)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (newAiHistory) setAiHistory(newAiHistory);

    } catch (err) {
      console.error('🔥 Submission error:', err);
      alert(`Error saving your entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderHomeSection = () => (
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
          <motion.div className="bg-white rounded-xl p-5 shadow-md border border-gray-100" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MoodSlider onChange={setMood} defaultValue={mood ?? 3} />
          </motion.div>

          <motion.div className="bg-white rounded-xl p-5 shadow-md border border-gray-100" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <SleepInput onChange={setSleep} defaultValue={sleep ?? 0} />
          </motion.div>

          <motion.div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 md:col-span-2" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <MedicationInput onChange={setMedications} defaultValue={medications} />
          </motion.div>

          <motion.div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 md:col-span-2" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <JournalEditor onChange={setJournal} defaultValue={journal} />
          </motion.div>

          <motion.div className="md:col-span-2 text-center" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <p className="text-sm text-gray-500 mb-4">
              Please fill mood, sleep and journal to submit your entry.
            </p>
            <SubmitButton
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!mood || !sleep || journal.trim() === '' || !userid}
            />
          </motion.div>
        </>
      ) : (
        <motion.div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-md border border-green-200 md:col-span-2 text-center" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Entry Complete!</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-gray-500">Mood</p>
              <p className="font-semibold text-blue-600">{mood} / 5</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-gray-500">Sleep</p>
              <p className="font-semibold text-blue-600">{sleep} hrs</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-gray-500">Journal</p>
              <p className="font-semibold text-green-600">✓ Submitted</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-gray-500">Medications</p>
              <p className="font-semibold">{medications.length > 0 ? '✅ Taken' : '—'}</p>
            </div>
          </div>
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
  );

  const renderMoodHistorySection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-2xl mr-3">📖</span>
          Recent Journal Entries
        </h3>
        
        {journalHistory.length > 0 ? (
          <div className="space-y-4">
            {journalHistory.map((entry, index) => (
              <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-700">
                    {index === 0 ? 'Yesterday' : '2 days ago'}
                  </h4>
                  <span className="text-xs text-gray-500">{formatDate(entry.created_at)}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {entry.content.length > 200 
                    ? `${entry.content.substring(0, 200)}...` 
                    : entry.content
                  }
                </p>
                <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-3 py-1 inline-block">
                  {entry.summary}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📝</span>
            <p>No recent journal entries found.</p>
            <p className="text-sm">Start writing to see your history here!</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderAIResponseSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current AI Response */}
      {aiResponse && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-md border border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">🤖</span>
            Today's AI Insights
          </h3>
          <AIResponseCard
            summary={aiResponse.summary}
            suggestion={aiResponse.suggestion}
          />
        </div>
      )}

      {/* AI History */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-2xl mr-3">🔮</span>
          Previous AI Responses
        </h3>
        
        {aiHistory.length > 1 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {aiHistory.slice(1, 3).map((entry, index) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-700">
                    {index === 0 ? 'Previous Entry' : 'Older Entry'}
                  </h4>
                  <span className="text-xs text-gray-500">{formatDate(entry.created_at)}</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-blue-800 mb-1">Summary:</p>
                  <p className="text-sm text-blue-700">{entry.summary}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800 mb-1">AI Suggestion:</p>
                  <p className="text-sm text-green-700">{entry.ai_suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">🤖</span>
            <p>No previous AI responses found.</p>
            <p className="text-sm">Submit more entries to build your AI response history!</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r shadow-lg p-6 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-700 mb-8">
          MindfulTrack<span className="text-xs align-super">®</span>
        </h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection('home')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
              activeSection === 'home'
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveSection('mood-history')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
              activeSection === 'mood-history'
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">📖</span>
            <span>Mood History</span>
          </button>

          <button
            onClick={() => setActiveSection('ai-response')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
              activeSection === 'ai-response'
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🤖</span>
            <span>AI Response</span>
          </button>
        </nav>
      </div>

      {/* Footer with social links */}
<div className="space-y-2 mt-10">
  <div className="flex justify-center space-x-4">
    <a
      href="https://www.linkedin.com/in/syed-muhammad-ahmed-khalid-6b8611336"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity"
    >
      <svg
        className="w-5 h-5 text-blue-600"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-11 19H5v-9h3v9zm-1.5-10.3C5.53 8.7 4.75 7.91 4.75 7S5.53 5.3 6.5 5.3 8.25 6.09 8.25 7 7.47 8.7 6.5 8.7zm13.5 10.3h-3v-4.7c0-1.13-.02-2.58-1.57-2.58-1.57 0-1.81 1.23-1.81 2.5v4.8h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.83-1.56 3.03 0 3.59 1.99 3.59 4.58v4.75z" />
      </svg>
    </a>

    <a
      href="https://github.com/BlackSMAK"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity"
    >
      <svg
        className="w-5 h-5 text-gray-800"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0.3C5.37 0.3 0 5.67 0 12.3c0 5.29 3.44 9.78 8.21 11.38.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.35-1.79-1.35-1.79-1.1-.75.08-.74.08-.74 1.21.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.25-.13-.31-.54-1.56.12-3.26 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.7.25 2.95.12 3.26.77.85 1.24 1.93 1.24 3.25 0 4.63-2.81 5.64-5.49 5.94.43.38.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.3C24 5.67 18.63 0.3 12 0.3z" />
      </svg>
    </a>

    <a
  href="https://www.kaggle.com/smak17"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 font-bold text-lg hover:text-blue-700 transition-colors"
>
  k
</a>



  </div>
  <p className="text-xs text-gray-400 text-center">
    © 2025 MindfulTrack<span className="align-super text-[0.6rem] ml-0.5">®</span>
  </p>
</div>

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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, {name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeSection === 'home' && 'Dashboard Overview'}
            {activeSection === 'mood-history' && 'Your Journal History'}
            {activeSection === 'ai-response' && 'AI Insights & Suggestions'}
          </p>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {name.slice(0, 2).toUpperCase()}
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-48 overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">{userid}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center space-x-2"
                >
                  <span>👋</span>
                  <span>Logout</span>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-100 transition-colors duration-150 flex items-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>Delete Account</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content based on active section */}
      <div className="min-h-[600px]">
        {activeSection === 'home' && renderHomeSection()}
        {activeSection === 'mood-history' && renderMoodHistorySection()}
        {activeSection === 'ai-response' && renderAIResponseSection()}
      </div>
    </main>
  </div>
);
}