import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Layers3,
  Languages,
  PencilLine,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { emptyPath } from "@/lib/pathway/state";
import { CoursePath } from "@/components/CoursePath";
import { lessons } from "@/lib/content";
import { StudyPlan } from "@/components/StudyPlan";
import { currentStreak, dueWords, studiedWords } from "@/lib/learning";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
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
  const { state, ready } = useAppState();
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
            Программа от первых слов до сложных тем A0–C1 и {lessons.length} разговорных ситуаций.
            Без регистрации, в твоём темпе.
          </p>
        </div>
      </main>
    );

  const due = dueWords(state).length;
  const studied = studiedWords(state).length;
  return (
    <main className="app-shell home-shell">
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
      <div className="home-intro">
        <h1>Сегодня</h1>
        <p>Ещё один шаг к свободному английскому.</p>
      </div>
      <Link to="/course" search={{}} className="path-home-card">
        <span className="eyebrow">Твоя программа · A0–C1</span>
        <h2>Продолжить обучение</h2>
        <p>
          Текущий этап: {(state.pathway ?? emptyPath()).selected} · чтение, речь, письмо и практика
        </p>
        <span className="path-home-cta">
          Открыть программу <ArrowRight size={18} aria-hidden="true" />
        </span>
      </Link>
      <WeeklyRhythm state={state} />
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
      <details className="course-disclosure">
        <summary>
          Разговорные ситуации · {Math.min(state.day - 1, lessons.length)} из {lessons.length}{" "}
          миссий
        </summary>
        <StudyPlan state={state} />
        <CoursePath state={state} />
      </details>
      <BottomNav />
    </main>
  );
}
