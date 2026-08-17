<div align="center">

# LingxiSkills

**Composable Agent Skills for AI learning products.**

Reusable teaching, visualization, assessment, learner-state, orchestration, and evaluation capabilities for the LingXi stack.

[简体中文](README.md) · [LingxiGraph](https://github.com/LingXi-Org/LingxiGraph) · [LingxiLearn](https://github.com/LingXi-Org/LingxiLearn)

</div>

## About

LingxiSkills is the reusable capability layer of the LingXi stack. Each Skill is an independently discoverable directory centered on a `SKILL.md` contract, with optional `references/`, `scripts/`, and `assets/` resources.

Products such as LingxiLearn consume these capabilities through LingxiGraph or another compatible Agent Skills runtime.

```text
Learning Product / Agent
      │
      ▼
LingxiGraph Runtime
      │
      ▼
LingxiSkills
SKILL.md · references · scripts · assets
```

## Quick start

```python
from lingxigraph import FilesystemSkillSource, create_agent

skills = FilesystemSkillSource("/path/to/LingxiSkills/skills")
agent = create_agent(model, skills=skills)
```

Or install through the open Skills CLI:

```bash
npx skills add LingXi-Org/LingxiSkills
npx skills add LingXi-Org/LingxiSkills --skill adaptive-pedagogy
```

## LingxiGraph compatibility contract

LingxiGraph reads the open Agent Skills directory format directly. A contributed Skill should use `skills/<skill-name>/SKILL.md`, include YAML frontmatter, and define required `name` and `description` fields. Optional standard fields are `license`, `compatibility`, `metadata`, and `allowed-tools`.

Runtime-readable resources belong under `references/`, `scripts/`, and `assets/`. LingxiGraph rejects path traversal, absolute paths, symlinks/reparse points, special files, and resource boundary escapes. `SKILL.md` is limited to 256 KiB and each resource to 1 MiB. `allowed-tools` is descriptive metadata only and cannot grant runtime permissions or bypass authorization, HITL, timeouts, or budgets.

Use [`templates/SKILL.md`](templates/SKILL.md) when creating a new Skill.

## Validation

```bash
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/<skill-name>
```

For newly added Skills, the `LingxiGraph Skill Review` GitHub Action also installs the current LingxiGraph `main` branch and directly runs LingxiGraph's own `validate_skill()` and `FilesystemSkillSource` checks.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and PR checklist.

## License

See [LICENSE](LICENSE).
