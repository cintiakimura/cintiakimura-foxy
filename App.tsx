
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Screen, HomeworkChunk, Animal, CuriosityItem } from './types';
import { INITIAL_ANIMAL } from './constants';
import { 
  generateHomeworkChunks, 
  evaluateAnswer, 
  respondToUserJoke,
  respondToVent,
  explainCuriosity,
  tellAIGeneratedJoke,
  tellAIGeneratedFact
} from './services/grokApi';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { useSpeechToText } from './hooks/useSpeechToText';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import ChunkScreen from './components/ChunkScreen';
import BreakScreen from './components/BreakScreen';
import CollectionScreen from './components/CollectionScreen';
import SessionCompleteScreen from './components/SessionCompleteScreen';
import LoadingIndicator from './components/LoadingIndicator';
import FoxCompanion from './components/FoxCompanion';
import MyLessonsScreen from './components/MyLessonsScreen';
import BottomNavBar from './components/BottomNavBar';

type FoxState = 'corner' | 'center';
type InteractionState = 'idle' | 'speaking' | 'listening' | 'thinking';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [homeworkChunks, setHomeworkChunks] = useState<HomeworkChunk[]>([]);
  const [completedLessons, setCompletedLessons] = useState<HomeworkChunk[][]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [foxState, setFoxState] = useState<FoxState>('corner');
  const [interactionState, setInteractionState] = useState<InteractionState>('idle');
  
  const [activeAnimal, setActiveAnimal] = useState<Animal>(INITIAL_ANIMAL);
  const [collectedAnimals, setCollectedAnimals] = useState<Animal[]>([INITIAL_ANIMAL]);
  
  const interactionContext = useRef<any>(null);

  const resetInteraction = () => {
    setFoxState('corner');
    setInteractionState('idle');
  };

  const handleChunkComplete = useCallback(() => {
    const nextIndex = currentChunkIndex + 1;
    if (currentChunkIndex === 1) { 
      setCurrentScreen(Screen.BREAK);
      setCurrentChunkIndex(nextIndex);
    } else if (nextIndex < homeworkChunks.length) {
      setCurrentChunkIndex(nextIndex);
    } else {
      setCompletedLessons(prev => [...prev, homeworkChunks]);
      const newAccessory = `Acessório #${activeAnimal.accessories.length + 1}`;
      const updatedAnimal = {
        ...activeAnimal,
        accessories: [...activeAnimal.accessories, newAccessory]
      };
      setActiveAnimal(updatedAnimal);
      setCollectedAnimals(prev => prev.map(a => a.id === activeAnimal.id ? updatedAnimal : a));
      setCurrentScreen(Screen.SESSION_COMPLETE);
    }
  }, [currentChunkIndex, homeworkChunks, activeAnimal]);

  const { speak } = useTextToSpeech();

  const handleSpeechResult = useCallback(async (transcript: string) => {
    setInteractionState('thinking');
    const { context, type } = interactionContext.current;

    try {
        if (type === 'answer') {
            const result = await evaluateAnswer(context.question, transcript, context.answerKeywords, navigator.language);
            speak(result.feedback, () => {
                if(result.isCorrect) {
                    handleChunkComplete();
                }
                resetInteraction();
            });
        } else if (type === 'break_joke') {
            const response = await respondToUserJoke(transcript, navigator.language);
            speak(response, resetInteraction);
        } else if (type === 'vent') {
            const response = await respondToVent(transcript, navigator.language);
            speak(response, resetInteraction);
        }
    } catch (e) {
        speak("Hmm, não entendi muito bem. Podemos tentar de novo?", resetInteraction);
    }
  }, [handleChunkComplete, speak]);

  const handleListeningError = useCallback((error: string) => {
    if (error === 'no-speech') {
        speak("Desculpe, eu não ouvi nada. Pode repetir?", () => {
            setInteractionState('listening');
            setTimeout(startListening, 500);
        });
    } else {
        speak("Hmm, tive um probleminha para ouvir. Podemos tentar de novo mais tarde?", resetInteraction);
    }
  }, [speak]);

  const { startListening } = useSpeechToText(handleSpeechResult, handleListeningError);
  
  const handleFoxTap = useCallback(async () => {
    if (foxState === 'center') {
      resetInteraction();
      return;
    }

    setFoxState('center');
    setInteractionState('speaking');

    switch (currentScreen) {
        case Screen.CHUNK:
            const chunk = homeworkChunks[currentChunkIndex];
            interactionContext.current = { context: chunk, type: 'answer' };
            speak(chunk.explanation, () => {
                setInteractionState('listening');
                setTimeout(startListening, 500); 
            });
            break;
        case Screen.BREAK:
            const actions = ['joke', 'fact', 'listen_joke'];
            const action = actions[Math.floor(Math.random()*actions.length)];
            
            setInteractionState('thinking');
            if (action === 'joke') {
                const text = await tellAIGeneratedJoke(navigator.language);
                setInteractionState('speaking');
                speak(text, resetInteraction);
            } else if (action === 'fact') {
                const text = await tellAIGeneratedFact(navigator.language);
                setInteractionState('speaking');
                speak(text, resetInteraction);
            } else {
                interactionContext.current = { context: null, type: 'break_joke' };
                setInteractionState('speaking');
                speak("Você quer me contar uma piada?", () => { setInteractionState('listening'); setTimeout(startListening, 500); });
            }
            break;
        default:
            interactionContext.current = { context: null, type: 'vent' };
            speak("O que você quer conversar?", () => {
                setInteractionState('listening');
                setTimeout(startListening, 500);
            });
            break;
    }
  }, [foxState, currentScreen, homeworkChunks, currentChunkIndex, speak, startListening]);
  
  const startHomework = useCallback(async () => {
    setIsLoading(true);
    // This is example text. In a real app, this would come from an OCR service.
    const ocrText = "Matemática: 1. Quanto é 2 + 3? 2. Se você tem 5 balões e 1 voa, quantos restam? Leitura: 3. A frase é 'O gato sentou no tapete'. Onde o gato sentou?";

    try {
      const parsedChunks = await generateHomeworkChunks(ocrText, navigator.language);

      // In a real app, we'd generate images with an AI. Here we use placeholders.
      const chunksWithData = parsedChunks.map((chunk, index) => {
        const curiositiesWithImages = (chunk.curiosities || []).map((cur, i) => ({
            ...cur,
            imageUrl: `https://picsum.photos/seed/${chunk.id}-${i}/200`
        }));
        return {
          ...chunk,
          visual: index === 0 ? "https://i.imgur.com/gsv2L9z.png" : (index === 1 ? "https://i.imgur.com/kFLkC2a.png" : "https://i.imgur.com/6Xkbf2z.png"),
          curiosities: curiositiesWithImages
        };
      });

      setHomeworkChunks(chunksWithData);
      setCurrentChunkIndex(0);
      setActiveAnimal(INITIAL_ANIMAL);
      setCurrentScreen(Screen.CHUNK);
    } catch (error) {
      console.error("Failed to parse homework from Gemini:", error);
      alert("Ops! Não consegui entender a lição de casa. Podemos tentar de novo?");
      setCurrentScreen(Screen.HOME);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBreakComplete = useCallback(() => {
    setCurrentScreen(Screen.CHUNK);
  }, []);
  
  const resetSession = useCallback(() => {
    setCurrentChunkIndex(0);
    setHomeworkChunks([]);
    setCurrentScreen(Screen.HOME);
    resetInteraction();
  }, []);

  const handleSelectAnimal = (animal: Animal) => {
    setActiveAnimal(animal);
    setCurrentScreen(Screen.HOME);
  };
  
  const handleCuriosityClick = useCallback(async (item: CuriosityItem) => {
        setFoxState('center');
        setInteractionState('thinking');
        const explanation = await explainCuriosity(item.topic, navigator.language);
        setInteractionState('speaking');
        speak(explanation, resetInteraction);
  }, [speak]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen />;
      case Screen.CAMERA:
        return <CameraScreen onPhotoTaken={startHomework} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.CHUNK:
        return homeworkChunks.length > 0 ? <ChunkScreen chunk={homeworkChunks[currentChunkIndex]} onCuriosityClick={handleCuriosityClick} /> : <HomeScreen />;
      case Screen.BREAK:
        return <BreakScreen onComplete={handleBreakComplete} />;
      case Screen.COLLECTION:
        return <CollectionScreen animals={collectedAnimals} onSelectAnimal={handleSelectAnimal} />;
      case Screen.SESSION_COMPLETE:
        return <SessionCompleteScreen animal={activeAnimal} onContinue={resetSession} />;
      case Screen.MY_LESSONS:
        return <MyLessonsScreen completedLessons={completedLessons} />;
      default:
        return <HomeScreen />;
    }
  };
  
  const showNavBar = [Screen.HOME, Screen.COLLECTION, Screen.MY_LESSONS, Screen.CAMERA].includes(currentScreen);

  return (
    <div className="w-screen h-screen overflow-hidden text-gray-800 bg-transparent p-4 flex justify-center items-center">
       <style>
        {`
          @keyframes gentle-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 112, 219, 0.4); }
            5% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(147, 112, 219, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 112, 219, 0); }
          }
          .animate-gentle-pulse {
            animation: gentle-pulse 10s infinite;
          }
        `}
      </style>
      <div className="w-full h-full max-w-md relative">
        <div className="w-full h-full flex flex-col">
          {currentScreen !== Screen.CAMERA && <h1 className="font-kaushan text-5xl text-indigo-600 absolute top-4 left-6 z-10">Foxy</h1>}
          {(isLoading || interactionState === 'thinking') && <LoadingIndicator />}
          
          <button
            onClick={handleFoxTap}
            className="absolute top-4 right-4 z-30 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform opacity-90 animate-gentle-pulse"
            aria-label="Precisa de um abraço?"
          >
            <img src="https://i.ibb.co/xtp8fwZX/ai-avatar-fox-app.png" alt="Precisa de um abraço?" className="w-full h-full object-contain rounded-full" />
          </button>
          
          <div className={`w-full h-full flex flex-col transition-all duration-500 ${foxState === 'center' ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <div className={`flex-grow relative ${currentScreen !== Screen.CAMERA ? 'pt-24' : ''}`}>
                {renderScreen()}
              </div>
              {showNavBar && <BottomNavBar activeScreen={currentScreen} onNavigate={handleNavigate} />}
          </div>
        </div>

        <FoxCompanion 
          animal={activeAnimal} 
          state={foxState}
          interactionState={interactionState}
          onClick={handleFoxTap}
          currentScreen={currentScreen}
        />
      </div>
    </div>
  );
};

export default App;
