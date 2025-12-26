
import React from 'react';
import { Screen } from '../types';
import HomeIcon from './icons/HomeIcon';
import CameraIcon from './icons/CameraIcon';
import LessonsIcon from './icons/LessonsIcon';
import CollectionIcon from './icons/CollectionIcon';

interface BottomNavBarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const iconColor = '#4f46e5'; // Indigo-600

  const wrapperClasses = [
    'p-2',
    'rounded-full',
    'transition-all',
    'duration-300',
    isActive ? 'shadow-[0_0_15px_rgba(79,70,229,0.8)] bg-indigo-600/20' : ''
  ].join(' ');

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-1 py-1 group"
      aria-label={label}
    >
      <div className={wrapperClasses}>
        {React.cloneElement(icon, { className: "w-7 h-7", style: { color: iconColor } })}
      </div>
      <span className={`text-xs mt-1 transition-colors`} style={{ color: iconColor }}>{label}</span>
    </button>
  );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, onNavigate }) => {
  return (
    <nav className="w-full flex justify-around">
      <NavButton
        label="Início"
        icon={<HomeIcon className='' />}
        isActive={activeScreen === Screen.HOME}
        onClick={() => onNavigate(Screen.HOME)}
      />
      <NavButton
        label="Nova Lição"
        icon={<CameraIcon className='' />}
        isActive={activeScreen === Screen.CAMERA}
        onClick={() => onNavigate(Screen.CAMERA)}
      />
      <NavButton
        label="Minhas Lições"
        icon={<LessonsIcon className='' />}
        isActive={activeScreen === Screen.MY_LESSONS}
        onClick={() => onNavigate(Screen.MY_LESSONS)}
      />
      <NavButton
        label="Coleção"
        icon={<CollectionIcon className='' />}
        isActive={activeScreen === Screen.COLLECTION}
        onClick={() => onNavigate(Screen.COLLECTION)}
      />
    </nav>
  );
};

export default BottomNavBar;
