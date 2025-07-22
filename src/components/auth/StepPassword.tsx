// src/components/auth/StepPassword.tsx
import { useState } from 'react';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

interface StepPasswordProps {
  onNext: (password: string) => void;
}

export default function StepPassword({ onNext }: StepPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onNext(password);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center">Create a Password</h2>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="Password"
          className="input input-bordered w-full pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShow(!show)}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="Re-enter Password"
          className="input input-bordered w-full pr-10"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleNext}
        className="btn btn-primary flex items-center justify-center gap-2 self-end"
      >
        Continue <FiArrowRight />
      </button>
    </div>
  );
}
