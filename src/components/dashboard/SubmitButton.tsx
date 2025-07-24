import { FiSend } from 'react-icons/fi';

interface SubmitButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function SubmitButton({
  onClick,
  isLoading,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2 px-5 py-3 mt-4 text-white rounded-md font-semibold transition
        ${isLoading || disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
      `}
    >
      {isLoading ? 'Submitting...' : 'Submit Entry'}
      {!isLoading && <FiSend />}
    </button>
  );
}
