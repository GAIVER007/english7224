export type SpeechRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed";

export interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export interface SpeechRecognitionErrorEventLike {
  error: SpeechRecognitionErrorCode | string;
}

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function speechRecognitionErrorMessage(error: string): string {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Доступ к микрофону запрещён. Можно выполнить задание самостоятельно ниже.";
    case "network":
      return "Не удалось связаться с сервисом распознавания. Проверьте интернет или выполните задание самостоятельно.";
    case "no-speech":
      return "Речь не распознана. Попробуйте ещё раз или выполните задание самостоятельно.";
    case "audio-capture":
      return "Микрофон недоступен. Проверьте подключение или выполните задание самостоятельно.";
    case "language-not-supported":
      return "Распознавание английской речи недоступно. Выполните задание самостоятельно.";
    default:
      return "Не удалось распознать речь. Попробуйте ещё раз или выполните задание самостоятельно.";
  }
}

export function normalizeSpeechText(value: string): string {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(left: string[], right: string[]): number {
  const previous = right.map((_, index) => index + 1);
  previous.unshift(0);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current.push(
        Math.min(
          (current[rightIndex] ?? 0) + 1,
          (previous[rightIndex + 1] ?? 0) + 1,
          (previous[rightIndex] ?? 0) + (left[leftIndex] === right[rightIndex] ? 0 : 1),
        ),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length] ?? left.length;
}

function tokenCoverage(target: string[], heard: string[]): number {
  const remaining = [...heard];
  let matches = 0;

  for (const word of target) {
    const index = remaining.indexOf(word);
    if (index >= 0) {
      matches += 1;
      remaining.splice(index, 1);
    }
  }

  return target.length === 0 ? 0 : matches / target.length;
}

export interface SpeechMatchResult {
  matches: boolean;
  similarity: number;
  coverage: number;
}

/**
 * Compares recognized words with the whole target phrase. This is an approximate
 * text check only; browser speech recognition cannot score pronunciation.
 */
export function compareSpeechText(transcript: string, target: string): SpeechMatchResult {
  const heardWords = normalizeSpeechText(transcript).split(" ").filter(Boolean);
  const targetWords = normalizeSpeechText(target).split(" ").filter(Boolean);

  if (heardWords.length === 0 || targetWords.length === 0) {
    return { matches: false, similarity: 0, coverage: 0 };
  }

  const distance = editDistance(targetWords, heardWords);
  const similarity = Math.max(0, 1 - distance / Math.max(targetWords.length, heardWords.length));
  const coverage = tokenCoverage(targetWords, heardWords);
  const threshold = targetWords.length <= 2 ? 1 : 0.7;

  return {
    matches: similarity >= threshold && coverage >= threshold,
    similarity,
    coverage,
  };
}
