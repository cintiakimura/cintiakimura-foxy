
export enum Screen {
  HOME,
  CAMERA,
  CHUNK,
  BREAK,
  COLLECTION,
  SESSION_COMPLETE,
  MY_LESSONS
}

export interface CuriosityItem {
  topic: string;
  image_prompt: string;
  imageUrl: string;
}

export interface HomeworkChunk {
  id: number;
  concept: string;
  visual: string;
  explanation: string;
  question: string;
  answerKeywords: string[];
  curiosities: CuriosityItem[];
}

export interface Animal {
  id: number;
  name: string;
  image: string;
  accessories: string[];
}
