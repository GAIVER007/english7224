import { createFileRoute } from "@tanstack/react-router";
import { BottomNav, TrainingHeader } from "@/components/TrainingUI";
import { QuickTranslator } from "@/components/QuickTranslator";
export const Route = createFileRoute("/translate")({
  head: () => ({ meta: [{ title: "Быстрый перевод — SpeakUp" }] }),
  component: TranslatePage,
});
function TranslatePage() {
  return (
    <main className="app-shell">
      <TrainingHeader title="Быстрый перевод" detail="Русский ↔ English" />
      <h1 className="page-title mb-5">
        Нужное слово.
        <br />
        <span>Прямо сейчас.</span>
      </h1>
      <QuickTranslator />
      <BottomNav active="translate" />
    </main>
  );
}
