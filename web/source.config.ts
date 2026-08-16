/**
 * The registry intentionally has no README/content source. The direct Skill markdown files
 * is discovered by scripts/skill-data.mjs and emitted into generated/ before
 * Next builds the static site.
 */
export const sourceConfig = {
  sourcePattern: 'skills/*/SKILL.md',
  staticExport: true,
} as const;
