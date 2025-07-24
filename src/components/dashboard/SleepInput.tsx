import { useState } from "react";

interface SleepInputProps {
  onChange: (hours: number) => void;
  defaultValue?: number;
}

export default function SleepInput({ onChange, defaultValue = 7 }: SleepInputProps) {
  const [sleepHours, setSleepHours] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSleepHours(value);
    onChange(value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold text-gray-700">How many hours did you sleep?</label>

      <input
        type="range"
        min={0}
        max={12}
        step={0.5}
        value={sleepHours}
        onChange={handleChange}
        className="w-full accent-blue-500"
      />

      <div className="text-center text-blue-600 font-medium">
        {sleepHours} {sleepHours === 1 ? 'hour' : 'hours'}
      </div>
    </div>
  );
}
