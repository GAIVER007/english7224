import type { Word } from "./content";
import { shuffle, wordPool } from "./learning";

export type Area = "Vocabulary" | "Phrases" | "Listening";
export const AREA_LABELS: Record<Area, string> = {
  Vocabulary: "Слова",
  Phrases: "Фразы",
  Listening: "Аудирование",
};
export interface ExamQuestion {
  area: Area;
  prompt: string;
  audio?: string;
  options: string[];
  answer: string;
  wordId: string;
}

export function createExam(words: Word[], audioAvailable: boolean): ExamQuestion[] {
  return shuffle(words)
    .slice(0, 9)
    .map((word, index) => {
      const area: Area =
        index % 3 === 0
          ? "Vocabulary"
          : index % 3 === 1 || !audioAvailable
            ? "Phrases"
            : "Listening";
      const value = (item: Word) =>
        area === "Vocabulary" ? item.ru : area === "Phrases" ? item.phrases[0]!.en : item.example;
      const answer = value(word);
      const alternatives = [
        ...new Set(wordPool.filter((item) => item.id !== word.id).map(value)),
      ].filter((item) => item !== answer);
      return {
        area,
        wordId: word.id,
        answer,
        prompt:
          area === "Vocabulary"
            ? `Перевод: «${word.en}»`
            : area === "Phrases"
              ? `Как сказать: «${word.phrases[0]!.ru}»`
              : "Что вы услышали?",
        ...(area === "Listening" ? { audio: word.example } : {}),
        options: shuffle([answer, ...shuffle(alternatives).slice(0, 3)]),
      };
    });
}

export function replaceAudioQuestion(question: ExamQuestion): ExamQuestion {
  if (question.area !== "Listening") return question;
  const word = wordPool.find((item) => item.id === question.wordId)!;
  const answer = word.phrases[0]!.en;
  const alternatives = [...new Set(wordPool.map((item) => item.phrases[0]!.en))].filter(
    (item) => item !== answer,
  );
  return {
    area: "Phrases",
    wordId: word.id,
    prompt: `Как сказать: «${word.phrases[0]!.ru}»`,
    answer,
    options: shuffle([answer, ...shuffle(alternatives).slice(0, 3)]),
  };
}
