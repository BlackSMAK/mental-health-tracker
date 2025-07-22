// src/components/auth/StepNameAge.tsx
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface StepNameAgeProps {
  onNext: (data: { name: string; age: string }) => void;
  defaultValue?: { name: string; age: string };
}

export default function StepNameAge({
  onNext,
  defaultValue = { name: '', age: '' },
}: StepNameAgeProps) {
  const [name, setName] = useState(defaultValue.name);
  const [age, setAge] = useState(defaultValue.age);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^\d{1,3}$/.test(age)) {
      setError('Please enter a valid age.');
      return;
    }
    setError('');
    onNext({ name: name.trim(), age });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center">Tell us about you</h2>

      <input
        type="text"
        placeholder="Your Name"
        className="input input-bordered w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Your Age"
        className="input input-bordered w-full"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

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
