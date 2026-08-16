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

## Human-readable Skill site

LingxiSkills is planned to expose the repository as a human-readable **Capability Registry** rather than a traditional documentation site.

The product site should follow an enterprise SaaS visual language: monochrome, restrained, typography-first, low-decoration, no gradients, minimal shadow, and clear information hierarchy.

### Product model

```text
skills/*/SKILL.md
        │
        ▼
Build-time Skill scanner
        │
        ├── metadata normalization
        ├── resource discovery
        ├── taxonomy
        └── search index
        │
        ▼
Static SaaS catalog
        │
        ├── /
        ├── /skills
        ├── /skills/[slug]
        └── /about
```

The site must not introduce a second catalog database or duplicate Skill descriptions. New or updated Skills should appear automatically after a successful build.

### Catalog normalization

Current Skills have different metadata depths, so the site layer must normalize both rich and minimal frontmatter.

At minimum it should derive:

```text
slug
name
display name
description
version
phase
capabilities
ownership
learner-facing mode
parallel-safe
latency class
provider
output contract
resources
```

Fallback rules should keep minimal Skills readable: `display-name` falls back to the Markdown heading or technical name, `display-description` falls back to `description`, and optional runtime fields are simply omitted when absent.

### Pages

**Home**

- `Everything is a Skill.` hero
- Skill search
- automatically calculated Skill and Capability counts
- featured capability groups
- LingXi stack relationship
- install command

**Skill Registry**

- full Skill grid
- local client-side search
- category and phase filters
- learner-facing / artifact / shared filters
- no hard-coded Skill count

**Skill Detail**

- human-readable title and description
- technical slug and version
- capabilities and runtime metadata
- rendered `SKILL.md` body without raw YAML frontmatter
- references, scripts, assets, agents, and tests as resources
- install command and GitHub source link

### Suggested taxonomy

1. Teaching & Dialogue
2. Content & Visualization
3. Assessment & Practice
4. Learner State & Curriculum
5. Orchestration & Runtime
6. Quality & Utilities

Classification should be deterministic and based on existing Skill metadata such as `capabilities`, `phase`, and `ownership`. If an explicit category becomes necessary, it should be added to the corresponding `SKILL.md`, not a separate catalog file.

### Frontend baseline

Keep the site aligned with the existing LingXi frontend stack and the LingxiGraph documentation deployment model:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Node.js 22
- static export with `output: 'export'`
- build-time Skill ingestion
- client-side search only

The site may reuse Fumadocs content utilities, but should use a custom LingXi product shell instead of a default documentation theme.

### Cloudflare Pages deployment

Deployment should mirror the existing LingxiGraph documentation pipeline:

```text
Skill validation
      ↓
Catalog validation
      ↓
Next.js static build
      ↓
web/out artifact
      ↓
Cloudflare Pages
```

Expected behavior:

- pull requests: validate and build only;
- pushes to `main`: validate, build, then deploy;
- manual `workflow_dispatch`: allow an explicit redeploy;
- failed Skill validation must block production deployment;
- Cloudflare authentication should reuse the organization convention of `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
- recommended Pages project name: `lingxiskills`;
- recommended public domain: `skills.lingxilearn.cn`.

The current Python Skill validator remains a release gate. A successful website build alone is not enough to publish an invalid Skill.

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
