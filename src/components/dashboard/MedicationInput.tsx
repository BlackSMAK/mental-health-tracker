import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface MedicationInputProps {
  onChange: (medications: string[]) => void;
  defaultValue?: string[];
}

export default function MedicationInput({
  onChange,
  defaultValue = [],
}: MedicationInputProps) {
  const [medications, setMedications] = useState<string[]>(defaultValue);

  const handleAdd = () => {
    setMedications((prev) => {
      const updated = [...prev, ''];
      onChange(updated);
      return updated;
    });
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-semibold text-gray-700">Medication (optional)</label>

      {medications.map((med, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={med}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md shadow-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
            placeholder={`Medication ${index + 1}`}
          />
          <button
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700"
            title="Remove"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
      >
        <FiPlus />
        Add Medication
      </button>
    </div>
  );
}
