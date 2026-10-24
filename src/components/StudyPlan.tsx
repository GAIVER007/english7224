import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { studyPlan } from "@/lib/study-plan";
import type { AppState } from "@/lib/store";

export function StudyPlan({ state }: { state: AppState }) {
  const [next, ...alternatives] = studyPlan(state);
  if (!next) return null;
  return (
    <section className="study-plan" aria-labelledby="study-plan-title">
      <p className="eyebrow">Подобрано по твоему прогрессу</p>
      <h2 id="study-plan-title">{next.title}</h2>
      <p className="study-reason">{next.reason}</p>
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
