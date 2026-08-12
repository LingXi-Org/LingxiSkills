---
name: learning-state-reflector
description: Non-blocking background Skill that compresses recent learning events into cautious learner-state update proposals after the student-facing response has already been rendered. Use for long-term personalization, evidence de-duplication, verification-debt/checkpoint suggestions, and optional open-learner-model cards. Never ask the learner a question, never block adaptive-pedagogy, and never turn model-derived inferences into formal educational judgments.
license: MIT
metadata:
  author: LingXi-Org
  output-contract: learning-state-reflector-result.v1
  blocking: "false"
---

# Learning State Reflector

This Skill exists to **remove memory work from the learner's critical path**.

It runs after or alongside the student-facing response.

## Hard rules

1. Never produce a required student reply.
2. Never be a dependency that `adaptive-pedagogy` must await.
3. Preserve raw evidence IDs so every state proposal is traceable.
4. Prefer categorical evidence states over fake precision.
5. Never infer intelligence, motivation, disability, personality, mental health, or learning style.
6. Confidence is stored only when the learner explicitly supplied it or the UI captured it.
7. A learner-model card is optional UI; it must not interrupt the lesson.

## Inputs

Read `references/learning-state-reflector-task.schema.json`.

Typical events:
- independent answer;
- answer after hint;
- local hint level opened;
- support choice;
- visual prediction/observation;
- teach-back explanation;
- learner-model challenge;
- direct explanation shown.

## Evidence compression

For each concept, summarize only what is supported:

- `not_observed`
- `emerging`
- `demonstrated`
- `misconception_evidence`
- `needs_recheck`

Keep:
- independent vs assisted;
- recency;
- repeated pattern;
- evidence IDs.

Do not convert one correct answer into "mastered forever".

## Verification debt

If a strong hint/solution was shown and no later independent evidence exists, propose a
`verification_debt` item.

If an independent transfer/retrieval task succeeds, propose discharging the debt.

The reflector does not schedule an immediate question. It suggests the next natural checkpoint.

## Open learner model

When useful, produce an optional card:

```json
{
  "visible": true,
  "claims": [...],
  "actions": ["我不同意", "让我证明"]
}
```

Do not require agreement.

## Prefetch suggestions

You may return:
- likely next checkpoint concept;
- likely visual brief;
- one likely branch note.

These are caches only. `adaptive-pedagogy` must re-check them against the learner's next message.

## Output

Return `learning-state-reflector-result.v1` with:
- `evidence_summary`;
- `state_update_proposals`;
- `verification_debt_proposals`;
- optional `learner_model_card`;
- optional `prefetch_suggestions`.

No student-facing tutoring message is allowed.
