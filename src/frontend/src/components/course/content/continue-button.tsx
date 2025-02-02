import React from 'react';

interface ContinueButtonProps {
  content?: string;
  onClick: () => void;
}

export function ContinueButton({ content = "Continue", onClick }: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mb-10 text-black text-center font-bold text-lg underline hover:text-gray-700 transition-colors duration-200"
    >
      {content}
    </button>
  );
};
