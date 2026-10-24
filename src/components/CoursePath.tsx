import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, ClipboardCheck, LockKeyhole } from "lucide-react";
import { lessons } from "@/lib/content";
import {
  courseModules,
  lessonExamKey,
  moduleAvailable,
  moduleExamKey,
  pendingModule,
} from "@/lib/curriculum";
import { lessonIcons } from "@/lib/lesson-icons";
import type { AppState } from "@/lib/store";

interface CoursePathProps {
  state: AppState;
}

export function CoursePath({ state }: CoursePathProps) {
  const pending = pendingModule(state);
  const currentModule =
    pending ??
    courseModules.find((module) => state.day >= module.startDay && state.day <= module.endDay) ??
    courseModules.at(-1);

  return (
    <div className="space-y-3">
      {courseModules.map((module) => {
        const moduleLessons = lessons.filter(
          (lesson) => lesson.day >= module.startDay && lesson.day <= module.endDay,
        );
        const result = state.examResults?.[moduleExamKey(module.id)];
        const available = moduleAvailable(state, module.id);
        const completedCount = moduleLessons.filter((lesson) => lesson.day < state.day).length;
        const isPending = pending?.id === module.id;
        const isFuture = state.day < module.startDay;

        return (
          <details
            key={module.id}
            className="card-soft p-4"
            open={currentModule?.id === module.id ? true : undefined}
          >
            <summary className="min-h-11 cursor-pointer list-none">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-primary">Модуль {module.id} из 6</p>
                  <h2 className="text-base">{module.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {completedCount}/{moduleLessons.length} миссий
                    {result?.passed ? " · экзамен сдан" : isPending ? " · ждёт экзамен" : ""}
                  </p>
                </div>
                {result?.passed ? (
                  <Check size={20} className="shrink-0 text-success" aria-label="Модуль завершён" />
                ) : isFuture ? (
                  <LockKeyhole size={18} className="shrink-0" aria-label="Модуль пока закрыт" />
                ) : (
                  <ChevronRight size={19} className="shrink-0" aria-hidden="true" />
                )}
              </div>
              <div
                className="meter mt-3"
                role="progressbar"
                aria-label={`Прогресс модуля «${module.title}»`}
                aria-valuemin={0}
                aria-valuemax={moduleLessons.length}
                aria-valuenow={completedCount}
              >
                <span style={{ width: `${(completedCount / moduleLessons.length) * 100}%` }} />
              </div>
            </summary>

            <p className="subcopy mt-4">{module.description}</p>
            <ol className="course-list mt-4">
              {moduleLessons.map((lesson) => {
                const completed = lesson.day < state.day;
                const current = lesson.day === state.day && !pending;
                const exam = state.examResults?.[lessonExamKey(lesson.day)];
                const Icon = lessonIcons[(lesson.day - 1) % lessonIcons.length]!;

                const content = (
                  <>
                    <span className="course-icon">
                      {completed ? (
                        <Check size={22} aria-hidden="true" />
                      ) : (
                        <Icon size={22} aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <h3>{lesson.titleRu}</h3>
                      <p>
                        Миссия {lesson.day}
                        {exam
                          ? ` · мини-экзамен ${exam.correct}/${exam.total}`
                          : completed
                            ? " · пройдено ранее"
                            : current
                              ? " · можно начинать"
                              : " · по порядку"}
                      </p>
                    </div>
                    {current || completed ? (
                      <ChevronRight size={18} aria-hidden="true" />
                    ) : (
                      <LockKeyhole size={16} aria-label="Пока закрыто" />
                    )}
                  </>
                );

                return (
                  <li
                    key={lesson.day}
                    className={`course-item ${current ? "current" : completed ? "complete" : ""}`}
                  >
                    {completed ? (
                      <Link
                        to="/lesson"
                        search={{ practice: lesson.day }}
                        aria-label={`Повторить миссию ${lesson.day}: ${lesson.titleRu}`}
                      >
                        {content}
                      </Link>
                    ) : current ? (
                      <Link
                        to="/lesson"
                        search={{}}
                        aria-label={`Открыть миссию ${lesson.day}: ${lesson.titleRu}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <ClipboardCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm">Экзамен модуля</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result
                      ? `${result.correct}/${result.total} · ${result.passed ? "сдан" : "нужно повторить"}`
                      : "Откроется после пяти миссий. Для продолжения нужно 80%."}
                  </p>
                </div>
              </div>
              {available ? (
                <Link
                  to="/lesson"
                  search={{ module: module.id }}
                  className={result?.passed ? "btn-ghost mt-3 w-full" : "btn-primary mt-3 w-full"}
                >
                  {result?.passed ? "Пересдать для практики" : "Пройти экзамен"}
                  <ChevronRight size={18} aria-hidden="true" />
                </Link>
              ) : (
                <button className="btn-ghost mt-3 w-full" disabled aria-disabled="true">
                  {completedCount === moduleLessons.length
                    ? "Сначала сдать предыдущий модуль"
                    : `Сначала пройти миссии ${module.startDay}–${module.endDay}`}
                </button>
              )}
            </div>
          </details>
        );
      })}
      <p className="px-2 text-xs leading-5 text-muted-foreground">
        Эти 30 миссий — практика A2 → B1, а не весь английский. После маршрута остаются повторение,
        разговорная практика и недельные проверки. Следующие уровни пока не добавлены.
      </p>
    </div>
  );
}
