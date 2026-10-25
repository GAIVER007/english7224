export const PATH_LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"] as const;
export type PathLevel = (typeof PATH_LEVELS)[number];
export interface PathQuestion {
  skill: "grammar" | "reading" | "listening";
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}
export interface PathUnit {
  id: string;
  level: PathLevel;
  title: string;
  goal: string;
  theory: string;
  examples: string[];
  vocabulary: { en: string; ru: string }[];
  reading: string;
  listening: string;
  questions: PathQuestion[];
  writing: { prompt: string; minWords: number; model: string; checklist: string[] };
  speaking: { prompt: string; model: string; checklist: string[] };
}
