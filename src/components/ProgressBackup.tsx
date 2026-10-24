import { useRef, useState } from "react";
import { Download, Upload, ShieldCheck } from "lucide-react";
import { createBackup, parseBackup, MAX_BACKUP_BYTES } from "@/lib/backup";
import { restoreAppState, useAppState } from "@/lib/store";

export function ProgressBackup() {
  const { state } = useAppState();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ReturnType<typeof parseBackup> | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function download() {
    setError("");
    try {
      const url = URL.createObjectURL(
        new Blob([createBackup(state)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `speakup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setMessage(
        "Файл подготовлен. Сохрани его в удобном месте — он понадобится для восстановления.",
      );
    } catch {
      setError("Не удалось подготовить копию. Попробуй скачать её ещё раз.");
    }
  }

  return (
    <section aria-labelledby="backup-title" className="mt-5 border-t border-border pt-5">
      <h3 id="backup-title" className="flex items-center gap-2">
        <ShieldCheck size={20} aria-hidden="true" />
        Твой прогресс с тобой
      </h3>
      <p className="subcopy mt-2">
        Сохрани копию перед очисткой браузера или перенеси её на другой телефон. Файл остаётся у
        тебя.
      </p>
      <div className="mt-4 grid gap-3">
        <button className="btn-ghost w-full" onClick={download}>
          <Download size={18} aria-hidden="true" />
          Скачать копию прогресса
        </button>
        <button className="btn-ghost w-full" disabled={busy} onClick={() => input.current?.click()}>
          <Upload size={18} aria-hidden="true" />
          {busy ? "Проверяем файл…" : "Выбрать файл копии"}
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Файл резервной копии"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setPending(null);
            setError("");
            setMessage("");
            setBusy(true);
            try {
              if (file.size > MAX_BACKUP_BYTES)
                throw new Error("Файл слишком большой. Выбери копию SpeakUp размером до 1 МБ.");
              setPending(parseBackup(await file.text()));
            } catch (failure) {
              setError(failure instanceof Error ? failure.message : "Не удалось прочитать копию.");
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
      {pending && (
        <div
          className="mt-4 rounded-2xl bg-muted p-4"
          role="region"
          aria-label="Предпросмотр копии"
        >
          <h4 className="font-bold">Копия проверена</h4>
          <p className="text-sm mt-2">
            Создана: {new Date(pending.exportedAt).toLocaleString("ru-RU")}
          </p>
          <p className="text-sm mt-2">
            {pending.state.xp} XP · урок {pending.state.day} · слов:{" "}
            {Object.keys(pending.state.cards).length}
          </p>
          <p className="text-sm mt-3">
            Восстановление заменит текущие {state.xp} XP и весь прогресс в этом браузере. Сначала
            скачай текущую копию, если хочешь её сохранить.
          </p>
          <button
            className="btn-primary w-full mt-4"
            onClick={() => {
              try {
                restoreAppState(pending.state);
                setPending(null);
                setError("");
                setMessage("Прогресс восстановлен. Можно продолжать занятия.");
              } catch (failure) {
                setError(
                  failure instanceof Error
                    ? failure.message
                    : "Не удалось сохранить прогресс. Текущие данные не изменены.",
                );
              }
            }}
          >
            Заменить прогресс этой копией
          </button>
          <button className="btn-ghost w-full mt-3" onClick={() => setPending(null)}>
            Отмена
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive mt-3">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm mt-3">
          {message}
        </p>
      )}
    </section>
  );
}
