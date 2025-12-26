
import React from 'react';

interface ChevronLeftIconProps {
  className?: string;
}

const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
};

export default ChevronLeftIcon;
