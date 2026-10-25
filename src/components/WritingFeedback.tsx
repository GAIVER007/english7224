import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Search } from "lucide-react";

import type { PathUnit } from "@/lib/pathway/types";
import { analyzeWriting, type WritingFeedbackReport } from "@/lib/pathway/writing-feedback";

interface WritingFeedbackProps {
  text: string;
  unit: PathUnit;
}

function russianWordCount(value: number) {
  const mod100 = value % 100;
  const mod10 = value % 10;
  if (mod100 >= 11 && mod100 <= 14) return `${value} слов`;
  if (mod10 === 1) return `${value} слово`;
  if (mod10 >= 2 && mod10 <= 4) return `${value} слова`;
  return `${value} слов`;
}

export function WritingFeedback({ text, unit }: WritingFeedbackProps) {
  const [checkedText, setCheckedText] = useState<string | null>(null);
  const [report, setReport] = useState<WritingFeedbackReport | null>(null);
  const [checkNumber, setCheckNumber] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const currentReport = checkedText === text ? report : null;

  useEffect(() => {
    if (checkNumber > 0) summaryRef.current?.focus();
  }, [checkNumber]);

  const check = () => {
    setCheckedText(text);
    setReport(analyzeWriting(text, unit));
    setCheckNumber((value) => value + 1);
  };

  return (
    <section className="mt-5" aria-labelledby="writing-feedback-title">
      <h3 id="writing-feedback-title" className="text-lg font-bold">
        Быстрая проверка текста
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Проверяет объём и несколько частых опечаток прямо на устройстве.
      </p>
      <button type="button" className="btn-ghost mt-3 min-h-11 w-full" onClick={check}>
        <Search size={18} aria-hidden="true" />
        Проверить текст
      </button>

      {currentReport && (
        <div
          ref={summaryRef}
          className="mt-4 rounded-xl border border-border bg-card p-4"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          <h4 className="font-bold">Результат проверки</h4>

          <div className="mt-3 rounded-xl bg-muted p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Статистика текста
            </p>
            <p className="mt-1 text-sm">
              Слов: {currentReport.statistics.words} · Предложений:{" "}
              {currentReport.statistics.sentences} · Символов: {currentReport.statistics.characters}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm">
              {currentReport.minimum.met ? (
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-success"
                  size={17}
                  aria-hidden="true"
                />
              ) : (
                <Info className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
              )}
              {currentReport.minimum.met
                ? `Минимум выполнен: ${currentReport.statistics.words} из ${currentReport.minimum.required} слов.`
                : `Добавь ещё ${russianWordCount(currentReport.minimum.missing)}, чтобы выполнить минимум ${currentReport.minimum.required}.`}
            </p>
          </div>

          {currentReport.copiedModel && (
            <p className="mt-3 rounded-xl bg-accent p-3 text-sm">
              Текст совпадает с примером. Напиши собственный ответ, чтобы потренировать
              самостоятельную письменную речь.
            </p>
          )}

          <div className="mt-4">
            <p className="font-semibold">Эвристические подсказки</p>
            {currentReport.hints.length > 0 ? (
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
                {currentReport.hints.map((hint) => (
                  <li key={hint.kind}>{hint.message}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm">Явных опечаток из локального набора не найдено.</p>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Это локальные подсказки по форме текста. Они не оценивают смысл, естественность речи,
            уровень CEFR или правильность всего ответа.
          </p>
        </div>
      )}
    </section>
  );
}
