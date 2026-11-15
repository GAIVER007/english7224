# SpeakUp voice tutor

## Goal
Add a working, two-way spoken English tutor that greets Yuri, leads practical conversation, gives gentle corrections after each answer, and tracks lessons and homework across his signed-in devices.

## Experience
- Add a tutor entry point from the home screen and a dedicated call page with topic/level selection, Mira’s portrait area, live captions, microphone mute, playback recovery, call status, and explicit start/end controls.
- Use the selected energetic feminine voice and bilingual English/Russian coaching. The tutor speaks first, practices conversational English, and corrects naturally after the learner finishes speaking.
- After each call, keep a dated lesson record and any tutor-assigned homework in progress; allow marking homework complete and reviewing past lessons.
- Keep the existing local-first progress store and account cloud-sync workflow so rating and tutor history remain synchronized without replacing current data.

## Technical approach
- Use the required Live voice SDK, persistent WebSocket relay, typed backend delegation, browser hook, and Vite development adapter; preserve heartbeat, cancellation, usage, and error handling.
- Store validated tutor lesson/homework records in the existing `AppState`, which is already synchronized through `user_progress`; do not create a parallel progress store.
- Keep server credentials server-only. Use the current workspace Live and Responses defaults, generated SDK contracts, and test the persisted tutor records and call UI.
- If workspace image credits remain unavailable, retain the full tutor experience with a designed portrait placeholder instead of blocking the voice feature.
