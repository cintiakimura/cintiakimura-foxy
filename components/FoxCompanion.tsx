
import React from 'react';
import { Animal, Screen } from '../types';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface FoxCompanionProps {
  animal: Animal;
  state: 'corner' | 'center';
  interactionState: 'idle' | 'speaking' | 'listening' | 'thinking';
  onClick: () => void;
  currentScreen: Screen;
}

const FoxCompanion: React.FC<FoxCompanionProps> = ({ animal, state, interactionState, onClick, currentScreen }) => {
  const isInteraction = state === 'center';
  const isHome = currentScreen === Screen.HOME;

  if (!isInteraction && !isHome) {
    return null;
  }

  const getPositionClasses = () => {
    if (isInteraction) {
      return 'bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-auto h-[35vh]';
    }
    if (isHome) {
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto max-h-[50vh] max-w-[80vw]';
    }
    return 'bottom-0 left-0 w-auto h-[25vh]';
  };
  
  const containerClasses = [
    'absolute',
    'z-20',
    'transition-all',
    'duration-500',
    'ease-in-out',
    'cursor-pointer',
    'flex',
    'flex-col',
    'items-center',
    getPositionClasses(),
  ].join(' ');

  return (
    <div className={containerClasses} onClick={onClick}>
      <img
        src={animal.image}
        alt={animal.name}
        className="object-contain w-full h-full drop-shadow-lg"
      />
       {interactionState === 'listening' && (
        <div className="absolute -bottom-4 bg-white rounded-full p-3 shadow-lg animate-pulse">
            <MicrophoneIcon className="w-8 h-8 text-indigo-600" />
        </div>
      )}
    </div>
  );
};

export default FoxCompanion;
