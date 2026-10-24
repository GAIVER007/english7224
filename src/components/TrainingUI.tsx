import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, AudioLines, ChartNoAxesCombined, House, Layers3, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { lessonIcons } from "@/lib/lesson-icons";

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <AudioLines size={20} aria-hidden="true" />
      </span>
      speakup<span className="brand-dot">.</span>
    </span>
  );
}
export function BottomNav({ active = "home" }: { active?: "home" | "practice" | "progress" }) {
  const hash = useLocation({ select: (location) => location.hash });
  const selected = active === "home" && hash === "practice" ? "practice" : active;
  return (
    <nav className="bottom-nav" aria-label="Главная навигация">
      <Link
        to="/"
        className={selected === "home" ? "is-selected" : ""}
        aria-current={selected === "home" ? "page" : undefined}
      >
        <House aria-hidden="true" size={22} />
        <span>Сегодня</span>
      </Link>
      <Link
        to="/"
        hash="practice"
        aria-current={selected === "practice" ? "location" : undefined}
        className={selected === "practice" ? "is-selected" : ""}
      >
        <Layers3 aria-hidden="true" size={22} />
        <span>Практика</span>
      </Link>
      <Link
        to="/progress"
        className={selected === "progress" ? "is-selected" : ""}
        aria-current={selected === "progress" ? "page" : undefined}
      >
        <ChartNoAxesCombined aria-hidden="true" size={22} />
        <span>Мой рост</span>
      </Link>
    </nav>
  );
}
export function TrainingHeader({ title, detail }: { title: string; detail?: string }) {
  return (
    <header className="training-header">
      <Link to="/" className="icon-button" aria-label="На главную">
        <ArrowLeft size={22} aria-hidden="true" />
      </Link>
      <div>
        <p className="font-bold">{title}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </div>
      <span className="mini-spark">
        <Sparkles size={18} aria-hidden="true" />
      </span>
    </header>
  );
}
export function LessonArtwork({ day = 1 }: { day?: number }) {
  const Icon = lessonIcons[(day - 1) % lessonIcons.length]!;
  return (
    <div className="lesson-art" aria-hidden="true">
      <span className="art-orbit" />
      <span className="art-spark art-spark-one">✦</span>
      <span className="art-spark art-spark-two">✦</span>
      <div className="art-ticket">
        <span className="ticket-label">LET’S TALK</span>
        <Icon size={42} strokeWidth={1.7} />
        <span className="ticket-dashes" />
      </div>
      <span className="art-bubble">hi!</span>
    </div>
  );
}
export function SectionHeading({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {aside}
    </div>
  );
}
