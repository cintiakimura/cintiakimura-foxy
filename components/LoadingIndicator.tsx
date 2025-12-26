
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-orange-500 border-white rounded-full animate-spin"></div>
      <p className="text-white text-xl mt-4 font-semibold">Pensando...</p>
    </div>
  );
};

export default LoadingIndicator;
