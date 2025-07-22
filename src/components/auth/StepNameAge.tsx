import { useState } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

interface StepNameAgeProps {
  onNext: (data: { name: string; age: string }) => void;
  onBack?: () => void;
  defaultValue?: { name: string; age: string };
}

export default function StepNameAge({
  onNext,
  onBack,
  defaultValue = { name: '', age: '' },
}: StepNameAgeProps) {
  const [name, setName] = useState(defaultValue.name);
  const [age, setAge] = useState(defaultValue.age);
  const [error, setError] = useState('');

  const isFormValid = name.trim() !== '' && /^\d{1,3}$/.test(age);

  const handleNext = () => {
    if (!isFormValid) {
      setError('Please enter a valid name and age.');
      return;
    }
    setError('');
    onNext({ name: name.trim(), age });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Tell us about you</h2>

      <input
        type="text"
        placeholder="Your Name"
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Your Age"
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex justify-between items-center pt-4">
        {/* Back Button (left-aligned) */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FiArrowLeft /> Back
          </button>
        )}

        {/* Continue Button (right-aligned) */}
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-5 py-2 rounded-md font-medium transition
            ${isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
