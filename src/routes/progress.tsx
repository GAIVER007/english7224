import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Check,
  Flame,
  Leaf,
  LockKeyhole,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { ResultHistory } from "@/components/ResultHistory";
import { ProgressBackup } from "@/components/ProgressBackup";
import { PersonalRating } from "@/components/PersonalRating";
import { mistakeWords } from "@/lib/mistakes";
import { lessons } from "@/lib/content";
import { courseModules, moduleExamKey } from "@/lib/curriculum";
import { AREA_LABELS, type Area } from "@/lib/exam";
import { currentStreak, dueWords } from "@/lib/learning";
import { earnedBadges, learnerRank, weeklyActivity } from "@/lib/motivation";
import { resetAppState, useAppState } from "@/lib/store";
import { BottomNav, SectionHeading, TrainingHeader } from "@/components/TrainingUI";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Мой рост — SpeakUp" },
      { name: "description", content: "Твоя практика, достижения и следующие шаги в английском." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { state, ready } = useAppState();
  if (!ready)
    return (
      <main className="app-shell" role="status">
        Собираем твои достижения…
      </main>
    );
  const cards = Object.entries(state.cards);
  const learned = cards.filter(([, card]) => card.box >= 2).length;
  const allWords = lessons.flatMap((lesson) => lesson.words);
  const weak = mistakeWords(state).map((word) => [word.id, state.cards[word.id]!] as const);
  const rank = learnerRank(state.xp);
  const week = weeklyActivity(state);
  const peak = Math.max(5, ...week.map((day) => day.count));
  const badges = earnedBadges(state);
  return (
    <main className="app-shell">
      <TrainingHeader title="Мой рост" detail="Каждая попытка имеет значение" />
      <p className="eyebrow">Твоя личная история</p>
      <h1 className="page-title">
        Посмотри, как далеко
        <br />
        <span>ты уже продвинулся.</span>
      </h1>
      <PersonalRating state={state} />
      <section className="rank-card mt-6">
        <div className="rank-top">
          <div className="rank-symbol">
            <Sparkles size={32} aria-hidden="true" />
          </div>
          <div>
            <p>Ранг практики · {rank.level}</p>
            <h2>{rank.title}</h2>
          </div>
        </div>
        <div
          className="meter"
          role="progressbar"
          aria-label="Прогресс игрового ранга"
          aria-valuenow={rank.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${rank.percent}%` }} />
        </div>
        <div className="flex justify-between gap-3">
          <p>{state.xp} XP заработано</p>
          <p>
            {rank.level === 5
              ? "Все ранги открыты. Продолжай закреплять слова!"
              : `Следующий ранг: ${rank.neededXp} XP`}
          </p>
        </div>
      </section>
      <p className="mt-2 text-xs text-muted-foreground">
        Ранг отражает практику, а не языковой уровень.
      </p>
      <SectionHeading title="Экзамены модулей" aside={<span>A2 → B1</span>} />
      <section className="card-soft p-5">
        <ul className="space-y-4">
          {courseModules.map((module) => {
            const result = state.examResults?.[moduleExamKey(module.id)];
            return (
              <li key={module.id} className="flex min-h-11 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {module.id}. {module.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result
                      ? new Date(result.completedAt).toLocaleDateString("ru-RU")
                      : `После миссии ${module.endDay}`}
                  </p>
                </div>
                <span
                  className={
                    result?.passed
                      ? "shrink-0 text-right text-sm font-bold text-success"
                      : "shrink-0 text-right text-xs text-muted-foreground"
                  }
                >
                  {result
                    ? `${result.correct}/${result.total} · ${result.passed ? "сдан" : "повторить"}`
                    : "впереди"}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          Это учебные проверки внутри SpeakUp. Они показывают, что повторить, но не являются
          официальной оценкой или сертификатом CEFR.
        </p>
      </section>
      <div className="stats-grid">
        <div className="stat-tile">
          <Flame size={19} className="mx-auto mb-2 text-primary" aria-hidden="true" />
          <strong>{currentStreak(state)}</strong>
          <span>дней в серии</span>
        </div>
        <div className="stat-tile">
          <Leaf size={19} className="mx-auto mb-2 text-success" aria-hidden="true" />
          <strong>{learned}</strong>
          <span>слов закреплено</span>
        </div>
        <div className="stat-tile">
          <Check size={19} className="mx-auto mb-2 text-primary" aria-hidden="true" />
          <strong>
            {Math.min(state.day - 1, lessons.length)}/{lessons.length}
          </strong>
          <span>миссий пройдено</span>
        </div>
      </div>
      <SectionHeading title="Понемногу, но регулярно" aside={<span>Последние 7 дней</span>} />
      <section className="card-soft p-5">
        <div className="flex justify-between items-center gap-3">
          <h3 className="text-sm">
            Учебных действий: {week.reduce((sum, day) => sum + day.count, 0)}
          </h3>
          <span className="text-xs text-muted-foreground">Твой ритм</span>
        </div>
        <div className="week-chart">
          {week.map((day) => (
            <div
              key={day.date}
              className={`week-day ${day.isToday ? "today" : ""}`}
              aria-label={`${day.date}, действий: ${day.count}`}
            >
              <div className="week-track">
                <span style={{ height: `${(day.count / peak) * 100}%` }} />
              </div>
              <span>{day.label}</span>
              <span className="block mt-1 font-bold">{day.count}</span>
            </div>
          ))}
        </div>
      </section>
      <SectionHeading
        title="Маленькие победы"
        aside={
          <span>
            {badges.filter((badge) => badge.earned).length}/{badges.length}
          </span>
        }
      />
      <section className="badge-grid">
        {badges.map((badge, index) => {
          const Icon = [Sparkles, Flame, Leaf, Target, Award, Trophy][index % 6]!;
          return (
            <article key={badge.id} className={`badge-card ${badge.earned ? "earned" : ""}`}>
              <div className="flex justify-between">
                <Icon size={27} aria-hidden="true" />
                {badge.earned ? (
                  <Check size={15} aria-label="Получено" />
                ) : (
                  <LockKeyhole size={14} aria-label="Ещё не получено" />
                )}
              </div>
              <h3>{badge.title}</h3>
              <p>{badge.description}</p>
            </article>
          );
        })}
      </section>
      <SectionHeading title="Дадим этим словам ещё шанс" />
      <section className="card-soft p-5">
        {weak.length ? (
          <ul className="space-y-3">
            {weak.map(([id, card]) => (
              <li key={id} className="flex justify-between gap-3 items-center">
                <div>
                  <p className="text-sm font-bold">
                    {allWords.find((word) => word.id === id)?.en ?? id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {allWords.find((word) => word.id === id)?.ru}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Ошибок: {card.wrong}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="subcopy">
            Здесь появятся слова, которым нужно чуть больше внимания. Ошибаться — нормально.
          </p>
        )}
        <Link to="/lesson" search={{ review: true }} className="btn-ghost mt-5 w-full">
          Повторить слова ({dueWords(state).length}) <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {weak.length > 0 && (
          <Link to="/lesson" search={{ mistakes: true }} className="btn-primary mt-3 w-full">
            Разобрать ошибки ({weak.length}) <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </section>
      <ResultHistory records={state.resultHistory ?? []} />
      <SectionHeading title="Последняя проверка" />
      <section className="card-soft p-5">
        {state.weeklyResult ? (
          <>
            <div className="flex items-end justify-between gap-3">
              <p className="text-3xl font-extrabold">
                {state.weeklyResult.correct}
                <span className="text-lg text-muted-foreground"> / {state.weeklyResult.total}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(state.weeklyResult.completedAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {Object.entries(state.weeklyResult.areas)
                .filter(([, area]) => area.total > 0)
                .map(([name, area]) => (
                  <div key={name}>
                    <p className="flex justify-between text-xs mb-2">
                      <span>{AREA_LABELS[name as Area] ?? name}</span>
                      <span>
                        {area.correct}/{area.total}
                      </span>
                    </p>
                    <div className="meter">
                      <span style={{ width: `${(area.correct / area.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <p className="subcopy">
            Короткая проверка покажет, что уже получается, а что стоит повторить.
          </p>
        )}
        <Link to="/weekly" className="btn-ghost mt-5 w-full">
          Проверить себя <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <details className="card-soft mt-6 p-5">
        <summary className="min-h-11 cursor-pointer font-bold text-sm">Мои настройки</summary>
        <p className="subcopy mt-3">
          Ориентир: {state.level ?? "не выбран"}. Текущий маршрут — практика от A2 к задачам B1.
        </p>
        <Link to="/placement" search={{ choose: true }} className="btn-ghost mt-3 w-full">
          Изменить уровень
        </Link>
        <section className="mt-5 border-t border-border pt-5" aria-labelledby="phone-title">
          <h3 id="phone-title">SpeakUp на главном экране</h3>
          <p className="subcopy mt-2">
            На iPhone: открой сайт в Safari → «Поделиться» → «На экран Домой». На Android: меню
            браузера → «Добавить на главный экран» или «Установить приложение».
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Сначала открой приложение с интернетом и дождись сообщения о готовности офлайн-режима.
            Для перевода отдельно скачай языковые пакеты. Сохрани копию прогресса перед переходом в
            установленное приложение: браузер может использовать отдельное хранилище.
          </p>
        </section>
        <ProgressBackup />
        <p className="mt-5 text-xs text-muted-foreground">
          Прогресс живёт в этом браузере. Очистка его данных удалит достижения.
        </p>
        <button
          className="btn-ghost mt-4 w-full text-destructive"
          onClick={() => {
            if (confirm("Сбросить весь прогресс и достижения? Это действие нельзя отменить."))
              resetAppState();
          }}
        >
          Сбросить прогресс
        </button>
      </details>
      <BottomNav active="progress" />
    </main>
  );
}
