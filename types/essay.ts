type Correction = {
  original: string;
  corrected: string;
};

type AdvancedSuggestion = {
  text: string;
  explanation: string;
};

export type EssayImage = { inlineData: { data: string; mimeType: string } };

export type EssayFeedback = {
  corrections: Correction[];
  advanced_suggestions: AdvancedSuggestion[];
  score: number;
  summary: string;
};
