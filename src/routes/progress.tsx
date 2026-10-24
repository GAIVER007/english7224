import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "@/lib/content";
import { AREA_LABELS, type Area } from "@/lib/exam";
import { currentStreak, dueWords } from "@/lib/learning";
import { resetAppState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Мой прогресс — SpeakUp" },
      { name: "description", content: "Выученные слова, серия дней, XP и слабые места." },
      { property: "og:title", content: "Мой прогресс — SpeakUp" },
      { property: "og:description", content: "Статистика обучения разговорному английскому." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { state, ready } = useAppState();
  if (!ready)
    return (
      <main className="p-8" role="status">
        Загружаем статистику…
      </main>
    );
  const cards = Object.entries(state.cards);
  const learned = cards.filter(([, c]) => c.box >= 2).length;
  const allWords = lessons.flatMap((l) => l.words);
  const weak = cards
    .filter(([, c]) => c.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground">
        ← Назад
      </Link>
      <h1 className="mt-4 text-4xl font-semibold">Мой прогресс</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Уровень", state.level ?? "—"],
          ["Уроков пройдено", Math.min(state.day - 1, lessons.length)],
          ["Серия", `🔥 ${currentStreak(state)}`],
          ["XP", state.xp],
          ["Слов в работе", cards.length],
          ["Хорошо знаю", learned],
        ].map(([k, v]) => (
          <div key={k as string} className="card-soft p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-3xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <section className="card-soft mt-6 p-6">
        <h2 className="text-2xl font-semibold">Слабые места</h2>
        {weak.length === 0 ? (
          <p className="mt-2 text-muted-foreground">Пока ошибок нет — так держать.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {weak.map(([id, c]) => {
              const w = allWords.find((x) => x.id === id);
              return (
                <li key={id} className="flex justify-between rounded-lg bg-muted px-4 py-2">
                  <span className="font-semibold">{w?.en ?? id}</span>
                  <span className="text-destructive">{c.wrong} ошибок</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section className="card-soft mt-6 p-6">
        <h2 className="text-2xl font-semibold">Последняя проверка</h2>
        {state.weeklyResult ? (
          <>
            <p className="mt-3">
              {state.weeklyResult.correct} из {state.weeklyResult.total} ·{" "}
              {new Date(state.weeklyResult.completedAt).toLocaleDateString("ru-RU")}
            </p>
            <ul className="mt-3 space-y-2">
              {Object.entries(state.weeklyResult.areas)
                .filter(([, area]) => area.total > 0)
                .map(([name, area]) => (
                  <li key={name}>
                    {AREA_LABELS[name as Area] ?? name}: {area.correct}/{area.total}
                  </li>
                ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-muted-foreground">
            Пройдите проверку после изучения первых слов.
          </p>
        )}
        <Link to="/weekly" className="btn-ghost mt-4">
          Пройти проверку
        </Link>
      </section>
      <section className="card-soft mt-6 p-6">
        <h2 className="text-2xl font-semibold">Ошибки по направлениям</h2>
        {Object.keys(state.weakAreas).length ? (
          <ul className="mt-3 space-y-2">
            {Object.entries(state.weakAreas).map(([area, count]) => (
              <li key={area}>
                {AREA_LABELS[area as Area] ?? area}: {count}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">Здесь появятся ошибки из проверок.</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          Счётчики показывают историю ошибок, а не текущую оценку уровня.
        </p>
        <Link to="/lesson" search={{ review: true }} className="btn-ghost mt-4">
          Повторить слова ({dueWords(state).length})
        </Link>
      </section>
      <p className="mt-6 text-sm text-muted-foreground">
        Данные сохранены только в этом браузере. Очистка данных браузера удалит прогресс.
      </p>
      <button
        className="btn-ghost mt-8"
        onClick={() => {
          if (confirm("Сбросить весь прогресс?")) {
            resetAppState();
          }
        }}
      >
        Сбросить прогресс
      </button>
    </main>
  );
}
