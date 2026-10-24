import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { coachModes, coachPrompt, type CoachMode } from "@/lib/coach-prompt";
import type { AppState } from "@/lib/store";

export function CoachBridge({ state }: { state: AppState }) {
  const [mode, setMode] = useState<CoachMode>("conversation");
  const [status, setStatus] = useState("");
  const prompt = coachPrompt(state, mode);
  return (
    <details className="coach-bridge">
      <summary>
        Практика с ChatGPT <span>По твоим темам и ошибкам</span>
      </summary>
      <p className="text-sm text-muted-foreground">
        Выбери формат, скопируй задание и вставь в новый чат. Приложение ничего не отправляет
        автоматически.
      </p>
      <fieldset className="coach-modes">
        <legend className="sr-only">Формат практики</legend>
        {(Object.keys(coachModes) as CoachMode[]).map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="coach-mode"
              checked={mode === value}
              onChange={() => {
                setMode(value);
                setStatus("");
              }}
            />
            <span>{coachModes[value]}</span>
          </label>
        ))}
      </fieldset>
      <label className="text-sm font-semibold" htmlFor="coach-prompt">
        Текст для отправки
      </label>
      <textarea
        id="coach-prompt"
        className="input-field coach-prompt"
        readOnly
        value={prompt}
        rows={8}
      />
      <div className="coach-actions">
        <button
          className="btn-primary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(prompt);
              setStatus("Скопировано. Вставь текст в новый чат ChatGPT.");
            } catch {
              setStatus(
                "Не удалось скопировать автоматически. Выдели текст выше и скопируй вручную.",
              );
            }
          }}
        >
          <Copy size={18} aria-hidden="true" />
          Скопировать
        </button>
        <a
          className="btn-ghost"
          href="https://chatgpt.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть ChatGPT
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <p role="status" className="text-sm mt-3">
        {status}
      </p>
      <p className="text-xs text-muted-foreground mt-3">
        Передаётся только текст выше. Ответы ИИ могут содержать ошибки. Занятия в чате не начисляют
        XP и не заменяют экзамены курса.
      </p>
    </details>
  );
}
