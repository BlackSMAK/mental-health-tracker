'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ✅ Routing hook

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter(); // ✅ Used for redirection

  const handleGetStarted = () => {
    router.push('/auth'); // ✅ Navigate to auth page
  };

  return (
    <>
      <Head>
        <title>MindfulTrack – AI-Powered Mental Health Tracker</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold text-blue-600">MindfulTrack</h1>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary btn-sm rounded-full px-5"
          >
            Login | Sign-up
          </button>
        </header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center flex-1 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Mental Health Companion
          </h2>
          <p className="text-lg max-w-xl mb-8 text-gray-600">
            Track your mood, reflect with daily journals, and get AI-powered insights to better understand yourself.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Get Started
          </button>
        </motion.section>

        {/* Features Section */}
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Mood Tracking',
                desc: 'Log your daily emotions using emoji sliders and trend graphs.',
              },
              {
                title: 'Smart Journaling',
                desc: 'Write freely and receive calming AI summaries and advice.',
              },
              {
                title: 'Insightful Trends',
                desc: 'Visualize how your sleep, mood, and journaling interact over time.',
              },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="rounded-xl bg-blue-50 p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-700">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6 mt-auto">
          © {new Date().getFullYear()} MindfulTrack. Built by Syed Muhammad Ahmed Khalid.
        </footer>

        {/* Settings Icon */}
        <div
          className="fixed bottom-5 right-5 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            initial={false}
            animate={{ width: isHovered ? 220 : 50 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-300 shadow-lg rounded-full px-4 py-2 flex items-center overflow-hidden"
          >
            <Settings className="text-gray-600" size={20} />
            {isHovered && (
              <div className="ml-3 text-sm text-gray-600">Settings (Coming Soon)</div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
