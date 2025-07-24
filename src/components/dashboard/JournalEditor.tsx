import { useState } from 'react';

interface JournalEditorProps {
  onChange: (text: string) => void;
  defaultValue?: string;
}

const prompts = [
  "What made today challenging?",
  "What are you grateful for?",
  "Describe a moment that stood out today.",
  "How are you feeling right now?",
];

export default function JournalEditor({ onChange, defaultValue = '' }: JournalEditorProps) {
  const [journalText, setJournalText] = useState(defaultValue);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold text-gray-700">Journal your thoughts</label>

      <div className="flex gap-2 flex-wrap text-sm">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setSelectedPrompt(prompt)}
            className={`px-3 py-1 rounded-full border text-gray-600 transition
              ${selectedPrompt === prompt ? 'bg-blue-100 border-blue-500 text-blue-700' : 'hover:border-blue-400'}
            `}
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        value={journalText}
        onChange={handleChange}
        placeholder={selectedPrompt}
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
      />
    </div>
  );
}
