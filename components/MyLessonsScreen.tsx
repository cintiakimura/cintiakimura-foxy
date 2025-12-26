
import React from 'react';
import { HomeworkChunk } from '../types';

interface MyLessonsScreenProps {
  completedLessons: HomeworkChunk[][];
}

const MyLessonsScreen: React.FC<MyLessonsScreenProps> = ({ completedLessons }) => {
  if (completedLessons.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl text-gray-800 mb-4">Minhas Lições</h1>
        <p className="text-lg text-gray-600">Você ainda não completou nenhuma lição. Complete uma para vê-la aqui!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h1 className="text-3xl text-gray-800 text-center my-4">Minhas Lições</h1>
      <div className="flex-grow overflow-y-auto space-y-4">
        {completedLessons.map((lesson, lessonIndex) => (
          <div key={lessonIndex} className="bg-white/50 rounded-lg p-4 shadow">
            <h2 className="text-xl text-gray-800 mb-2">Lição {lessonIndex + 1}</h2>
            <ul className="list-disc list-inside">
              {lesson.map(chunk => (
                <li key={chunk.id} className="text-gray-700">{chunk.concept}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLessonsScreen;
