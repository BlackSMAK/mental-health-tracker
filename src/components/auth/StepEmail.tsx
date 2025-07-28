import { useState } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';

interface StepEmailProps {
  onNext: (email: string) => void;
  onBack?: () => void;
  defaultValue?: string;
}

export default function StepEmail({ onNext, onBack, defaultValue = '' }: StepEmailProps) {
  const [email, setEmail] = useState(defaultValue);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    // 🔍 Check if email already exists in `users` table
    const { data: existingUser, error: dbError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    setLoading(false);

    if (dbError) {
      console.error('Email check error:', dbError.message);
      setError('Something went wrong. Please try again.');
      return;
    }

    if (existingUser) {
      setError('This email is already registered. Please log in instead.');
      return;
    }

    onNext(email.trim());
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Enter your Email</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        placeholder="you@example.com"
      />

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex justify-between items-center pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FiArrowLeft /> Back
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isEmailValid || loading}
          className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition
            ${isEmailValid && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          {loading ? 'Checking...' : 'Continue'} <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
