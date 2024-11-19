type Correction = {
  original: string;
  corrected: string;
};

type AdvancedSuggestion = {
  text: string;
  explanation: string;
};

type EssayFeedback = {
  corrections: Correction[];
  advanced_suggestions: AdvancedSuggestion[];
  score: number;
  summary: string;
};
