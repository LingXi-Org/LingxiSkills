---
name: lesson-intro
description: >-
  Research and create a short, evidence-grounded, curiosity-driven opening that makes a lesson
  concept necessary. Use for historical context, real-world cases, surprising facts,
  misconceptions, paradoxes, failure stories, or “why should I care?” openings that must bridge
  directly into the target concept. Verify factual claims with web research; never invent
  anecdotes. Chinese display name: 课程引入设计。Chinese display description: 通过可核验的事实设计简短、有好奇心且能自然进入知识点的中文课程开场。
license: MIT
compatibility: LingxiGraph Agent Skills runtime with web research
metadata:
  author: LingXi-Org
  version: 1.0.0
  display-name: 课程引入设计
  display-description: 通过可核验的事实设计简短、有好奇心且能自然进入知识点的中文课程开场。
  output-language: zh-CN
  output-contract: lesson-intro-result.v1
  execution-mode: research-required
---

# Lecture Hook

## Role

Create an instructional doorway, not a decorative story. The opening must create a concrete
information gap, make the target concept necessary, ground factual claims in sources, and remain
brief enough to hand off to the lesson in roughly 45–120 seconds.

## Output language

Write the opening, story, question, transition, candidate summaries, caveats, and teacher notes in
Simplified Chinese. Keep URLs, source titles, evidence IDs, formulas, code, and schema keys as
provided. Return `lesson-intro-result.v1`.

## Inputs

Read `references/lesson-intro-task.schema.json`. Require `topic`; infer optional fields
conservatively without blocking. Use `learning_objective`, `learner_level`, `course_context`,
`target_duration_sec`, `language`, and `avoid` when supplied. The output language remains Chinese
unless a higher-priority runtime policy explicitly changes it.

## Research workflow

1. Write an internal objective: “After this opening, the learner should be asking ___, and the
   target concept should be the natural answer.”
2. Search at least four suitable angles: origin or historical need, human conflict, failure or
   limitation, counterintuitive fact, everyday phenomenon, modern application, misconception, or
   extreme case. Use `assets/query-patterns.md` when useful.
3. Search broadly, inspect at least six results by default, fetch at least three promising pages,
   and use two independent sources for the core premise unless one decisive primary source is
   sufficient.
4. Apply `references/source-quality.md`. Prefer primary sources, official archives, universities,
   museums, professional societies, governments, standards bodies, peer-reviewed work, and only
   then reputable secondary sources. Use tertiary sources for discovery, not as the sole support
   for contentious claims.
5. Maintain an evidence ledger for every fact likely to enter the narration: claim, source IDs,
   support state (`verified`, `qualified`, or `rejected`), confidence, and required uncertainty.
6. Draft three materially different Chinese candidates, preferably from different hook patterns.
   Each should have an immediate scene or puzzle, a tension, a learner-facing question, and a
   bridge to the target concept. Do not explain the answer too early.
7. Score candidates using alignment, curiosity, evidence strength, teachability, learner fit, and
   brevity. Reject fabricated, contradicted, weakly grounded, or loosely related candidates.
8. Apply the seductive-detail test: every detail must increase the need to understand the target
   concept.

## Fallback and domain guidance

If historical grounding is weak, use this order: counterintuitive observation, real-world failure,
everyday phenomenon, misconception, thought experiment, then historical origin. For mathematics,
prefer puzzles and visual contradictions. For computer science and engineering, prefer incidents,
trade-offs, scale problems, or design constraints. For natural science, use observation to anomaly
to question. For humanities and social science, preserve competing interpretations and primary
source tension.

If trustworthy grounding cannot be established, set `status` to `insufficient_evidence`, use a
clearly labeled thought experiment or grounded nonhistorical hook, and explain the limitation in
Chinese `warnings`.

## Required result

Return the selected hook title, `opening`, `story`, `question`, `transition`, optional visual cue,
three candidate summaries and scores, the claim-to-source evidence ledger, source list, uncertainty
flags, and `why_this_hook_works`. Keep URLs and evidence in `research`, not in spoken narration,
unless the caller explicitly asks for citations in the script. All prose and learner-facing text
must be Chinese.
