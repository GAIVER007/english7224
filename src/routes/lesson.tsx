import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { lessons, type Word } from "@/lib/content";
import { review, speak, STEPS, STEP_LABELS, touchStreak, useAppState, type Step } from "@/lib/store";

export const Route = createFileRoute("/lesson")({
  head: () => ({
    meta: [
      { title: "Урок дня — SpeakUp" },
      { name: "description", content: "Повторение, новые слова, фразы, диалог, speaking и мини-тест." },
      { property: "og:title", content: "Урок дня — SpeakUp" },
      { property: "og:description", content: "Ежедневный урок разговорного английского." },
    ],
  }),
  component: LessonPage,
});

function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

function Quiz({ words, pool, onDone, onAnswer }: { words: Word[]; pool: Word[]; onDone: () => void; onAnswer: (id: string, ok: boolean) => void }) {
  const qs = useMemo(() => words.map((w) => ({ w, opts: shuffle([w, ...shuffle(pool.filter((p) => p.id !== w.id)).slice(0, 3)]) })), [words, pool]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  if (qs.length === 0) return <div className="text-center"><p className="text-muted-foreground">Пока нечего повторять — это первый урок.</p><button className="btn-primary mt-6" onClick={onDone}>Дальше</button></div>;
  const q = qs[i];
  return (
    <div>
      <p className="text-sm text-muted-foreground">{i + 1} / {qs.length}</p>
      <h2 className="mt-2 text-3xl font-semibold">What does “{q.w.en}” mean?</h2>
      <div className="mt-6 grid gap-3">
        {q.opts.map((o) => {
          const state = picked && (o.id === q.w.id ? "border-success bg-accent" : o.id === picked ? "border-destructive" : "");
          return <button key={o.id} disabled={!!picked} className={`option ${state || ""}`} onClick={() => { setPicked(o.id); onAnswer(q.w.id, o.id === q.w.id); }}>{o.ru}</button>;
        })}
      </div>
      {picked && <button className="btn-primary mt-6 w-full" onClick={() => { setPicked(null); if (i + 1 < qs.length) setI(i + 1); else onDone(); }}>Дальше</button>}
    </div>
  );
}

function Speaking({ items, onDone }: { items: { prompt: string; target: string }[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const it = items[i];
  const Rec = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, "").trim();
  const ok = heard && norm(heard).includes(norm(it.target).split(" ").slice(-2).join(" "));
  const listen = () => {
    if (!Rec) { setHeard("(микрофон не поддерживается в этом браузере)"); return; }
    const r = new Rec(); r.lang = "en-US"; setListening(true);
    r.onresult = (e: any) => setHeard(e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.start();
  };
  return (
    <div>
      <p className="text-sm text-muted-foreground">{i + 1} / {items.length}</p>
      <h2 className="mt-2 text-3xl font-semibold">{it.prompt}</h2>
      <button className="btn-ghost mt-4" onClick={() => speak(it.target)}>🔊 Подсказка</button>
      <button className="btn-primary mt-8 w-full" onClick={listen} disabled={listening}>{listening ? "Слушаю…" : "🎤 Speak"}</button>
      {heard && <div className={`mt-6 rounded-xl p-4 ${ok ? "bg-accent text-accent-foreground" : "bg-muted"}`}>
        <p className="text-sm text-muted-foreground">Вы сказали:</p><p className="font-semibold">{heard}</p>
        <p className="mt-2 text-sm">{ok ? "Отлично! ✓" : `Natural: “${it.target}”`}</p>
      </div>}
      <button className="btn-ghost mt-6 w-full" onClick={() => { setHeard(""); if (i + 1 < items.length) setI(i + 1); else onDone(); }}>Дальше</button>
    </div>
  );
}

function LessonPage() {
  const { state, update, ready } = useAppState();
  const nav = useNavigate();
  const lesson = lessons[(state.day - 1) % lessons.length];
  const firstOpen = STEPS.find((s) => !state.steps[`${state.day}:${s}`]) ?? "review";
  const [step, setStep] = useState<Step | null>(null);
  const [wi, setWi] = useState(0);
  const [showRu, setShowRu] = useState(false);
  const [rate, setRate] = useState(1);
  const pool = useMemo(() => lessons.flatMap((l) => l.words), []);
  const reviewWords = useMemo(() => pool.filter((w) => state.cards[w.id] && state.cards[w.id].due <= Date.now()).slice(0, 8), [pool, ready]);
  if (!ready) return null;
  const cur = step ?? firstOpen;

  const answer = (id: string, ok: boolean) => update((s) => ({ ...s, xp: s.xp + (ok ? 5 : 1), cards: { ...s.cards, [id]: review(s.cards[id], ok) } }));
  const complete = () => {
    const idx = STEPS.indexOf(cur);
    update((s) => touchStreak({ ...s, xp: s.xp + 10, steps: { ...s.steps, [`${s.day}:${cur}`]: true } }));
    if (idx + 1 < STEPS.length) { setStep(STEPS[idx + 1]); setWi(0); }
    else { update((s) => ({ ...s, day: s.day + 1 })); nav({ to: "/" }); }
  };

  const w = lesson.words[wi];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-muted-foreground">✕ Выйти</Link>
        <span className="text-sm font-semibold">Day {state.day} · {lesson.title}</span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((s) => <button key={s} onClick={() => setStep(s)} className={`h-2 flex-1 rounded-full ${s === cur ? "bg-primary" : state.steps[`${state.day}:${s}`] ? "bg-success" : "bg-muted"}`} aria-label={STEP_LABELS[s]} />)}
      </div>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-primary">{STEP_LABELS[cur]}</p>

      <section className="card-soft mt-4 p-8">
        {cur === "review" && <Quiz words={reviewWords} pool={pool} onAnswer={answer} onDone={complete} />}

        {cur === "words" && (
          <div>
            <p className="text-sm text-muted-foreground">{wi + 1} / {lesson.words.length}</p>
            <h2 className="mt-2 text-5xl font-semibold">{w.en}</h2>
            <p className="mt-1 text-muted-foreground">{w.ipa}</p>
            <p className="mt-4 text-xl font-semibold">{w.ru}</p>
            <button className="btn-ghost mt-4" onClick={() => speak(w.en)}>🔊 Послушать</button>
            <div className="mt-6 rounded-xl bg-muted p-4">
              <p className="font-semibold">{w.example}</p><p className="text-sm text-muted-foreground">{w.exampleRu}</p>
            </div>
            <button className="btn-primary mt-6 w-full" onClick={() => {
              update((s) => ({ ...s, cards: { ...s.cards, [w.id]: s.cards[w.id] ?? review(undefined, true) } }));
              if (wi + 1 < lesson.words.length) setWi(wi + 1); else complete();
            }}>Запомнил</button>
          </div>
        )}

        {cur === "phrases" && (
          <div>
            <h2 className="text-3xl font-semibold">Слово → фраза</h2>
            <div className="mt-6 space-y-5">
              {lesson.words.map((x) => (
                <div key={x.id}>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{x.en}</p>
                  {x.phrases.map((p) => (
                    <button key={p.en} onClick={() => speak(p.en)} className="mt-1 block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">
                      <span className="font-semibold">{p.en}</span> <span className="text-sm text-muted-foreground">— {p.ru}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button className="btn-primary mt-6 w-full" onClick={complete}>Готово</button>
          </div>
        )}

        {cur === "dialogue" && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn-ghost" onClick={() => { lesson.dialogue.forEach(() => {}); speak(lesson.dialogue.map((d) => d.en).join(" "), rate); }}>▶ Весь диалог</button>
              {[0.75, 1, 1.25].map((r) => <button key={r} onClick={() => setRate(r)} className={`rounded-full px-3 py-1 text-sm font-semibold ${rate === r ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>{r}x</button>)}
              <button className="ml-auto text-sm font-semibold underline" onClick={() => setShowRu(!showRu)}>{showRu ? "Скрыть перевод" : "Перевод"}</button>
            </div>
            <div className="mt-6 space-y-3">
              {lesson.dialogue.map((d, k) => (
                <button key={k} onClick={() => speak(d.en, rate)} className={`block max-w-[85%] rounded-2xl px-4 py-3 text-left ${d.who === "A" ? "bg-muted" : "ml-auto bg-secondary text-secondary-foreground"}`}>
                  <p className="font-semibold">{d.en}</p>{showRu && <p className="text-sm opacity-70">{d.ru}</p>}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-accent p-4 text-accent-foreground">
              <p className="font-bold">{lesson.grammar.title}</p><p className="text-sm">{lesson.grammar.rule}</p>
            </div>
            <button className="btn-primary mt-6 w-full" onClick={complete}>Готово</button>
          </div>
        )}

        {cur === "speaking" && <Speaking items={lesson.speaking} onDone={complete} />}

        {cur === "test" && <Quiz words={lesson.words} pool={pool} onAnswer={answer} onDone={complete} />}
      </section>
    </main>
  );
}
