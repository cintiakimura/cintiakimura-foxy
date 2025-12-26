
import React from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface CameraScreenProps {
  onPhotoTaken: () => void;
  onBack: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onPhotoTaken, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 bg-gray-800 text-white">
      <div className="w-full flex justify-start">
        <button onClick={onBack} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
          <ChevronLeftIcon className="w-6 h-6"/>
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-sm aspect-square border-4 border-dashed border-gray-500 rounded-2xl flex items-center justify-center mb-8">
            <p className="text-gray-400">Câmera (Simulação)</p>
        </div>
        <p className="text-center mb-4">Aponte a câmera para a lição de casa e aperte o botão!</p>
        <p className="text-xs text-gray-500 mb-8">(Para esta demonstração, usaremos uma lição de exemplo)</p>
        <input type="file" accept="image/*" capture="environment" className="hidden" />
      </div>
      
      <button 
        onClick={onPhotoTaken}
        className="w-20 h-20 bg-white rounded-full border-4 border-orange-500 shadow-lg flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
      </button>
    </div>
  );
};

export default CameraScreen;
