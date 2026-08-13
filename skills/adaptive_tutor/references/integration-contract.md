# Integration with existing Lingxi Skills

## Before personalized teaching

1. `lesson_opener` creates curiosity and a learning question.
2. `lecture_builder` gives the first structured explanation.
3. During deck playback, optionally run `adaptive_tutor(mode=preflight)`.

## Personalized phase

Only `adaptive_tutor` is a required student-facing pedagogical Skill.

It may:
- answer in text itself;
- request `visual_explainer`;
- rarely request a remedial `lecture_builder`;
- emit background data for `state_observer`.

## Do not register these v0.1 Skills on the blocking path

- `student-model-builder`
- `productive-struggle`
- `conceptual-conflict`
- `epistemic-calibration`
- `teach-back`
- `learner-model-negotiation`

Their pedagogical mechanisms now live in `strategy-kernel.md`.

## Why

Their boundaries are useful as *conceptual strategies* but too fine-grained as synchronous service
boundaries. Keeping them as separate blocking agents turns one educational decision into several
network/model round-trips and often generates redundant student questions.
