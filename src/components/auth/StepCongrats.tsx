// src/components/auth/StepCongrats.tsx
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StepCongratsProps {
  onNext: () => void;
}

export default function StepCongrats({ onNext }: StepCongratsProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center flex flex-col items-center justify-center space-y-6"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ duration: 1, repeat: 1 }}
        className="text-5xl"
      >
        🎉
      </motion.div>

      <h2 className="text-3xl font-bold">Account Created!</h2>
      <p className="text-gray-600">You're all set to continue your journey.</p>

      <button
        onClick={onNext}
        className="btn btn-success flex items-center justify-center gap-2"
      >
        Continue <FiArrowRight />
      </button>
    </motion.div>
  );
}
