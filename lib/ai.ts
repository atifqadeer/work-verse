import { GoogleGenAI } from '@google/genai';

let client: GoogleGenAI | null = null;

function getAi() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'workverse-next' } }
    });
  }
  return client;
}

export async function generateJson<T>(prompt: string, fallback: T): Promise<T> {
  const ai = getAi();
  if (!ai) return fallback;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });
    let jsonText = response.text || '';
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText) as T;
  } catch (error) {
    console.error('Gemini generation failed', error);
    return fallback;
  }
}
