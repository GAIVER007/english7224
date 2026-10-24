import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Flame,
  Layers3,
  Lightbulb,
  Languages,
  LockKeyhole,
  PencilLine,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { lessonIcons } from "@/lib/lesson-icons";
import { lessons } from "@/lib/content";
import { currentStreak, dueWords, studiedWords } from "@/lib/learning";
import { dailyProgress } from "@/lib/motivation";
import { STEPS, useAppState } from "@/lib/store";
import { BottomNav, Brand, LessonArtwork, SectionHeading } from "@/components/TrainingUI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpeakUp — твоя ежедневная практика" },
      {
        name: "description",
        content: "Личный тренажёр английского: вспоминай, говори и замечай свой прогресс.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { state, update, ready } = useAppState();
  const [editGoal, setEditGoal] = useState(false);
  if (!ready)
    return (
      <main className="app-shell" role="status">
        Готовим твою тренировку…
      </main>
    );
  if (!state.level)
    return (
      <main className="app-shell focus-shell">
        <Brand />
        <div className="onboarding-art">
          <LessonArtwork day={3} />
        </div>
        <p className="eyebrow">Твоё место для практики</p>
        <h1 className="page-title">
          Маленькие шаги.
          <br />
          <span>Большие разговоры.</span>
        </h1>
        <p className="subcopy">
          Вспоминай слова, собирай фразы и говори вслух. Здесь можно ошибаться — так и появляется
          уверенность.
        </p>
        <div className="onboarding-actions">
          <Link to="/placement" search={{ choose: undefined }} className="btn-primary">
            Найти свою точку старта <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/placement" search={{ choose: true }} className="btn-ghost">
            Я уже знаю свой уровень
          </Link>
        </div>
        <div className="coach-note">
          <Sparkles size={20} aria-hidden="true" />
          <p>
            Начнём с {lessons.length} жизненных ситуаций уровня A2. Без регистрации, в твоём темпе.
          </p>
        </div>
      </main>
    );

  const finished = state.day > lessons.length;
  const lesson = lessons[Math.min(state.day - 1, lessons.length - 1)]!;
  const done = STEPS.filter((step) => state.steps[`${state.day}:${step}`]).length;
  const due = dueWords(state).length;
  const studied = studiedWords(state).length;
  const daily = dailyProgress(state);
  return (
    <main className="app-shell">
      <header className="topbar">
        <Brand />
        <div className="status-pills">
          <span className="status-pill fire" aria-label={`Дней в серии: ${currentStreak(state)}`}>
            <Flame size={15} aria-hidden="true" />
            {currentStreak(state)}
          </span>
          <span className="status-pill">
            <Zap size={15} className="text-primary" aria-hidden="true" />
            {state.xp} XP
          </span>
        </div>
      </header>
      <p className="eyebrow">Твой английский, твой ритм</p>
      <h1 className="page-title">
        {daily.completed ? (
          <>
            Хорошая работа.
            <br />
            <span>Сегодня ты вырос.</span>
          </>
        ) : (
          <>
            Чуть больше практики.
            <br />
            <span>Чуть больше тебя.</span>
          </>
        )}
      </h1>
      <p className="subcopy">
        {daily.completed
          ? "Цель выполнена. Можно отдохнуть или пойти дальше."
          : "Одна короткая тренировка — и ты уже ближе к свободному разговору."}
      </p>
      <section className="goal-card" aria-label="Цель на день">
        <div className="goal-ring">
          <svg viewBox="0 0 60 60" aria-hidden="true">
            <circle cx="30" cy="30" r="25" fill="none" stroke="var(--muted)" strokeWidth="5" />
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${daily.percent * 1.571} 157.1`}
            />
          </svg>
          <span>
            {Math.min(daily.count, daily.goal)}/{daily.goal}
          </span>
        </div>
        <div>
          <h2>{daily.completed ? "Цель дня выполнена!" : "Твоя цель на сегодня"}</h2>
          <p>
            {daily.goal} {daily.goal === 3 ? "учебных действия" : "учебных действий"} · без спешки
          </p>
        </div>
        <button
          className="goal-edit"
          aria-label="Изменить дневную цель"
          aria-expanded={editGoal}
          onClick={() => setEditGoal(!editGoal)}
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
        </button>
      </section>
      {editGoal && (
        <section className="goal-picker">
          <h2 className="text-sm font-bold">Какой ритм тебе подходит?</h2>
          <div className="goal-options">
            {([3, 5, 10] as const).map((goal) => (
              <button
                key={goal}
                aria-pressed={daily.goal === goal}
                onClick={() => update((s) => ({ ...s, dailyGoal: goal }))}
              >
                {goal} {goal === 3 ? "действия" : "действий"}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Одно действие — завершённый этап урока или первая попытка ответа на вопрос в отдельной
            практике. Повторы ошибок не считаются дважды.
          </p>
        </section>
      )}
      <SectionHeading title="Следующий маленький шаг" />
      <section className="mission-card">
        <div className="mission-top">
          <div>
            <p className="mission-tag">
              {due
                ? "Время закрепить"
                : finished
                  ? "Все истории пройдены"
                  : `Разговорная миссия ${String(state.day).padStart(2, "0")}`}
            </p>
            <h2>{due ? "Вспомним знакомое" : finished ? "Теперь — в жизнь!" : lesson.titleRu}</h2>
            <p className="mission-description">
              {due
                ? "Самое время освежить знакомые слова в памяти."
                : finished
                  ? "Проверь, что осталось в памяти, и продолжай говорить."
                  : lesson.title}
            </p>
          </div>
          <LessonArtwork day={due ? 3 : state.day} />
        </div>
        <div className="mission-meta">
          <span>
            <Layers3 size={14} aria-hidden="true" />
            {due ? `Карточек: ${due}` : `${lesson.words.length} слов · 6 этапов`}
          </span>
          <span>
            <Zap size={14} aria-hidden="true" />
            {due ? "Укрепляем память" : finished ? "Проверка навыков" : "До 60 XP за урок"}
          </span>
        </div>
        {!due && !finished && (
          <div className="mission-progress" aria-label={`Пройдено ${done} из 6 этапов`}>
            {STEPS.map((step) => (
              <span key={step} className={state.steps[`${state.day}:${step}`] ? "done" : ""} />
            ))}
          </div>
        )}
        {finished && !due ? (
          <Link to="/weekly" className="btn-primary">
            Проверить себя <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <Link to="/lesson" search={{ review: due ? true : undefined }} className="btn-primary">
            {due ? "Закрепить слова" : done ? "Продолжить урок" : "Начать урок"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </section>
      <section id="practice" className="scroll-mt-6">
        <SectionHeading title="На что есть настроение?" aside={<span>Короткая практика</span>} />
        <div className="practice-grid">
          <Link to="/lesson" search={{ review: true }} className="practice-card">
            <div className="practice-icon">
              <Layers3 size={25} aria-hidden="true" />
              <span className="text-xs font-bold">{due || "✓"}</span>
            </div>
            <h3>Не забыть</h3>
            <p>{due ? `К повторению: ${due}` : "Всё закреплено на сейчас"}</p>
            <span className="practice-link">
              Карточки <ArrowRight size={14} aria-hidden="true" />
            </span>
          </Link>
          <Link to="/lesson" search={{ recall: true }} className="practice-card peach">
            <div className="practice-icon">
              <PencilLine size={25} aria-hidden="true" />
              <span className="text-xs font-bold">RU → EN</span>
            </div>
            <h3>Вспомнить самому</h3>
            <p>{studied ? "Напиши без вариантов ответа" : "Откроется после первых слов"}</p>
            <span className="practice-link">
              Вызов памяти <ArrowRight size={14} aria-hidden="true" />
            </span>
          </Link>
        </div>
        <Link to="/translate" className="course-item mt-3">
          <span className="practice-icon">
            <Languages size={24} aria-hidden="true" />
          </span>
          <div>
            <h3>Быстрый перевод</h3>
            <p>Напиши на русском или английском</p>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/weekly" className="course-item mt-3">
          <span className="course-icon">
            <Trophy size={22} aria-hidden="true" />
          </span>
          <div>
            <h3>Проверить себя</h3>
            <p>Слова, фразы и аудирование</p>
          </div>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </section>
      <SectionHeading
        title="Твой разговорный маршрут"
        aside={
          <span>
            {Math.min(state.day - 1, lessons.length)}/{lessons.length} пройдено
          </span>
        }
      />
      <ol className="course-list">
        {lessons.map((item, index) => {
          const completed = item.day < state.day;
          const current = item.day === state.day;
          const Icon = lessonIcons[index]!;
          return (
            <li
              key={item.day}
              className={`course-item ${current ? "current" : completed ? "complete" : ""}`}
            >
              <span className="course-icon">
                {completed ? (
                  <Check size={22} aria-hidden="true" />
                ) : (
                  <Icon size={22} aria-hidden="true" />
                )}
              </span>
              {current ? (
                <Link to="/lesson" search={{ review: undefined }}>
                  <div>
                    <h3>{item.titleRu}</h3>
                    <p>
                      Миссия {item.day} · {done ? "Продолжим отсюда" : "Можно начинать"}
                    </p>
                  </div>
                  <ChevronRight size={18} aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <div>
                    <h3>{item.titleRu}</h3>
                    <p>
                      {completed
                        ? "Завершено · слова в повторении"
                        : `Миссия ${item.day} · после предыдущей`}
                    </p>
                  </div>
                  {!completed && <LockKeyhole size={16} aria-label="Пока закрыто" />}
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div className="coach-note">
        <Lightbulb size={19} aria-hidden="true" />
        <p>
          Сначала попробуй вспомнить, потом смотри ответ. Ошибка — это подсказка, что повторить, а
          не повод остановиться.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
