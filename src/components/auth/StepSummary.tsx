// src/components/auth/StepSummary.tsx
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-center"
    >
      <div className="text-green-500 text-5xl flex justify-center">
        <FiCheckCircle />
      </div>

      <h2 className="text-3xl font-bold">You're All Set!</h2>
      <p className="text-gray-600">Here’s what we’ve got for your profile:</p>

      <div className="bg-base-200 rounded-xl p-4 text-left space-y-2 w-full max-w-md mx-auto shadow-md">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Username:</strong> @{username}</p>
        <p><strong>User ID:</strong> {userId}</p>
      </div>

      <button
        onClick={onNext}
        className="btn btn-success flex items-center gap-2 mx-auto"
      >
        Go to Dashboard <FiArrowRight />
      </button>
    </motion.div>
  );
}
