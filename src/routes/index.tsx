import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Layers3,
  Languages,
  PencilLine,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { CoursePath } from "@/components/CoursePath";
import { lessons } from "@/lib/content";
import { CoachBridge } from "@/components/CoachBridge";
import { StudyPlan } from "@/components/StudyPlan";
import { currentStreak, dueWords, studiedWords } from "@/lib/learning";
import { dailyProgress } from "@/lib/motivation";
import { useAppState } from "@/lib/store";
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
            Начнём с {lessons.length} жизненных ситуаций: от уверенной практики A2 к задачам B1. Без
            регистрации, в твоём темпе.
          </p>
        </div>
      </main>
    );

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
            Хороший день
            <br />
            <span>для английского.</span>
          </>
        ) : (
          <>
            Английский
            <br />
            <span>в твоём ритме.</span>
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
      <StudyPlan state={state} />
      <section id="practice" className="scroll-mt-6">
        <SectionHeading title="Практика" aside={<span>Выбери навык</span>} />
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
        <div className="training-tools">
          <Link to="/lesson" search={{ free: true }} className="training-tool">
            <span className="course-icon">
              <PencilLine size={24} aria-hidden="true" />
            </span>
            <div>
              <h3>Свободный тренажёр</h3>
              <p>Собирай предложения и тренируй времена</p>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/lesson" search={{ training: true }} className="training-tool">
            <span className="course-icon">
              <Languages size={24} aria-hidden="true" />
            </span>
            <div>
              <h3>Лаборатория речи</h3>
              <p>Аудиодиктант, пересказ и твоя реплика</p>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/translate" className="training-tool">
            <span className="course-icon">
              <Languages size={24} aria-hidden="true" />
            </span>
            <div>
              <h3>Быстрый перевод</h3>
              <p>Напиши на русском или английском</p>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/weekly" className="training-tool">
            <span className="course-icon">
              <Trophy size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>Проверить себя</h3>
              <p>Слова, фразы и аудирование</p>
            </div>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <CoachBridge state={state} />
      <details className="course-disclosure">
        <summary>
          Курс · {Math.min(state.day - 1, lessons.length)} из {lessons.length} миссий
        </summary>
        <CoursePath state={state} />
      </details>
      <BottomNav />
    </main>
  );
}
