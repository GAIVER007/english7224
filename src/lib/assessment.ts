import type { Lesson, Word } from "./content";
import { shuffle } from "./learning";
import { isRecallAnswerCorrect } from "./recall";

export interface AssessmentQuestion {
  id: string;
  area: "Память" | "Понимание" | "Грамматика";
  prompt: string;
  answer: string;
  explanation: string;
  options?: string[];
  audio?: string;
  wordId?: string;
}
export interface AssessmentScore {
  correct: number;
  total: number;
}

function recall(word: Word): AssessmentQuestion {
  return {
    id: `recall:${word.id}`,
    area: "Память",
    prompt: `Вспомни изученное слово: ${word.ru}`,
    answer: word.en,
    explanation: `${word.example} — ${word.exampleRu}`,
    wordId: word.id,
  };
}
function phrase(word: Word, pool: Word[], audio = false): AssessmentQuestion {
  const answer = word.exampleRu;
  const alternatives = shuffle(
    [...new Set(pool.map((item) => item.exampleRu))].filter((item) => item !== answer),
  ).slice(0, 3);
  return {
    id: `phrase:${word.id}`,
    area: "Понимание",
    prompt: audio ? "Прослушай фразу и выбери её смысл" : `Что означает: ${word.example}`,
    answer,
    options: shuffle([answer, ...alternatives]),
    explanation: `${word.example} — ${answer}`,
    wordId: word.id,
    ...(audio ? { audio: word.example } : {}),
  };
}
function grammar(lesson: Lesson): AssessmentQuestion {
  const quiz = lesson.grammarQuiz;
  return {
    id: `grammar:${lesson.day}`,
    area: "Грамматика",
    ...quiz,
    options: shuffle(quiz.options),
  };
}
/** Every mission checks production, comprehension and its own grammar rule. */
export function createMissionAssessment(lesson: Lesson): AssessmentQuestion[] {
  const words = shuffle(lesson.words);
  return [
    ...words.slice(0, 4).map(recall),
    phrase(words[0]!, lesson.words, true),
    phrase(words[1]!, lesson.words),
    grammar(lesson),
  ];
}
/** Balanced coverage: each of the five missions contributes three questions. */
export function createModuleAssessment(lessons: Lesson[]): AssessmentQuestion[] {
  const pool = lessons.flatMap((lesson) => lesson.words);
  return shuffle(
    lessons.flatMap((lesson) => {
      const words = shuffle(lesson.words);
      return [recall(words[0]!), phrase(words[1]!, pool, true), grammar(lesson)];
    }),
  );
}
export function assessmentAnswerCorrect(question: AssessmentQuestion, answer: string): boolean {
  return question.options
    ? answer === question.answer
    : isRecallAnswerCorrect(answer, question.answer);
}
