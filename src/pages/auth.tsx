// src/pages/auth.tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StepEmail from '@/components/auth/StepEmail';
import StepNameAge from '@/components/auth/StepNameAge';
import StepPassword from '@/components/auth/StepPassword';
import StepCongrats from '@/components/auth/StepCongrats';
import StepUsername from '@/components/auth/StepUsername';
import StepSummary from '@/components/auth/StepSummary';

type Step =
  | 'email'
  | 'name-age'
  | 'password'
  | 'congrats'
  | 'username'
  | 'summary';

export default function AuthPage() {
  const [step, setStep] = useState<Step>('email');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    password: '',
    username: '',
    userId: '',
  });

  const stepOrder: Step[] = [
    'email',
    'name-age',
    'password',
    'congrats',
    'username',
    'summary',
  ];

  const nextStep = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    const currentIndex = stepOrder.indexOf(step);
    setStep(stepOrder[currentIndex + 1]);
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const stepComponents = {
    email: (
      <StepEmail
        onNext={(data) => nextStep({ email: data })}
        defaultValue={formData.email}
      />
    ),
    'name-age': (
      <StepNameAge
        onNext={(data) => nextStep(data)}
        onBack={prevStep}
        defaultValue={{ name: formData.name, age: formData.age }}
      />
    ),
    password: (
      <StepPassword
        onNext={(data) => nextStep({ password: data })}
        onBack={prevStep}
      />
    ),
    congrats: <StepCongrats onNext={() => nextStep({})} />,
    username: (
      <StepUsername
        onNext={(data) =>
          nextStep({
            username: data,
            userId: 'UID_' + Math.floor(Math.random() * 100000),
          })
        }
        defaultValue={formData.username}
      />
    ),
    summary: <StepSummary data={formData} onNext={() => {}} />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl"
        >
          {stepComponents[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
