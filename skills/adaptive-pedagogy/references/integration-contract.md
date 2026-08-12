# Integration with existing Lingxi Skills

## Before personalized teaching

1. `lecture-hook` creates curiosity and a learning question.
2. `lecture-deck` gives the first structured explanation.
3. During deck playback, optionally run `adaptive-pedagogy(mode=preflight)`.

## Personalized phase

Only `adaptive-pedagogy` is a required student-facing pedagogical Skill.

It may:
- answer in text itself;
- request `visual-explainer`;
- rarely request a remedial `lecture-deck`;
- emit background data for `learning-state-reflector`.

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
