
import React from 'react';
import { CuriosityItem } from '../types';

interface CuriosityGridProps {
  items: CuriosityItem[];
  onItemClick: (item: CuriosityItem) => void;
}

const CuriosityGrid: React.FC<CuriosityGridProps> = ({ items, onItemClick }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mt-8">
      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 4).map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick(item)}
            className="aspect-square bg-white/30 rounded-lg flex items-center justify-center p-2 text-center text-sm text-gray-700 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <img src={item.imageUrl} alt={item.topic} className="absolute top-0 left-0 w-full h-full object-contain opacity-50 p-1"/>
            <span className="relative bg-white/80 p-1 rounded z-10">{item.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuriosityGrid;
