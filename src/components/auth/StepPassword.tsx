// src/components/auth/StepPassword.tsx
import { useState } from 'react';
import { FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

interface StepPasswordProps {
  onNext: (password: string) => void;
  onBack?: () => void;
}

export default function StepPassword({ onNext, onBack }: StepPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const isPasswordTyped = password.length > 0;
  const isConfirmTyped = confirm.length > 0;
  const isPasswordStrong = password.length >= 8;
  const isConfirmMatch = confirm === password && isConfirmTyped;
  const isFormValid = isPasswordStrong && isConfirmMatch;

  const handleNext = () => {
    if (!isFormValid) {
      setError(
        !isPasswordStrong
          ? 'Password must be at least 8 characters.'
          : 'Passwords do not match.'
      );
      return;
    }
    setError('');
    onNext(password);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Create a Password</h2>

      {/* Password Input */}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="Password (min 8 characters)"
          className={`w-full px-4 py-3 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            isPasswordTyped
              ? isPasswordStrong
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } text-gray-800`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Eye Icon (always visible when password typed) */}
        {isPasswordTyped && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShow(!show)}
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>

      {/* Confirm Input */}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="Re-enter Password"
          className={`w-full px-4 py-3 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            isConfirmTyped
              ? isConfirmMatch
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } text-gray-800`}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex justify-between items-center pt-2">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FiArrowLeft /> Back
          </button>
        )}

        {/* Continue Button */}
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition ${
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
