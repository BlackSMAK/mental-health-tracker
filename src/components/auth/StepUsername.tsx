// src/components/auth/StepUsername.tsx
import { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StepUsernameProps {
  onNext: (username: string) => void;
  defaultValue?: string;
}

export default function StepUsername({
  onNext,
  defaultValue = '',
}: StepUsernameProps) {
  const [username, setUsername] = useState(defaultValue);
  const [available, setAvailable] = useState(true); // Simulate always available
  const [error, setError] = useState('');

  useEffect(() => {
    if (username.length >= 3) {
      // Simulated availability check
      const takenUsernames = ['admin', 'test', 'user'];
      setAvailable(!takenUsernames.includes(username.toLowerCase()));
    }
  }, [username]);

  const handleNext = () => {
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!available) {
      setError('That username is taken. Try another.');
      return;
    }
    setError('');
    onNext(username.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-4 text-center"
    >
      <h2 className="text-2xl font-bold">Choose a Username</h2>
      <p className="text-sm text-gray-600">
        This will be your unique identity across the app.
      </p>

      <input
        type="text"
        className="input input-bordered w-full text-center"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="yourcoolname123"
      />

      {!available && (
        <p className="text-sm text-red-500">This username is taken.</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleNext}
        className="btn btn-primary flex items-center justify-center gap-2 self-end"
      >
        Continue <FiArrowRight />
      </button>
    </motion.div>
  );
}
