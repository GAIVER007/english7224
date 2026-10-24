import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { practiceBalance, PRACTICE_SKILLS, SKILL_LABELS } from "@/lib/practice-balance";
import { earnedBadges } from "@/lib/motivation";
import type { AppState } from "@/lib/store";

export function WeeklyRhythm({ state }: { state: AppState }) {
  const balance = practiceBalance(state);
  const nextBadge = earnedBadges(state).find((badge) => !badge.earned);
  return (
    <section className="weekly-rhythm" aria-label="Твоя неделя практики">
      <h2>{balance.skills.length === 4 ? "Разносторонняя неделя" : "Каждый день понемногу"}</h2>
      <p>
        Дней с практикой за последнюю неделю: <strong>{balance.activeDays}</strong>
      </p>
      <div className="rhythm-days">
        {balance.days.map((day) => (
          <div
            key={day.date}
            className={day.count > 0 ? "practiced" : ""}
            aria-label={`${day.date}: ${day.count ? "была практика" : "нет занятий"}${day.isToday ? ", сегодня" : ""}`}
          >
            <span>{day.label}</span>
            <span className={day.isToday ? "today" : ""}>
              {day.count > 0 ? <Check size={18} aria-hidden="true" /> : "·"}
            </span>
          </div>
        ))}
      </div>
      <details>
        <summary>Баланс практики · {balance.skills.length} из 4 направлений</summary>
        <p className="text-sm text-muted-foreground">
          Это виды занятий за неделю, а не оценка владения языком. Чередуй их в удобном темпе.
        </p>
        <ul className="skill-balance">
          {PRACTICE_SKILLS.map((skill) => (
            <li key={skill}>
              <span>{SKILL_LABELS[skill]}</span>
              <span>{balance.skills.includes(skill) ? "Практиковал" : "Можно добавить"}</span>
            </li>
          ))}
        </ul>
        <Link to="/lesson" search={state.day > 1 ? { training: true } : {}} className="btn-ghost">
          {state.day > 1 ? "Понимать и говорить" : "Начать с первой миссии"}
        </Link>
        {nextBadge && (
          <p className="text-sm mt-3">
            <strong>Следующее достижение: {nextBadge.title}.</strong> {nextBadge.description}.
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Пропуски не отнимают XP и достижения. Виды практики учитываются с этого обновления.
        </p>
      </details>
    </section>
  );
}
