import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { lessons, type Lesson } from "@/lib/content";
import { isRecallAnswerCorrect } from "@/lib/recall";
import { speak, type AppState } from "@/lib/store";
import { isSpeechSynthesisAvailable } from "@/lib/speech";

type Mode = "dictation" | "retell" | "dialogue" | "fluency";
import type { PracticeSkill } from "@/lib/practice-balance";
const MODES: { id: Mode; title: string; description: string }[] = [
  {
    id: "fluency",
    title: "Говорить свободнее",
    description: "Расскажи знакомую историю трижды: точнее, связнее, увереннее.",
  },
  {
    id: "dictation",
    title: "Аудиодиктант",
    description: "Послушай три фразы и запиши то, что услышал.",
  },
  {
    id: "retell",
    title: "Пересказ",
    description: "Спрячь диалог и расскажи ситуацию своими словами.",
  },
  {
    id: "dialogue",
    title: "Твоя реплика",
    description: "Ответь собеседнику, затем сравни с примером.",
  },
];

export function SkillPractice({
  state,
  onDone,
}: {
  state: AppState;
  onDone: (skill: PracticeSkill) => void;
}) {
  const available = lessons.filter((lesson) => state.steps[`${lesson.day}:test`]);
  const [day, setDay] = useState(available[available.length - 1]?.day ?? 0);
  const [mode, setMode] = useState<Mode | null>(null);
  const finished = useRef(false);
  const lesson = available.find((item) => item.day === day);
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone(mode === "dictation" ? "input" : mode === "fluency" ? "fluency" : "output");
  };
  if (!lesson)
    return (
      <section className="card-soft p-5">
        <h1 className="text-2xl font-bold">Сначала одна миссия</h1>
        <p className="subcopy mt-3">
          Заверши миссию, чтобы тренировать её фразы, диалог и пересказ здесь.
        </p>
      </section>
    );
  return (
    <section>
      {!mode ? (
        <>
          <h1 className="page-title">Понимать и говорить</h1>
          <label htmlFor="practice-topic" className="mb-2 block font-semibold">
            Тема из пройденного
          </label>
          <select
            id="practice-topic"
            className="input-field mb-5 w-full"
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
          >
            {available.map((item) => (
              <option key={item.day} value={item.day}>
                {item.day}. {item.titleRu}
              </option>
            ))}
          </select>
          <div className="space-y-3">
            {MODES.map((item) => (
              <button
                key={item.id}
                className="card-soft block w-full p-5 text-left"
                onClick={() => setMode(item.id)}
              >
                <span className="block text-lg font-bold">{item.title}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{item.description}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="btn-ghost mb-4 min-h-11" onClick={() => setMode(null)}>
            К выбору тренировки
          </button>
          <p className="eyebrow mb-3">{lesson.titleRu}</p>
          {mode === "fluency" ? (
            <Fluency lesson={lesson} onDone={finish} />
          ) : mode === "dictation" ? (
            <Dictation lesson={lesson} onDone={finish} />
          ) : mode === "retell" ? (
            <Retell lesson={lesson} onDone={finish} />
          ) : (
            <Dialogue lesson={lesson} onDone={finish} />
          )}
        </>
      )}
    </section>
  );
}

function AudioButton({ text, rate = 1 }: { text: string; rate?: number }) {
  const [failed, setFailed] = useState(() => !isSpeechSynthesisAvailable());
  useEffect(() => {
    const fail = () => setFailed(true);
    window.addEventListener("speakup-audio-error", fail);
    return () => window.removeEventListener("speakup-audio-error", fail);
  }, []);
  if (failed)
    return (
      <p role="status" className="my-2 text-sm text-muted-foreground">
        Озвучка недоступна. Используй текст реплики.
      </p>
    );
  return (
    <button type="button" className="btn-ghost min-h-11" onClick={() => speak(text, rate)}>
      <Volume2 size={18} aria-hidden="true" />
      {rate < 1 ? "Медленнее" : "Послушать"}
    </button>
  );
}

export function Dictation({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [items] = useState(() => lesson.words.slice(0, 3));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [audioFailed, setAudioFailed] = useState(() => !isSpeechSynthesisAvailable());
  const [textUsed, setTextUsed] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const lock = useRef(false);
  useEffect(() => {
    const fail = () => setAudioFailed(true);
    window.addEventListener("speakup-audio-error", fail);
    return () => {
      window.removeEventListener("speakup-audio-error", fail);
      window.speechSynthesis?.cancel();
    };
  }, []);
  const item = items[index];
  if (!item)
    return (
      <section className="card-soft p-5">
        <h2 className="text-2xl font-bold">Диктант завершён</h2>
        <p className="mt-3" role="status">
          Без подсказки: {correct} из {items.length}.
        </p>
        {(textUsed || audioFailed) && (
          <p className="subcopy mt-3">
            Использован текст или озвучка недоступна. Это практика фраз, а не чистая проверка
            аудирования.
          </p>
        )}
        {mistakes.length > 0 && (
          <>
            <h3 className="mt-5 font-bold">Фразы для повторения</h3>
            <ul className="mt-3 space-y-3">
              {mistakes.map((text) => (
                <li key={text}>
                  <p>{text}</p>
                  <AudioButton text={text} />
                </li>
              ))}
            </ul>
          </>
        )}
        <button className="btn-primary mt-5 w-full" onClick={onDone}>
          Завершить тренировку
        </button>
      </section>
    );
  const matches = isRecallAnswerCorrect(answer, item.example);
  return (
    <section className="card-soft p-5">
      <p className="eyebrow">
        Фраза {index + 1} из {items.length}
      </p>
      <h2 className="mt-2 text-2xl font-bold">Послушай и запиши</h2>
      <p className="subcopy mt-3">Запиши услышанную фразу. Регистр и знаки препинания не важны.</p>
      {!audioFailed && (
        <div className="my-4 flex flex-wrap gap-2">
          <AudioButton text={item.example} />
          <AudioButton text={item.example} rate={0.75} />
        </div>
      )}
      {audioFailed && (
        <p role="status" className="my-3 text-sm">
          Озвучка недоступна. Можно открыть текст и потренировать фразу; для аудирования нужен
          системный английский голос.
        </p>
      )}
      {!checked && (
        <button
          className="btn-ghost my-3 min-h-11"
          disabled={revealed}
          onClick={() => {
            setRevealed(true);
            setTextUsed(true);
          }}
        >
          Показать текст — с подсказкой
        </button>
      )}
      {revealed && <p className="my-3 font-semibold">{item.example}</p>}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!answer.trim() || lock.current) return;
          lock.current = true;
          setChecked(true);
          if (matches && !revealed && !audioFailed) setCorrect((value) => value + 1);
          else setMistakes((values) => [...values, item.example]);
        }}
      >
        <label htmlFor="dictation-answer" className="mb-2 block">
          Фраза на английском
        </label>
        <textarea
          id="dictation-answer"
          className="input-field min-h-28 w-full"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
        />
        {!checked && (
          <button className="btn-primary mt-4 w-full" disabled={!answer.trim()}>
            Проверить фразу
          </button>
        )}
      </form>
      {checked && (
        <div className="mt-4" role="status">
          <p className="font-bold">
            {matches
              ? revealed || audioFailed
                ? "Фраза совпадает; аудирование не засчитано"
                : "Точно услышано!"
              : "Сравни с оригиналом"}
          </p>
          <p className="mt-2">{item.example}</p>
          <p className="subcopy">{item.exampleRu}</p>
          <button
            className="btn-primary mt-4 w-full"
            onClick={() => {
              setIndex((value) => value + 1);
              setAnswer("");
              setChecked(false);
              setRevealed(false);
              lock.current = false;
            }}
          >
            {index === items.length - 1 ? "Результат" : "Следующая фраза"}
          </button>
        </div>
      )}
    </section>
  );
}

export function Retell({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  return (
    <section className="card-soft p-5">
      <h2 className="text-2xl font-bold">Расскажи своими словами</h2>
      <p className="subcopy mt-3">
        Прочитай диалог, спрячь текст и перескажи ситуацию по-английски в 3–5 предложениях. Не
        обязательно повторять оригинал.
      </p>
      <button
        className="btn-ghost my-4 min-h-11"
        onClick={() => {
          setHidden((value) => !value);
          setChecks([false, false, false]);
        }}
      >
        {hidden ? "Посмотреть диалог снова" : "Спрятать диалог и начать"}
      </button>
      {!hidden ? (
        <div className="space-y-3">
          {lesson.dialogue.map((line, i) => (
            <p key={i}>
              {line.en}
              <span className="block text-sm text-muted-foreground">{line.ru}</span>
            </p>
          ))}
        </div>
      ) : (
        <>
          <p className="font-semibold">
            Кто разговаривал? Чего хотел каждый? Чем закончился разговор?
          </p>
          <fieldset className="mt-5 space-y-3">
            <legend className="mb-3 text-sm text-muted-foreground">
              Самопроверка после рассказа
            </legend>
            {[
              "Рассказал вслух без текста",
              "Передал основную мысль и детали",
              "Использовал хотя бы две фразы из миссии",
            ].map((label, i) => (
              <label key={label} className="flex min-h-11 items-center gap-3">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={(event) =>
                    setChecks((values) =>
                      values.map((value, n) => (n === i ? event.target.checked : value)),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </fieldset>
          <p className="subcopy mt-4">
            Это самостоятельная практика. Приложение не слушает и не оценивает твой рассказ.
          </p>
          <button
            className="btn-primary mt-5 w-full"
            disabled={!checks.every(Boolean)}
            onClick={onDone}
          >
            Завершить пересказ
          </button>
        </>
      )}
    </section>
  );
}

export function Dialogue({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [turns] = useState(() =>
    lesson.dialogue
      .map((line, index) => ({ line, previous: lesson.dialogue[index - 1] }))
      .filter((turn) => turn.line.who === "B" && turn.previous),
  );
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [shown, setShown] = useState(false);
  const turn = turns[index];
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );
  if (!turn)
    return (
      <section className="card-soft p-5">
        <h2 className="text-2xl font-bold">Разговор завершён</h2>
        <p className="subcopy mt-3">
          Ты ответил своими словами. Теперь попробуй разыграть всю ситуацию вслух.
        </p>
        <button className="btn-primary mt-5 w-full" onClick={onDone}>
          Завершить тренировку
        </button>
      </section>
    );
  return (
    <section className="card-soft p-5">
      <p className="eyebrow">
        Реплика {index + 1} из {turns.length}
      </p>
      <h2 className="mt-2 text-2xl font-bold">Теперь твоя очередь</h2>
      <p className="subcopy my-3">
        Ты играешь роль B. Ответь по смыслу, затем сравни с примером. Свой вариант может быть
        другим.
      </p>
      <blockquote className="my-4 border-l-2 border-primary pl-4">{turn.previous!.en}</blockquote>
      <AudioButton text={turn.previous!.en} />
      <label htmlFor="dialogue-answer" className="mb-2 mt-4 block">
        Твоя реплика на английском
      </label>
      <textarea
        id="dialogue-answer"
        className="input-field min-h-28 w-full"
        value={answer}
        disabled={shown}
        onChange={(event) => setAnswer(event.target.value)}
      />
      {!shown ? (
        <button
          className="btn-primary mt-4 w-full"
          disabled={!/[a-z]/i.test(answer)}
          onClick={() => setShown(true)}
        >
          Сравнить с примером
        </button>
      ) : (
        <div className="mt-5">
          <h3 className="font-bold">Один из вариантов</h3>
          <p className="mt-2">{turn.line.en}</p>
          <p className="subcopy">{turn.line.ru}</p>
          <p className="subcopy mt-3">
            Подходит ли твой ответ к вопросу? Произнеси его вслух. Автоматической оценки свободного
            ответа здесь нет.
          </p>
          <button
            className="btn-primary mt-4 w-full"
            onClick={() => {
              setIndex((value) => value + 1);
              setAnswer("");
              setShown(false);
            }}
          >
            {index === turns.length - 1 ? "Закончить разговор" : "Следующая реплика"}
          </button>
        </div>
      )}
    </section>
  );
}

export function Fluency({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [round, setRound] = useState(0);
  const [spoken, setSpoken] = useState(false);
  const [notes, setNotes] = useState("");
  const finished = useRef(false);
  const stages = ["Вспомни ситуацию", "Расскажи связнее", "Расскажи без опоры"];
  return (
    <section className="card-soft p-5">
      <p className="eyebrow">Повторный рассказ · {round + 1} из 3</p>
      <h2 className="text-2xl font-bold">{stages[round]}</h2>
      <p className="subcopy mt-3">
        {round === 0
          ? "Расскажи вслух знакомую ситуацию в 3–5 предложениях. Кто участвовал, чего хотел и чем всё закончилось?"
          : round === 1
            ? "Повтори ту же историю. Свяжи предложения: first, then, because, finally. Сохрани смысл, не добавляй сложность."
            : "Расскажи ту же историю ещё раз без заметок. Старайся делать меньше пауз, но не жертвуй понятностью."}
      </p>
      {round < 2 && (
        <>
          <label htmlFor="fluency-notes" className="block mt-4 mb-2">
            Опорные слова (необязательно)
          </label>
          <textarea
            id="fluency-notes"
            className="input-field w-full"
            rows={3}
            maxLength={300}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="3–5 знакомых английских слов"
          />
        </>
      )}
      <label className="flex gap-3 items-center min-h-12 my-4">
        <input type="checkbox" checked={spoken} onChange={(e) => setSpoken(e.target.checked)} />Я
        рассказал вслух
      </label>
      <button
        className="btn-primary w-full"
        disabled={!spoken}
        onClick={() => {
          if (round < 2) {
            setRound(round + 1);
            setSpoken(false);
          } else if (!finished.current) {
            finished.current = true;
            onDone();
          }
        }}
      >
        {round < 2 ? "Следующий рассказ" : "Завершить практику беглости"}
      </button>
      <p className="text-xs text-muted-foreground mt-4">
        Тема: {lesson.titleRu}. Это самостоятельная практика: приложение не оценивает произношение
        или скорость. Заметки не сохраняются.
      </p>
    </section>
  );
}
