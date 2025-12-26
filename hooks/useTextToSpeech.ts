
import { useState, useCallback, useEffect } from 'react';

// A list of common identifiers for female voices across different platforms/browsers.
// This is a heuristic approach as the Web Speech API doesn't standardize gender.
const FEMALE_VOICE_IDENTIFIERS = [
  // English
  'Samantha', 'Victoria', 'Karen', 'Tessa', 'Fiona',
  // Portuguese
  'Google português do Brasil', 'Luciana', 'Maria', 'Francisca',
  // Spanish
  'Mónica', 'Paulina', 'Isabela',
  // French
  'Amélie', 'Chantal', 'Aurelie',
  // German
  'Anna', 'Steffi', 'Yannick',
  // Italian
  'Alice', 'Paola', 'Federica',
  // Generic
  'Female', 'Femme'
];


export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const loadVoices = useCallback(() => {
    setVoices(window.speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [loadVoices]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = navigator.language || 'pt-BR';
    let voiceToUse: SpeechSynthesisVoice | null = null;

    if (voices.length > 0) {
        // Get all voices for the target language (e.g., 'en-US' should match 'en').
        const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));

        // Try to find a preferred female voice from the list.
        voiceToUse = langVoices.find(v =>
          FEMALE_VOICE_IDENTIFIERS.some(id => v.name.includes(id))
        ) || null;

        // If no preferred female voice is found, fall back to the first available voice for the language.
        if (!voiceToUse && langVoices.length > 0) {
          voiceToUse = langVoices[0];
        }
    }
    
    // If still no specific voice, let the browser choose its default for the language.
    utterance.voice = voiceToUse;
    utterance.lang = lang;
    utterance.pitch = 1; // Neutral pitch
    utterance.rate = 0.85; // Slightly slower for a calmer tone
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
        if (onEnd) onEnd();
    }
    
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, voices]);

  return { speak };
};
