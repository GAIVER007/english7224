import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  RefreshCcw,
  Target,
  Trophy,
} from "lucide-react";
import { pathwayPlan, type PathwayPlanAction } from "@/lib/pathway/plan";
import { saveUnit } from "@/lib/pathway/progress";
import { emptyPath } from "@/lib/pathway/state";
import { useAppState, type AppState } from "@/lib/store";

const iconByKind = {
  "word-review": Layers3,
  remediation: Target,
  "resume-unit": BookOpen,
  "unit-review": RefreshCcw,
  "level-exam": Trophy,
  "next-unit": BookOpen,
  "next-level": Trophy,
  complete: CheckCircle2,
} as const;

function kicker(action: PathwayPlanAction) {
  switch (action.kind) {
    case "word-review":
      return "Память на сегодня";
    case "remediation":
      return "После контрольной";
    case "resume-unit":
      return "Продолжить с места";
    case "unit-review":
      return "Плановое повторение";
    case "level-exam":
      return "Следующий рубеж";
    case "next-level":
      return "Новый этап";
    case "complete":
      return "Этап завершён";
    default:
      return "Следующий шаг";
  }
}

export function PathwayPlan({ state }: { state: AppState }) {
  const { update } = useAppState();
  const [next, ...alternatives] = pathwayPlan(state);
  if (!next) return null;
  const Icon = iconByKind[next.kind];
  const progress = next.unitId ? state.pathway?.units[next.unitId] : undefined;
  const runAction = (action: PathwayPlanAction) => {
    if (action.kind === "remediation" || action.kind === "unit-review") {
      update((current) =>
        action.unitId ? saveUnit(current, action.unitId, { stage: 0 }) : current,
      );
    } else if (action.selectLevel) {
      update((current) => ({
        ...current,
        pathway: { ...(current.pathway ?? emptyPath()), selected: action.selectLevel! },
      }));
    }
  };

  return (
    <section className="study-plan" aria-labelledby="pathway-plan-title">
      <div className="study-card-top">
        <span className="study-kicker">{kicker(next)}</span>
        <span className="study-symbol">
          <Icon size={24} aria-hidden="true" />
        </span>
      </div>
      <h2 id="pathway-plan-title">{next.title}</h2>
      <p className="study-reason">{next.reason}</p>
      {progress && (next.kind === "resume-unit" || next.kind === "next-unit") && (
        <div
          className="study-stage-track"
          aria-label={`Завершено ${progress.stage} из 6 этапов темы`}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={index < progress.stage ? "complete" : ""} />
          ))}
        </div>
      )}
      <Link
        to="/course"
        search={next.search}
        className="btn-primary"
        onClick={() => runAction(next)}
      >
        {next.label}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
      {alternatives.length > 0 && (
        <details className="study-alternatives">
          <summary>Другие полезные шаги · {alternatives.length}</summary>
          {alternatives.map((action) => (
            <Link
              key={action.id}
              to="/course"
              search={action.search}
              className="study-alternative"
              onClick={() => runAction(action)}
            >
              <span>
                <strong>{action.title}</strong>
                <small>{action.reason}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </details>
      )}
    </section>
  );
}
