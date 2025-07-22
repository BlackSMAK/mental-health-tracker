// src/components/auth/StepCongrats.tsx
import { useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StepCongratsProps {
  onNext: () => void;
}

export default function StepCongrats({ onNext }: StepCongratsProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center flex flex-col items-center justify-center space-y-6"
    >
      {/* Emoji Animation */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ duration: 1, repeat: 1 }}
        className="text-5xl"
      >
        🎉
      </motion.div>

      {/* Heading & Description */}
      <h2 className="text-3xl font-bold text-gray-800">Account Created!</h2>
      <p className="text-gray-600">You're all set to continue your journey.</p>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition"
      >
        Continue <FiArrowRight />
      </button>
    </motion.div>
  );
}
