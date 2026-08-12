# LingxiSkills

Open Agent Skills for LingxiGraph and other Agent Skills-compatible runtimes.

Each directory under `skills/` is an independent standard Skill. A Skill must
contain `SKILL.md` with YAML frontmatter and may include `scripts/`,
`references/`, and `assets/`. The repository does not define a LingxiGraph-only
Skill format.

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

- `hello`: concise greetings in the language and tone requested by the user.
  It demonstrates frontmatter, a reference document, an asset template, and a
  non-executed example script.
- `visual-explainer`: creates a self-contained, offline interactive HTML page
  for concepts that benefit from diagrams and controlled exploration.
- `lecture-hook`: researches and drafts a concise, evidence-grounded opening
  that bridges a lesson hook to its target concept.
- `lecture-deck`: builds fixed-size, self-contained HTML lecture decks with
  structured zoom data, anchored explanations, a local runtime, and strict
  visual/structure validation.

## Validate locally

The runtime dependency remains zero-dependency. Install the optional
development validator and validate every Skill:

```bash
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows: .venv\\Scripts\\activate
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/hello
python -m skills_ref.cli validate skills/visual-explainer
python -m skills_ref.cli validate skills/lecture-hook
python -m skills_ref.cli validate skills/lecture-deck
```

`skills-ref==0.1.1` is a development/CI validation dependency only.

## Contributing

Keep `SKILL.md` concise and imperative. Put detailed, conditional material in
directly linked `references/` files, deterministic helpers in `scripts/`, and
output templates or other non-context assets in `assets/`. Do not add private
frontmatter fields or automatic script execution behavior.

See [CONTRIBUTING.md](CONTRIBUTING.md) for validation expectations.
