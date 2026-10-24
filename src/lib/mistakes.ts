import { lessons } from "./content";
import type { AppState } from "./store";

/** Only learned words still needing reinforcement; historical errors alone are not weaknesses. */
export function mistakeWords(state: AppState) {
  return lessons
    .flatMap((lesson) => lesson.words)
    .filter((word) => {
      const card = state.cards[word.id];
      return card && card.wrong > 0 && card.box < 2;
    })
    .sort(
      (a, b) =>
        state.cards[a.id]!.box - state.cards[b.id]!.box ||
        state.cards[b.id]!.wrong - state.cards[a.id]!.wrong ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 5);
}
