import { GoogleGenAI, Type } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('[AfriFlights] GEMINI_API_KEY est manquant. Les routes IA retourneront des erreurs 500.');
}

export const ai = new GoogleGenAI({
  apiKey: geminiApiKey || '',
});

export { Type };