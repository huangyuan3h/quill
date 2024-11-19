import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
} from '@google/generative-ai';

export const getGoogleGeminiClient = () => {
  if (!process.env.GEMINI_KEY) return undefined;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

  const safetySettings: SafetySetting[] = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 1,
      responseMimeType: 'application/json',
    },
    safetySettings,
  });
  return model;
};

export function fileToGenerativePart(content: string, mimeType: string) {
  return {
    inlineData: {
      data: content,
      mimeType,
    },
  };
}
