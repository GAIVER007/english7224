import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "@/lib/content";
import { useAppState } from "@/lib/store";

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
  const { state, update, ready } = useAppState();
  if (!ready) return null;
  const cards = Object.entries(state.cards);
  const learned = cards.filter(([, c]) => c.box >= 2).length;
  const allWords = lessons.flatMap((l) => l.words);
  const weak = cards.filter(([, c]) => c.wrong > 0).sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground">← Назад</Link>
      <h1 className="mt-4 text-4xl font-semibold">My Progress</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Уровень", state.level ?? "—"], ["День", state.day], ["Серия", `🔥 ${state.streak}`], ["XP", state.xp], ["Слов в работе", cards.length], ["Хорошо знаю", learned]].map(([k, v]) => (
          <div key={k as string} className="card-soft p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-3xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <section className="card-soft mt-6 p-6">
        <h2 className="text-2xl font-semibold">Слабые места</h2>
        {weak.length === 0 ? <p className="mt-2 text-muted-foreground">Пока ошибок нет — так держать.</p> : (
          <ul className="mt-4 space-y-2">
            {weak.map(([id, c]) => {
              const w = allWords.find((x) => x.id === id);
              return <li key={id} className="flex justify-between rounded-lg bg-muted px-4 py-2"><span className="font-semibold">{w?.en ?? id}</span><span className="text-destructive">{c.wrong} ошибок</span></li>;
            })}
          </ul>
        )}
      </section>
      <button className="btn-ghost mt-8" onClick={() => { if (confirm("Сбросить весь прогресс?")) { localStorage.clear(); update(() => ({ level: null, day: 1, xp: 0, streak: 0, lastActive: null, steps: {}, cards: {}, weakAreas: {} })); } }}>Сбросить прогресс</button>
    </main>
  );
}
