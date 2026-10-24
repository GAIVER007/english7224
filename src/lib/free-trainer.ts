import { normalizeRecallAnswer } from "./recall";

export type Tense = "present" | "past" | "future";
export type SentenceForm = "positive" | "negative" | "question";
export const TENSES: Record<Tense, string> = {
  present: "Present Simple",
  past: "Past Simple",
  future: "Future Simple",
};
export const FORMS: Record<SentenceForm, string> = {
  positive: "Утверждение",
  negative: "Отрицание",
  question: "Вопрос",
};
export interface GrammarTask {
  id: string;
  tense: Tense;
  form: SentenceForm;
  ru: string;
  en: string;
  verb: string;
  rule: string;
}

const subjects = [
  { en: "He", ru: "Он", gender: "m", third: true },
  { en: "She", ru: "Она", gender: "f", third: true },
  { en: "We", ru: "Мы", gender: "p", third: false },
  { en: "They", ru: "Они", gender: "p", third: false },
] as const;
const verbs = [
  {
    en: "work",
    third: "works",
    past: "worked",
    tail: "at home",
    ru: "работать",
    present: ["работает", "работаем", "работают"],
    pastRu: ["работал", "работала", "работали"],
    tailRu: "дома",
  },
  {
    en: "study",
    third: "studies",
    past: "studied",
    tail: "English",
    ru: "изучать",
    present: ["изучает", "изучаем", "изучают"],
    pastRu: ["изучал", "изучала", "изучали"],
    tailRu: "английский",
  },
  {
    en: "cook",
    third: "cooks",
    past: "cooked",
    tail: "dinner",
    ru: "готовить",
    present: ["готовит", "готовим", "готовят"],
    pastRu: ["готовил", "готовила", "готовили"],
    tailRu: "ужин",
  },
  {
    en: "watch",
    third: "watches",
    past: "watched",
    tail: "films",
    ru: "смотреть",
    present: ["смотрит", "смотрим", "смотрят"],
    pastRu: ["смотрел", "смотрела", "смотрели"],
    tailRu: "фильмы",
  },
  {
    en: "read",
    third: "reads",
    past: "read",
    tail: "books",
    ru: "читать",
    present: ["читает", "читаем", "читают"],
    pastRu: ["читал", "читала", "читали"],
    tailRu: "книги",
  },
  {
    en: "play",
    third: "plays",
    past: "played",
    tail: "tennis",
    ru: "играть",
    present: ["играет", "играем", "играют"],
    pastRu: ["играл", "играла", "играли"],
    tailRu: "в теннис",
  },
];

export function grammarTasks(): GrammarTask[] {
  const tasks: GrammarTask[] = [];
  for (const subject of subjects)
    for (const verb of verbs)
      for (const tense of Object.keys(TENSES) as Tense[])
        for (const form of Object.keys(FORMS) as SentenceForm[]) {
          const auxiliary =
            tense === "future" ? "will" : tense === "past" ? "did" : subject.third ? "does" : "do";
          const main = tense === "past" ? verb.past : subject.third ? verb.third : verb.en;
          const en =
            form === "question"
              ? `${auxiliary[0]!.toUpperCase()}${auxiliary.slice(1)} ${subject.en.toLowerCase()} ${verb.en} ${verb.tail}?`
              : form === "negative"
                ? `${subject.en} ${auxiliary} not ${verb.en} ${verb.tail}.`
                : `${subject.en} ${tense === "future" ? `will ${verb.en}` : main} ${verb.tail}.`;
          const presentIndex = subject.third ? 0 : subject.en === "We" ? 1 : 2;
          const pastIndex = subject.gender === "m" ? 0 : subject.gender === "f" ? 1 : 2;
          const ruVerb =
            tense === "present"
              ? verb.present[presentIndex]
              : tense === "past"
                ? verb.pastRu[pastIndex]
                : `${subject.third ? "будет" : subject.en === "We" ? "будем" : "будут"} ${verb.ru}`;
          const ru = `${subject.ru} ${form === "negative" ? "не " : ""}${ruVerb} ${verb.tailRu}${form === "question" ? "?" : "."}`;
          const rule =
            form === "question"
              ? `${auxiliary} ставится перед подлежащим. После него — начальная форма ${verb.en}, без -s и -ed.`
              : form === "negative"
                ? `Подлежащее + ${auxiliary} not + ${verb.en}. После вспомогательного глагола основной остаётся в начальной форме.`
                : tense === "future"
                  ? `Подлежащее + will + ${verb.en}.`
                  : tense === "past"
                    ? `В Past Simple нужна прошедшая форма: ${verb.en} → ${verb.past}.${verb.en === "read" ? " Прошедшая форма read произносится /red/." : ""}`
                    : subject.third
                      ? `С he/she в Present Simple: ${verb.en} → ${verb.third}.`
                      : `С we/they в Present Simple используется начальная форма: ${verb.en}.`;
          tasks.push({
            id: `${subject.en}-${verb.en}-${tense}-${form}`,
            tense,
            form,
            ru,
            en,
            verb: verb.en,
            rule,
          });
        }
  return tasks;
}

export function grammarAnswerCorrect(answer: string, expected: string) {
  const normalize = (text: string) =>
    normalizeRecallAnswer(text)
      .replace(/\bwon't\b/g, "will not")
      .replace(/\bdon't\b/g, "do not")
      .replace(/\bdoesn't\b/g, "does not")
      .replace(/\bdidn't\b/g, "did not")
      .replace(/\b(he|she|we|they)'ll\b/g, "$1 will");
  return normalize(answer) === normalize(expected);
}

export function appendGrammarResult(history: boolean[], correct: boolean) {
  return [...history, correct].slice(-100);
}
