import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { lessons } from "@/lib/content";
import { review, speak, touchStreak, useAppState } from "@/lib/store";

export const Route = createFileRoute("/weekly")({
  head: () => ({
    meta: [
      { title: "Еженедельный экзамен — SpeakUp" },
      { name: "description", content: "Проверка слов, фраз и аудирования за неделю с разбором слабых мест." },
      { property: "og:title", content: "Еженедельный экзамен — SpeakUp" },
      { property: "og:description", content: "Слова, фразы, listening — и что подтянуть." },
    ],
  }),
  component: Weekly,
});

type Area = "Vocabulary" | "Phrases" | "Listening";
interface Q { area: Area; prompt: string; audio?: string; options: string[]; answer: string; wordId: string }

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function Weekly() {
  const { state, update, ready } = useAppState();
  const studied = lessons.slice(0, Math.max(1, state.day - 1)).flatMap((l) => l.words);
  const questions = useMemo<Q[]>(() => {
    if (!ready) return [];
    const ws = shuffle(studied).slice(0, 9);
    const all = lessons.flatMap((l) => l.words);
    return ws.map((w, i) => {
      const others = shuffle(all.filter((x) => x.id !== w.id)).slice(0, 3);
      if (i % 3 === 0) return { area: "Vocabulary", prompt: `Перевод: «${w.en}»`, options: shuffle([w.ru, ...others.map((o) => o.ru)]), answer: w.ru, wordId: w.id };
      if (i % 3 === 1) { const p = w.phrases[0]!; return { area: "Phrases", prompt: `Как сказать: «${p.ru}»`, options: shuffle([p.en, ...others.map((o) => o.phrases[0]!.en)]), answer: p.en, wordId: w.id }; }
      return { area: "Listening", prompt: "Что вы услышали?", audio: w.example, options: shuffle([w.example, ...others.map((o) => o.example)]), answer: w.example, wordId: w.id };
    });
  }, [ready]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState<Record<Area, [number, number]>>({ Vocabulary: [0, 0], Phrases: [0, 0], Listening: [0, 0] });
  const [picked, setPicked] = useState<string | null>(null);
  if (!ready || questions.length === 0) return null;

  if (i >= questions.length) {
    const total = Object.values(score).reduce((a, [c]) => a + c, 0);
    const pct = Math.round((total / questions.length) * 100);
    const entries = Object.entries(score) as [Area, [number, number]][];
    return (
      <main className="mx-auto max-w-xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Результат недели</p>
        <h1 className="mt-2 text-7xl font-semibold">{pct}%</h1>
        <div className="card-soft mt-8 space-y-3 p-6">
          {entries.map(([a, [c, t]]) => {
            const p = t ? Math.round((c / t) * 100) : 0;
            return (
              <div key={a}>
                <div className="flex justify-between text-sm font-semibold"><span>{a}</span><span className={p >= 70 ? "text-success" : "text-destructive"}>{p}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${p >= 70 ? "bg-success" : "bg-primary"}`} style={{ width: `${p}%` }} /></div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-muted-foreground">Слова с ошибками вернутся к вам в повторении уже завтра.</p>
        <Link to="/" className="btn-primary mt-8 w-full">На главную</Link>
      </main>
    );
  }

  const q = questions[i]!;
  const choose = (o: string) => {
    const ok = o === q.answer;
    setPicked(o);
    setScore((s) => ({ ...s, [q.area]: [s[q.area][0] + (ok ? 1 : 0), s[q.area][1] + 1] }));
    update((s) => touchStreak({ ...s, xp: s.xp + (ok ? 5 : 0), cards: { ...s.cards, [q.wordId]: review(s.cards[q.wordId], ok) }, weakAreas: ok ? s.weakAreas : { ...s.weakAreas, [q.area]: (s.weakAreas[q.area] ?? 0) + 1 } }));
  };

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <Link to="/" className="text-sm font-semibold text-muted-foreground">✕ Выйти</Link>
      <div className="mt-4 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(i / questions.length) * 100}%` }} /></div>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-primary">{q.area} · {i + 1}/{questions.length}</p>
      <section className="card-soft mt-4 p-6">
        <h2 className="text-2xl font-semibold">{q.prompt}</h2>
        {q.audio && <button className="btn-ghost mt-4" onClick={() => speak(q.audio!)}>🔊 Прослушать</button>}
        <div className="mt-6 grid gap-3">
          {q.options.map((o) => (
            <button key={o} disabled={!!picked} onClick={() => choose(o)} className={`option ${picked ? (o === q.answer ? "border-success bg-accent" : o === picked ? "border-destructive" : "") : ""}`}>{o}</button>
          ))}
        </div>
        {picked && <button className="btn-primary mt-6 w-full" onClick={() => { setPicked(null); setI(i + 1); }}>Дальше</button>}
      </section>
    </main>
  );
}
