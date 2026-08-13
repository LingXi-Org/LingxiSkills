# LingxiSkills

Open Agent Skills for LingxiGraph and other Agent Skills-compatible runtimes.

Each directory under `skills/` is an independent standard Skill. A Skill must
contain `SKILL.md` with YAML frontmatter and may include `scripts/`,
`references/`, and `assets/`. The repository does not define a LingxiGraph-only
Skill format.

## Metadata and output convention

Every bundled Skill uses an English lowercase kebab-case `name` for standard
runtime identity. Production teaching Skills also use a `metadata` map containing `display-name`,
`display-description`, `output-language: zh-CN`, `output-contract`, `version`,
`author`, and execution-plan fields: `phase`, `critical-path`, `learner-facing`,
`state-write-mode`, `parallel-safe`, `latency-class`, and `eval-suite`.
LingxiGraph natively preserves this metadata when a Skill is
loaded, while the Chinese display fields are also included in `description`
for discovery-time catalogs that expose only `name` and `description`.

All generated learner-facing artifacts are Simplified Chinese by contract.
Protocol keys, identifiers, formulas, code, URLs, and file names remain in
their original technical form.

## Use with LingxiGraph

Clone this repository and point LingxiGraph at the `skills/` directory:

```python
from lingxigraph import FilesystemSkillSource, HumanMessage, create_agent

skills = FilesystemSkillSource("/path/to/LingxiSkills/skills")
agent = create_agent(model, skills=skills)
result = agent.invoke({"messages": [HumanMessage("用中文问候我")]})
```

The initial model context contains only XML-escaped Skill names and
descriptions. The model can explicitly call `read_skill` to load a complete
`SKILL.md`, then `read_skill_resource` for a file under `references/`,
`scripts/`, or `assets/`. Resource reads are bounded and traversal-safe.

Scripts are content resources only: discovering or reading a Skill never
executes them. `allowed-tools` is advisory metadata and cannot grant runtime
permissions or bypass LingxiGraph ToolSpec authorization, HITL approval,
timeouts, budgets, or other policy controls.

## Included Skills

- `interactive-visual-explainer`: creates a self-contained, offline interactive HTML page
  for concepts that benefit from diagrams and controlled exploration.
- `lesson-intro`: directly creates a polished, human-sounding Chinese single-file HTML lesson
  introduction from supplied curriculum context, without web search or result aggregation.
- `interactive-lecture-deck`: builds fixed-size, self-contained HTML lecture decks with
  structured zoom data, protected-view spatial runtime behavior, an offline
  `dist/lecture.html` build, and strict visual/structure validation.
- `adaptive-pedagogy`: chooses one evidence-based, low-friction teaching strategy and
  returns a student-facing response without unnecessary blocking dialogue.
- `learner-state-reflector`: compresses learning events into cautious, non-blocking
  state-update and verification-debt proposals without making educational diagnoses.
- `formative-assessor`: converts deterministic grading and explicit learner signals into a
  structured evidence state for `adaptive-pedagogy`, without writing to the learner.
- `retrieval-practice-builder`: prefetches one evidence-grounded retrieval, transfer, boundary, or
  misconception-discriminator task with a separate public task and grading key.
- `quiz-generator`: creates compact, evidence-grounded Chinese formative quizzes from taught
  lesson material and provides deterministic contract validation plus a grading-safe snapshot.
- `skill-eval-harness`: evaluates Skill contracts, execution trajectories, pedagogical safety, and
  learner outcomes with deterministic, development-time reports.
- `curriculum-graph-builder`: builds or incrementally extends learner-specific curriculum graphs
  with stable IDs, explicit relations, and cautious learner-state overlays.

## Execution-plan invariants

`lesson-intro` and `interactive-lecture-deck` are preparation peers and may run in parallel.
`adaptive-pedagogy` is the only learner-facing writer in the personalized loop. State reflection,
visual artifacts, retrieval tasks, quizzes, and remedial decks are non-blocking sidecars or prefetch
work; they must not delay the already-rendered learner response. `formative-assessor` is a conditional
structured hop only for ambiguous evidence. The runtime should enforce
`learner_facing_writer_count <= 1` and use the metadata above instead of inferring parallelism from
Skill prose.

## Validate locally

The runtime dependency remains zero-dependency. Install the optional
development validator and validate every Skill:

```bash
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows: .venv\\Scripts\\activate
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/interactive-visual-explainer
python -m skills_ref.cli validate skills/lesson-intro
python -m skills_ref.cli validate skills/interactive-lecture-deck
python -m skills_ref.cli validate skills/adaptive-pedagogy
python -m skills_ref.cli validate skills/learner-state-reflector
python -m skills_ref.cli validate skills/formative-assessor
python -m skills_ref.cli validate skills/retrieval-practice-builder
python -m skills_ref.cli validate skills/quiz-generator
python -m skills_ref.cli validate skills/skill-eval-harness
python -m skills_ref.cli validate skills/curriculum-graph-builder
```

`skills-ref==0.1.1` is a development/CI validation dependency only.

The development evaluator can run every checked-in suite:

```bash
python skills/skill-eval-harness/scripts/run_suite.py .
```

## Contributing

Keep `SKILL.md` concise and imperative. Put detailed, conditional material in
directly linked `references/` files, deterministic helpers in `scripts/`, and
output templates or other non-context assets in `assets/`. Do not add private
frontmatter fields or automatic script execution behavior.

See [CONTRIBUTING.md](CONTRIBUTING.md) for validation expectations.
