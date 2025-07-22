import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface StepEmailProps {
  onNext: (email: string) => void;
  defaultValue?: string;
}

export default function StepEmail({ onNext, defaultValue = '' }: StepEmailProps) {
  const [email, setEmail] = useState(defaultValue);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleSubmit = () => {
    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onNext(email);
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

      <button
        onClick={handleSubmit}
        disabled={!isEmailValid}
        className={`flex items-center justify-center gap-2 self-end w-fit ml-auto px-5 py-2 rounded-md transition font-medium
          ${isEmailValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        Continue <FiArrowRight />
      </button>
    </div>
  );
}
