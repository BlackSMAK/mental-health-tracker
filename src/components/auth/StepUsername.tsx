import { useState } from 'react';
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
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [hovering, setHovering] = useState(false);

  const takenUsernames = ['admin', 'test', 'user'];

  const trimmed = username.trim();
  const isTyped = trimmed.length > 0;
  const isValidChars = /^[a-zA-Z0-9_-]+$/.test(trimmed); // allowed characters
  const hasLetter = /[a-zA-Z]/.test(trimmed); // must contain at least one letter
  const isValidFormat = isValidChars && hasLetter;
  const isAvailable =
    isTyped && isValidFormat && !takenUsernames.includes(trimmed.toLowerCase());
  const isFormValid = isAvailable;

  const handleNext = () => {
    console.log('handleNext called with:', trimmed);

    if (!isTyped || !isValidFormat) {
      setError("Hey man, what would I even call you if you don't have a username?");
      return;
    }

    if (!isAvailable) {
      setError('That username is taken. Try another.');
      return;
    }

    setError('');
    console.log('Calling onNext with:', trimmed);
    onNext(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-4 text-center relative"
    >
      <h2 className="text-2xl font-bold text-gray-800">Choose a Username</h2>
      <p className="text-sm text-gray-600">This will be your unique identity across the app.</p>

      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setTouched(true);
        }}
        onBlur={() => setTouched(true)}
        placeholder="yourcoolname123"
        className={`w-full px-4 py-3 border rounded-md shadow-sm text-center focus:outline-none focus:ring-2 text-gray-800
          ${
            touched
              ? isFormValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }
        `}
      />

      <p className="text-xs text-gray-500 -mt-2">
        Letters, numbers, underscores (_) and dashes (-). Must contain at least one letter.
      </p>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <div
        className="relative self-end"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {!isFormValid && hovering && (
          <div className="absolute -top-10 right-0 z-10 bg-black text-white text-xs rounded px-3 py-2 shadow-lg whitespace-nowrap">
            Hey man, what would I even call you if you don't have a username?
          </div>
        )}

        <button
          onClick={handleNext}
          // disabled={!isFormValid} // ← UNCOMMENT this later if needed
          className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition
            ${isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
}
