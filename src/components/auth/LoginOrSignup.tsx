// src/components/auth/LoginOrSignup.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLogIn } from 'react-icons/fi';

interface LoginOrSignupProps {
  onLogin: (credentials: { identifier: string; password: string }) => void;
  onSignupClick: () => void;
}

export default function LoginOrSignup({
  onLogin,
  onSignupClick,
}: LoginOrSignupProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!identifier || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    onLogin({ identifier, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto px-4"
    >
      <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
      <p className="text-gray-600 text-sm">Log in to your account</p>

      <div className="w-full space-y-3">
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2"
        >
          <FiLogIn /> Log In
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center w-full max-w-xs">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 text-gray-400 text-sm">or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Signup Redirect */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">New here?</p>
        <button
          onClick={onSignupClick}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition flex items-center gap-2"
        >
          Sign Up <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
}
