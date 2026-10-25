import { useEffect, useId, useState } from "react";
import { speak } from "@/lib/store";
import { checkDictation, dictationPhrases } from "@/lib/pathway/dictation";
import type { PathUnitProgress } from "@/lib/pathway/state";

type Entry = NonNullable<PathUnitProgress["dictation"]>[number];
export function DictationPractice({
  text,
  saved = [],
  onChange,
}: {
  text: string;
  saved?: PathUnitProgress["dictation"];
  onChange: (entries: Entry[]) => void;
}) {
  const phrases = dictationPhrases(text);
  const [index, setIndex] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const fieldId = useId();
  useEffect(() => {
    const failed = () => setAudioError(true);
    window.addEventListener("speakup-audio-error", failed);
    return () => {
      window.removeEventListener("speakup-audio-error", failed);
      window.speechSynthesis?.cancel();
    };
  }, []);
  const target = phrases[index];
  if (!target) return null;
  const entries = phrases.map(
    (phrase): Entry =>
      saved.find((entry) => entry.target === phrase) ?? {
        target: phrase,
        draft: "",
        checked: false,
        revealed: false,
        completed: false,
      },
  );
  const entry = entries[index]!;
  const result = checkDictation(target, entry.draft);
  const patch = (change: Partial<Entry>) =>
    onChange(entries.map((item, i) => (i === index ? { ...item, ...change } : item)));
  const listen = (rate: number) => {
    setAudioError(false);
    speak(target, rate);
  };
  return (
    <details className="border-t pt-4">
      <summary className="cursor-pointer min-h-12 font-semibold">Диктант на слух</summary>
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Послушай фразу и напиши её по-английски. Регистр и пунктуация не учитываются; сокращения
          пиши как в записи.
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Фразы диктанта">
          {phrases.map((phrase, i) => (
            <button
              key={phrase}
              type="button"
              className={i === index ? "btn-primary min-h-11" : "btn-ghost min-h-11"}
              aria-pressed={i === index}
              onClick={() => {
                window.speechSynthesis?.cancel();
                setAudioError(false);
                setIndex(i);
              }}
            >
              Фраза {i + 1}
              {entries[i]?.completed ? " · ✓" : ""}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => listen(1)}>
            Слушать фразу
          </button>
          <button type="button" className="btn-ghost" onClick={() => listen(0.75)}>
            Медленнее
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => window.speechSynthesis?.cancel()}
          >
            Стоп
          </button>
        </div>
        {audioError && (
          <p role="alert" className="text-sm text-destructive">
            Не удалось включить озвучку. Проверь звук и английский голос устройства. Можно открыть
            текст для самостоятельного повтора.
          </p>
        )}
        <label className="block font-medium" htmlFor={fieldId}>
          Что ты услышал?
        </label>
        <textarea
          id={fieldId}
          lang="en"
          className="input-field min-h-28 w-full"
          value={entry.draft}
          maxLength={1000}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => patch({ draft: event.target.value, checked: false })}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary"
            disabled={!entry.draft.trim() || entry.checked}
            onClick={() =>
              patch({
                checked: true,
                completed: entry.completed || (result.correct && !entry.revealed),
                revealed: entry.revealed || !result.correct,
              })
            }
          >
            Проверить фразу
          </button>
          <button type="button" className="btn-ghost" onClick={() => patch({ revealed: true })}>
            Показать ответ
          </button>
        </div>
        {entry.checked && (
          <div role="status" className="space-y-2">
            <p className="font-semibold">
              {result.correct
                ? entry.revealed
                  ? "Совпадает с образцом. Повтори без подсказки."
                  : "Верно — все слова на месте."
                : "Сравни слова и попробуй ещё раз."}
            </p>
            {!result.correct && (
              <ul className="space-y-1 text-sm">
                {result.differences.map((difference, i) => (
                  <li key={i}>
                    {difference.expected && difference.actual
                      ? `Вместо «${difference.actual}»: ${difference.expected}`
                      : difference.expected
                        ? `Пропущено: ${difference.expected}`
                        : `Лишнее слово: ${difference.actual}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {entry.revealed && (
          <p lang="en" className="rounded-xl bg-muted p-4 break-words">
            {target}
          </p>
        )}
        {(entry.checked || entry.revealed) && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => patch({ draft: "", checked: false, revealed: false })}
          >
            Повторить без подсказки
          </button>
        )}
        <p className="text-xs text-muted-foreground">
          Черновик и отметки сохраняются. Это дополнительная практика без XP; озвучка зависит от
          устройства.
        </p>
      </div>
    </details>
  );
}
