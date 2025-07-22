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
      className="flex flex-col items-center text-center space-y-6"
    >
      {/* Success Icon */}
      <div className="text-green-500 text-5xl">
        <FiCheckCircle />
      </div>

      {/* Heading */}
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

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2 transition"
      >
        Go to Dashboard <FiArrowRight />
      </button>
    </motion.div>
  );
}
