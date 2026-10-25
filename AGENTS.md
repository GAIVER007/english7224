<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Learner progress lives in browser localStorage via src/lib/store.ts and lesson content in src/lib/content.ts — no backend yet; move to Cloud when accounts are added.
- Signed-in learners' progress syncs to Cloud table user_progress via src/lib/cloud-sync.ts (localStorage stays the working copy; three-way merge against a per-account baseline; conflicting records require an explicit choice) — keeps rating across devices.
