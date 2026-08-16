<div align="center">

# LingxiSkills

**Composable Agent Skills for AI learning products.**

Reusable teaching, assessment, visualization, learner-state, and evaluation capabilities for the LingXi stack.

[简体中文](README.zh-CN.md) · [LingxiGraph](https://github.com/LingXi-Org/LingxiGraph) · [LingxiLearn](https://github.com/LingXi-Org/LingxiLearn)

</div>

## About

LingxiSkills is the reusable capability layer of the LingXi stack. Each Skill is an independently discoverable directory centered on a `SKILL.md` contract, with optional references, scripts, and assets.

The repository does not provide a standalone application or runtime. Products such as LingxiLearn consume these capabilities through LingxiGraph or another compatible Agent Skills runtime.

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

## Capabilities

- **Adaptive teaching** — evidence-based tutoring and teaching-strategy selection.
- **Visualization** — interactive explainers and lecture decks.
- **Assessment** — quiz generation, formative assessment, and retrieval practice.
- **Learner state** — cautious learner-state reflection and curriculum graphs.
- **Evaluation** — deterministic Skill contract and trajectory evaluation.

Current Skills include:

```text
adaptive-pedagogy
lesson-intro
interactive-visual-explainer
interactive-lecture-deck
quiz-generator
formative-assessor
retrieval-practice-builder
learner-state-reflector
curriculum-graph-builder
skill-eval-harness
```

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
├── references/     optional context and guidance
├── scripts/        optional deterministic helpers
└── assets/         optional templates and resources
```

`SKILL.md` defines the capability contract. Runtime authorization, HITL, timeout, budget, and tool permissions remain the responsibility of the host runtime.

## Validation

```bash
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/adaptive-pedagogy
python skills/skill-eval-harness/scripts/run_suite.py .
```

## Contributing

Keep `SKILL.md` concise and put detailed supporting material in `references/`, deterministic helpers in `scripts/`, and reusable output resources in `assets/`.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
