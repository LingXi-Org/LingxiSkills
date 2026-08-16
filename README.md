<div align="center">

# LingxiSkills

**Composable Agent Skills for AI learning products.**

Reusable teaching, visualization, assessment, learner-state, runtime, orchestration, and evaluation capabilities for the LingXi stack.

[简体中文](README.zh-CN.md) · [LingxiGraph](https://github.com/LingXi-Org/LingxiGraph) · [LingxiLearn](https://github.com/LingXi-Org/LingxiLearn)

</div>

## About

LingxiSkills is the reusable capability layer of the LingXi stack. Each Skill is an independently discoverable directory centered on a `SKILL.md` contract, with optional references, scripts, assets, agents, and tests.

The repository currently contains **31 top-level Skills**. They cover learner-facing teaching capabilities as well as runtime control, orchestration, validation, evidence, and reusable utility contracts.

Products such as LingxiLearn consume these capabilities through LingxiGraph or another compatible Agent Skills runtime.

```text
Learning Product
      │
      ▼
LingxiGraph Runtime
      │
      ▼
LingxiSkills
SKILL.md · References · Scripts · Assets
```

## Current Skills

### Teaching & dialogue

- `adaptive-pedagogy`
- `knowledge-qa`
- `learner-interview`
- `learning-companion`
- `negotiation`
- `socratic-prober`

### Content & visualization

- `lesson-intro`
- `interactive-lecture-deck`
- `interactive-visual-explainer`

### Assessment & practice

- `deterministic-grader`
- `formative-assessor`
- `quiz-generator`
- `retrieval-practice-builder`

### Learner state & curriculum

- `curriculum-graph-builder`
- `learner-state-reflector`
- `learning-report`
- `prerequisite-analyzer`
- `profile-reader`
- `review-scheduler`

### Orchestration & runtime

- `goal-interpreter`
- `graceful-degradation`
- `incremental-delivery`
- `orchestrator-policy`
- `plan-presenter`

### Quality & utilities

- `artifact-validator`
- `evidence-emitter`
- `product-page-component-rewriter`
- `skill-eval-harness`
- `skill-forge`
- `structured-output`
- `tool-investigator`

## Quick start

### With LingxiGraph

```python
from lingxigraph import FilesystemSkillSource, create_agent

skills = FilesystemSkillSource("/path/to/LingxiSkills/skills")
agent = create_agent(model, skills=skills)
```

### With the Skills CLI

```bash
npx skills add LingXi-Org/LingxiSkills
```

Install a single Skill:

```bash
npx skills add LingXi-Org/LingxiSkills --skill adaptive-pedagogy
```

## Skill structure

```text
skills/<skill-name>/
├── SKILL.md
├── references/     optional context and contracts
├── scripts/        optional deterministic helpers
├── assets/         optional templates and examples
├── agents/         optional agent integration metadata
└── tests/          optional regression tests
```

`SKILL.md` defines the capability contract. Runtime authorization, HITL, timeout, budget, and tool permissions remain the responsibility of the host runtime.

## Validation

```bash
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/adaptive-pedagogy
python skills/skill-eval-harness/scripts/run_suite.py .
```

The repository CI also validates every top-level `skills/*/SKILL.md` on pushes and pull requests.

## Contributing

Keep `SKILL.md` concise and put detailed supporting material in `references/`, deterministic helpers in `scripts/`, reusable output resources in `assets/`, and regression coverage in `tests/` when applicable.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
