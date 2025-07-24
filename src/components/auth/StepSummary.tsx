import { useState, useEffect } from 'react';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StepSummaryProps {
  data: {
    email: string;
    name: string;
    age: string;
    username: string;
    userId: string;
  };
  onNext: () => void;
}

export default function StepSummary({ data, onNext }: StepSummaryProps) {
  const { email, name, age, username, userId } = data;
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => {
        onNext(); // Go back to login step in parent
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isRedirecting, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center space-y-6"
    >
      {!isRedirecting ? (
        <>
          {/* Success Icon */}
          <div className="text-green-500 text-5xl">
            <FiCheckCircle />
          </div>

          <h2 className="text-3xl font-bold text-gray-800">You're All Set!</h2>
          <p className="text-sm text-gray-600">Here's what we've got for your profile:</p>

          {/* Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 text-left w-full max-w-md space-y-3 text-gray-800">
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Username:</span>
              <span>{username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span>{userId}</span>
            </div>
          </div>

          {/* Finalize Button */}
          <button
            onClick={() => setIsRedirecting(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2 transition"
          >
            Finish Setup <FiArrowRight />
          </button>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          />
          <p className="text-blue-600 text-lg font-medium">
            Setting up your dashboard…
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
