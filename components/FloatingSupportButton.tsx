
import React from 'react';

interface FloatingSupportButtonProps {
  onClick: () => void;
}

const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
      aria-label="Precisa conversar?"
    >
      <img src="https://i.ibb.co/sJmgqPZ/foxy-astronaut-2.png" alt="Precisa conversar?" className="w-full h-full object-contain rounded-full" />
    </button>
  );
};

export default FloatingSupportButton;
