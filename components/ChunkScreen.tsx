
import React from 'react';
import { HomeworkChunk, CuriosityItem } from '../types';
import CuriosityGrid from './CuriosityGrid';

interface ChunkScreenProps {
  chunk: HomeworkChunk;
  onCuriosityClick: (item: CuriosityItem) => void;
}

const ChunkScreen: React.FC<ChunkScreenProps> = ({ chunk, onCuriosityClick }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-transparent">
      <div className="w-full text-center mb-8">
        <h2 className="text-2xl text-sky-800">{chunk.concept}</h2>
      </div>

      <div className="flex flex-col items-center justify-center">
        <img src={chunk.visual} alt={chunk.concept} className="max-w-xs w-full h-64 object-contain rounded-lg shadow-lg mb-6" />
        <p className="text-xl md:text-2xl text-center text-sky-900">{chunk.question}</p>
      </div>

      <CuriosityGrid items={chunk.curiosities} onItemClick={onCuriosityClick} />
    </div>
  );
};

export default ChunkScreen;
