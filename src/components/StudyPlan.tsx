import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers3, Trophy } from "lucide-react";
import { studyPlan } from "@/lib/study-plan";
import { STEPS, type AppState } from "@/lib/store";

export function StudyPlan({ state }: { state: AppState }) {
  const [next, ...alternatives] = studyPlan(state);
  if (!next) return null;
  const Icon = next.id === "module" ? Trophy : next.id === "review" ? Layers3 : BookOpen;
  const completed = STEPS.filter((step) => state.steps[`${state.day}:${step}`]).length;
  return (
    <section className="study-plan" aria-labelledby="study-plan-title">
      <div className="study-card-top">
        <span className="study-kicker">
          {next.id === "lesson"
            ? `Миссия ${String(state.day).padStart(2, "0")}`
            : next.id === "module"
              ? "Твой следующий рубеж"
              : "Практика для тебя"}
        </span>
        <span className="study-symbol">
          <Icon size={24} aria-hidden="true" />
        </span>
      </div>
      <h2 id="study-plan-title">{next.title}</h2>
      <p className="study-reason">{next.reason}</p>
      {next.id === "lesson" && (
        <div
          className="study-stage-track"
          aria-label={`Завершено ${completed} из ${STEPS.length} этапов`}
        >
          {STEPS.map((step) => (
            <span key={step} className={state.steps[`${state.day}:${step}`] ? "complete" : ""} />
          ))}
        </div>
      )}
      <Link to="/lesson" search={next.search} className="btn-primary">
        {next.label}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
      <details className="study-alternatives">
        <summary>Другой вариант</summary>
        {alternatives.map((action) => (
          <Link key={action.id} to="/lesson" search={action.search} className="study-alternative">
            <span>
              <strong>{action.title}</strong>
              <small>{action.reason}</small>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </details>
    </section>
  );
}
