# Contributing Skills

1. Create one lowercase, hyphenated Skill directory under `skills/`.
2. Add a standard `SKILL.md` with only the supported frontmatter fields.
3. Keep the body concise and imperative. Link directly to any conditional
   details in `references/`.
4. Put deterministic helpers in `scripts/` and output templates or other
   non-context files in `assets/`.
5. Never rely on automatic script execution. Scripts must remain readable
   content and require an independently authorized execution tool.
6. Run `python -m skills_ref.cli validate skills/<name>` and validate every
   Skill before submitting a change.

LingxiGraph's runtime also enforces resource size limits, regular-file checks,
symlink/reparse-point boundaries, and existing ToolSpec permissions. A Skill's
`allowed-tools` field cannot override those controls.
