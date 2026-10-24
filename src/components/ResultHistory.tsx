import { useState } from "react";
import type { ResultRecord } from "@/lib/store";

export function ResultHistory({ records }: { records: ResultRecord[] }) {
  const [limit, setLimit] = useState(10);
  return (
    <details className="card-soft mt-6 p-5">
      <summary className="min-h-11 cursor-pointer font-bold text-sm">
        История проверок · {records.length}
      </summary>
      <p className="subcopy mt-2">
        Сохраняем завершённые попытки с этого обновления, включая пересдачи. Более ранние попытки
        восстановить нельзя.
      </p>
      {records.length === 0 ? (
        <p className="mt-4 text-sm">Здесь появится следующая завершённая проверка.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {records
            .slice(-limit)
            .reverse()
            .map((record, index) => (
              <li
                key={records.length - index}
                className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 text-sm"
              >
                <span>
                  <strong>
                    {record.kind === "weekly"
                      ? "Проверка навыков"
                      : `${record.kind === "lesson" ? "Миссия" : "Модуль"} ${record.number}`}
                  </strong>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {new Date(record.completedAt).toLocaleString("ru-RU")}
                  </span>
                </span>
                <span>
                  {record.correct} / {record.total}
                </span>
              </li>
            ))}
        </ol>
      )}
      {records.length > limit && (
        <button className="btn-ghost mt-4 w-full" onClick={() => setLimit(limit + 10)}>
          Показать ещё 10
        </button>
      )}
    </details>
  );
}
