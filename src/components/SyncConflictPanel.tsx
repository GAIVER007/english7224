import { useState } from "react";
import { createBackup } from "@/lib/backup";
import type { AppState } from "@/lib/store";

type Copy = "local" | "cloud";
interface Props {
  conflict: { local: AppState; cloud: AppState; reason?: "account-change" };
  onResolve: (choice: Copy) => Promise<void>;
}

export function SyncConflictPanel({ conflict, onResolve }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const copies = [
    ["local", "На этом устройстве"],
    ["cloud", "В аккаунте"],
  ] as const;

  function download(copy: Copy) {
    try {
      const url = URL.createObjectURL(
        new Blob([createBackup(conflict[copy])], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `speakup-${copy}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setError("");
    } catch {
      setError("Не удалось подготовить копию. Выбор пока не применён.");
    }
  }

  async function resolve(copy: Copy) {
    setBusy(true);
    setError("");
    try {
      await onResolve(copy);
    } catch {
      setError("Не удалось объединить прогресс. Обе версии пока сохранены отдельно.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="sync-conflict-title"
      className="space-y-4 rounded-xl border bg-card p-5"
    >
      <h2 id="sync-conflict-title" className="text-lg font-bold">
        Есть две версии прогресса
      </h2>
      <p role="status" className="text-sm">
        {conflict.reason === "account-change"
          ? "На устройстве остался прогресс другого аккаунта. Выбери: перенести его в текущий аккаунт или загрузить прогресс текущего аккаунта на устройство. Сначала скачай нужные копии: в этом случае выбирается вся версия."
          : "Один и тот же ответ или настройка изменились на двух устройствах. Автоматическая запись приостановлена. Независимые результаты объединятся; выбери версию для спорных изменений. Перед выбором можно скачать обе копии."}
      </p>
      {copies.map(([copy, title]) => (
        <div key={copy} className="space-y-2 border-t pt-3">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {conflict[copy].xp} XP · Результатов:{" "}
            {(conflict[copy].resultHistory?.length ?? 0) +
              (conflict[copy].pathway?.history.length ?? 0)}
          </p>
          <details className="text-sm">
            <summary className="min-h-11 cursor-pointer py-3">Посмотреть ответы и заметки</summary>
            {Object.entries(conflict[copy].pathway?.units ?? {})
              .filter(([, unit]) => unit.writing || unit.speakingNotes)
              .map(([id, unit]) => (
                <div key={id} className="my-3 space-y-1 break-words">
                  <strong>{id.toUpperCase()}</strong>
                  {unit.writing && (
                    <p className="whitespace-pre-wrap" lang="en">
                      {unit.writing}
                    </p>
                  )}
                  {unit.speakingNotes && (
                    <p className="whitespace-pre-wrap">Заметки: {unit.speakingNotes}</p>
                  )}
                </div>
              ))}
          </details>
          <button type="button" className="btn-secondary w-full" onClick={() => download(copy)}>
            Скачать копию: {title.toLowerCase()}
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            disabled={busy}
            onClick={() => void resolve(copy)}
          >
            {busy
              ? "Сохраняю…"
              : conflict.reason === "account-change"
                ? copy === "local"
                  ? "Перенести прогресс устройства в этот аккаунт"
                  : "Загрузить прогресс этого аккаунта"
                : `Использовать спорные изменения: ${title.toLowerCase()}`}
          </button>
        </div>
      ))}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
