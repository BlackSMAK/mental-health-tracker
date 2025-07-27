import { useState, useRef, useEffect } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [journalText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-lg font-semibold text-gray-700">Journal your thoughts</label>

      <div className="flex gap-2 flex-wrap text-sm">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setSelectedPrompt(prompt)}
            className={`px-3 py-1 rounded-full border transition text-sm
              ${selectedPrompt === prompt
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'text-gray-600 hover:border-blue-400'}
            `}
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={journalText}
        onChange={handleChange}
        placeholder={selectedPrompt}
        rows={1}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none overflow-hidden transition-all duration-200 ease-in-out"
      />
    </div>
  );
}
