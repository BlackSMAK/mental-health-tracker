import { useState } from 'react';

interface MoodSliderProps {
  onChange: (mood: number) => void;
  defaultValue?: number;
}

const moods = [
  { label: '😍', value: 5, description: 'Great' },
  { label: '😊', value: 4, description: 'Good' },
  { label: '😐', value: 3, description: 'Okay' },
  { label: '😔', value: 2, description: 'Bad' },
  { label: '😢', value: 1, description: 'Awful' },
];

export default function MoodSlider({ onChange, defaultValue = 3 }: MoodSliderProps) {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (value: number) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold text-gray-700">How are you feeling today?</label>
      <div className="flex justify-between items-center text-3xl">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            className={`transition-transform duration-150 ${
              selected === mood.value ? 'scale-125' : 'opacity-50 hover:opacity-100'
            }`}
            title={mood.description}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
