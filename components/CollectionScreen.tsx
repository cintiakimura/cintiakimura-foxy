
import React from 'react';
import { Animal } from '../types';

interface CollectionScreenProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
}

const CollectionScreen: React.FC<CollectionScreenProps> = ({ animals, onSelectAnimal }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-transparent">
      <h1 className="text-3xl text-gray-800 text-center my-4">Minha Coleção</h1>
      <div className="flex-grow overflow-y-auto rounded-lg p-2">
        <div className="grid grid-cols-3 gap-4">
          {animals.map(animal => (
            <div 
              key={animal.id} 
              onClick={() => onSelectAnimal(animal)} 
              className="bg-white/30 rounded-xl shadow-md p-2 flex items-center justify-center cursor-pointer aspect-square hover:bg-white/50 transition-colors"
            >
              <img src={animal.image} alt={animal.name} className="w-full h-full object-contain"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionScreen;
