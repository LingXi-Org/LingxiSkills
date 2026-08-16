<div align="center">

# LingxiSkills

**Composable Agent Skills for AI learning products.**

Reusable teaching, assessment, visualization, learner-state, runtime, and evaluation capabilities for the LingXi stack.

[简体中文](README.zh-CN.md) · [LingxiGraph](https://github.com/LingXi-Org/LingxiGraph) · [LingxiLearn](https://github.com/LingXi-Org/LingxiLearn)

</div>

## About

LingxiSkills is the reusable capability layer of the LingXi stack. Each Skill is an independently discoverable directory centered on a `SKILL.md` contract, with optional references, scripts, assets, agents, and tests.

The repository does not provide a standalone runtime. Products such as LingxiLearn consume these capabilities through LingxiGraph or another compatible Agent Skills runtime.

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

LingxiSkills covers several capability families:

- **Teaching & dialogue** — adaptive tutoring, explanation, probing, interviewing, and learning companionship.
- **Content & visualization** — lesson introductions, lecture decks, and interactive visual explainers.
- **Assessment & practice** — quiz generation, formative assessment, grading, and retrieval practice.
- **Learner state & curriculum** — reflection, prerequisite analysis, review scheduling, and curriculum graphs.
- **Orchestration & runtime** — goal interpretation, planning support, orchestration policy, negotiation, and graceful degradation.
- **Quality & utilities** — artifact validation, evidence emission, structured output, evaluation, and Skill authoring support.

The repository is the source of truth. Skills are discovered directly from `skills/*/SKILL.md`; do not maintain a second hand-written catalog.

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

`SKILL.md` defines the capability contract and remains the single source of truth for both runtime discovery and human-facing documentation. Runtime authorization, HITL, timeout, budget, and tool permissions remain the responsibility of the host runtime.

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
