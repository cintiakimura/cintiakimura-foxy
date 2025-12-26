
import React, { useEffect } from 'react';
import { Animal } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface SessionCompleteScreenProps {
  animal: Animal;
  onContinue: () => void;
}

const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({ onContinue }) => {
  const { speak } = useTextToSpeech();

  useEffect(() => {
    speak("We did it!");
  }, [speak]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent text-center">
      <div className="animate-pulse-teal rounded-full">
        <img 
            src="https://i.imgur.com/gI2i5F1.png" 
            alt="Fox hugging a puppy" 
            className="w-64 h-64 object-contain rounded-full"
        />
      </div>
      <h1 className="text-4xl text-gray-800 mt-8 mb-8">Nós conseguimos!</h1>
      
      <button
        onClick={onContinue}
        className="border-2 border-[#008080] bg-transparent text-[#008080] py-3 px-8 rounded-full text-xl"
      >
        Continuar
      </button>
    </div>
  );
};

export default SessionCompleteScreen;
