interface AIResponseCardProps {
  summary: string;
  suggestion: string;
}

export default function AIResponseCard({ summary, suggestion }: AIResponseCardProps) {
  return (
    <div className="p-4 rounded-lg shadow-md bg-white border mt-4 space-y-3">
      <h3 className="text-lg font-semibold text-blue-700">🧠 AI Summary</h3>
      <p className="text-gray-700">{summary}</p>

      <h3 className="text-lg font-semibold text-blue-700 pt-2">💡 Suggestion</h3>
      <p className="text-gray-700">{suggestion}</p>
    </div>
  );
}
