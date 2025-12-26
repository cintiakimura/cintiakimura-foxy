
import React, { useState, useEffect } from 'react';

interface BreakScreenProps {
  onComplete: () => void;
}

const BreakScreen: React.FC<BreakScreenProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent">
      <h2 className="text-3xl text-teal-800 mb-12">Pausa!</h2>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-teal-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle 
            className="text-teal-500" 
            strokeWidth="8" 
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/60)}
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="45" 
            cx="50" 
            cy="50"
            style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear'}}
          />
        </svg>
        <span className="absolute text-5xl text-teal-700">{timeLeft}</span>
      </div>
      <p className="mt-8 text-teal-700">Toque na raposinha para uma piada ou fato divertido!</p>
    </div>
  );
};

export default BreakScreen;
