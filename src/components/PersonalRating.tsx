import { Trophy } from "lucide-react";
import { personalRating } from "@/lib/rating";
import type { AppState } from "@/lib/store";

export function PersonalRating({ state }: { state: AppState }) {
  const rating = personalRating(state);
  return (
    <section className="card-soft mt-6 p-5" aria-labelledby="personal-rating-title">
      <div className="flex items-center gap-3">
        <Trophy className="text-primary" size={28} aria-hidden="true" />
        <div>
          <p className="eyebrow">Личный рейтинг</p>
          <h2 id="personal-rating-title" className="text-xl font-bold">
            Лига «{rating.league.title}»
          </h2>
        </div>
      </div>
      <p className="my-4 text-3xl font-bold">
        {rating.score}{" "}
        <span className="text-sm font-normal text-muted-foreground">баллов роста</span>
      </p>
      <div
        className="meter"
        role="progressbar"
        aria-label="До следующей лиги"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rating.percent}
      >
        <span style={{ width: `${rating.percent}%` }} />
      </div>
      <p className="mt-3 text-sm">
        {rating.next
          ? `До лиги «${rating.next.title}» — ${rating.next.minimum - rating.score} баллов.`
          : "Высшая лига открыта. Продолжай свой ритм!"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Сравнивай себя с собой. Это игровой показатель практики, а не оценка владения языком.
      </p>
      <dl className="my-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted p-3">
          <dt className="text-xs text-muted-foreground">Лучшая серия</dt>
          <dd className="text-xl font-bold">{rating.records.bestStreak} дн.</dd>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <dt className="text-xs text-muted-foreground">Всего дней практики</dt>
          <dd className="text-xl font-bold">{rating.records.activeDays}</dd>
        </div>
      </dl>
      <details>
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">
          Как начисляются баллы
        </summary>
        <ul className="space-y-3 text-sm">
          {rating.parts.map((part) => (
            <li key={part.label} className="flex justify-between gap-3">
              <span>
                {part.label}
                <span className="block text-xs text-muted-foreground">
                  {part.count}/{part.limit} · по {part.unit} баллов
                </span>
              </span>
              <strong>{part.count * part.unit}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Миссия, экзамен модуля и речевой этап учитываются один раз. За день — 10 баллов независимо
          от количества действий, за первые 100 дней. Пропуск дня не отнимает баллы. Рекорды
          рассчитаны по сохранённой истории.
        </p>
      </details>
    </section>
  );
}
