// src/components/auth/StepEmail.tsx
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface StepEmailProps {
  onNext: (email: string) => void;
  defaultValue?: string;
}

export default function StepEmail({ onNext, defaultValue = '' }: StepEmailProps) {
  const [email, setEmail] = useState(defaultValue);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onNext(email);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center">Enter your Email</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        placeholder="you@example.com"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        className="btn btn-primary flex items-center justify-center gap-2 self-end w-fit ml-auto"
      >
        Continue <FiArrowRight />
      </button>
    </div>
  );
}
