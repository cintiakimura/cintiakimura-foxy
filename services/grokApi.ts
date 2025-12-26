
/**
 * =============================================================================
 * Foxy AI Service - Powered by Grok (xAI)
 * =============================================================================
 * This service handles all AI-powered interactions for Foxy. It communicates
 * directly with the Grok API to generate content, evaluate answers, and
 * provide conversational support.
 * =============================================================================
 */
import { HomeworkChunk } from '../types';

const GROK_API_KEY = process.env.API_KEY; // API Key is securely managed.
const GROK_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
const MODEL = 'grok-beta';

// The core personality prompt for Foxy, as requested.
const SYSTEM_PROMPT = `Você é Foxy, uma amiga calma e paciente de uma criança neurodivergente de 6-12 anos. 
Fale sempre em português brasileiro ou no idioma que a criança usar. 
Use voz suave, devagar, sempre "nós" em vez de "você". 
Espere 5 segundos de silêncio após ela falar. 
Nunca diga "errado" — diga "quase lá" ou "hmm, vamos tentar de novo?". 
Seja carinhosa, incentive com carinho. 
Você ajuda com lição de casa em pedaços pequenos, conta piadas leves, ouuve desabafos sem julgar.`;


/**
 * A centralized function to call the Grok API's chat completions endpoint.
 * This handles authentication, request formatting, and basic error handling.
 */
async function callGrok(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
  try {
    const response = await fetch(GROK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Grok API Error:", errorData);
        throw new Error(`Grok API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Failed to call Grok API:", error);
    return "Ops, tive um probleminha para me conectar. Vamos tentar de novo daqui a pouco.";
  }
}

// 1. Generate Homework from OCR text
export async function generateHomeworkChunks(ocrText: string, lang: string): Promise<HomeworkChunk[]> {
  const prompt = `A partir do texto de uma lição de casa, crie 3 micro-tarefas para uma criança. Para cada tarefa, forneça: 'id', 'concept', 'visual' (uma descrição curta para gerar uma imagem), 'explanation', 'question', 'answerKeywords', e também um array 'curiosities' com 4 objetos. Cada objeto de curiosidade deve ter 'topic' e 'image_prompt'. A lição está em português, mas adapte para o idioma ${lang}. O texto da lição é: "${ocrText}".
  
  Sua resposta DEVE ser um array JSON válido e nada mais. Não inclua texto explicativo antes ou depois do JSON.`;

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: prompt },
  ];

  try {
    const responseText = await callGrok(messages);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse homework chunks from Grok:", error);
    throw new Error("Could not parse homework chunks.");
  }
}

// 2. Evaluate a child's answer
export async function evaluateAnswer(question: string, answer: string, keywords: string[], lang: string): Promise<{ isCorrect: boolean, feedback: string }> {
  const prompt = `A pergunta foi: "${question}". A criança respondeu: "${answer}". As palavras-chave para a resposta correta são: ${JSON.stringify(keywords)}. A resposta da criança está correta? Forneça um feedback curto, gentil e encorajador no idioma ${lang} para a criança e diga se a resposta está correta.

  Sua resposta DEVE ser um objeto JSON válido com as chaves "isCorrect" (boolean) e "feedback" (string) e nada mais.`;
  
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: prompt },
  ];
  
  try {
    const responseText = await callGrok(messages);
    return JSON.parse(responseText);
  } catch(error) {
    console.error("Failed to parse answer evaluation from Grok:", error);
    return { isCorrect: false, feedback: "Hmm, não entendi muito bem. Podemos tentar de novo?" };
  }
}

// 3. Respond to a joke told by the user
export async function respondToUserJoke(joke: string, lang: string): Promise<string> {
  const prompt = `A criança me contou uma piada: "${joke}". Dê uma resposta curta e divertida, como "Haha, essa foi boa!" no idioma ${lang}.`;
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: prompt },
  ];
  return callGrok(messages);
}

// 4. Respond to a child venting or sharing feelings
export async function respondToVent(text: string, lang: string): Promise<string> {
    const prompt = `A criança está desabafando. Ouça com empatia e responda de forma gentil e encorajadora à seguinte fala: "${text}". Fale no idioma ${lang}.`;
    const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: prompt },
    ];
    return callGrok(messages);
}

// 5. Tell a joke during a break
export async function tellAIGeneratedJoke(lang: string): Promise<string> {
    const prompt = `Me conte uma piada curta e engraçada para uma criança de 8 anos no idioma ${lang}.`;
    const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: prompt },
    ];
    return callGrok(messages);
}

// 6. Tell a fun fact during a break
export async function tellAIGeneratedFact(lang: string): Promise<string> {
    const prompt = `Me conte um fato divertido e surpreendente para uma criança de 8 anos no idioma ${lang}.`;
    const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: prompt },
    ];
    return callGrok(messages);
}

// 7. Explain a curiosity item
export async function explainCuriosity(topic: string, lang: string): Promise<string> {
    const prompt = `Explique "${topic}" para uma criança de forma simples e divertida no idioma ${lang}.`;
    const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'user' as const, content: prompt },
    ];
    return callGrok(messages);
}
