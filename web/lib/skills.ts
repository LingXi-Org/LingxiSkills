import rawSkills from '../generated/skills.json';
import rawRegistry from '../generated/registry.json';
import rawSearchIndex from '../generated/search-index.json';

export type ResourceEntry = {
  name: string;
  path: string;
  kind: string;
  sourceUrl: string;
};

export type SkillEntry = {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  displayDescription: string;
  version?: string;
  category: string;
  phase?: string;
  capabilities: string[];
  executionMode?: string;
  criticalPath?: boolean;
  learnerFacing?: boolean;
  parallelSafe?: boolean;
  latencyClass?: string;
  provider?: string;
  outputContract?: string;
  outputLanguage?: string;
  ownership?: string;
  statusLine?: string;
  metadata: Record<string, unknown>;
  resources: Record<string, ResourceEntry[]>;
  headings: string[];
  markdown: string;
  body: string;
  sourcePath: string;
  sourceUrl: string;
};

export type RegistryEntry = Pick<
  SkillEntry,
  | 'slug'
  | 'name'
  | 'displayName'
  | 'displayDescription'
  | 'description'
  | 'category'
  | 'phase'
  | 'capabilities'
  | 'version'
  | 'criticalPath'
  | 'learnerFacing'
  | 'parallelSafe'
  | 'sourcePath'
  | 'sourceUrl'
>;

export const skills = rawSkills as SkillEntry[];
export const registry = rawRegistry as RegistryEntry[];
export const searchIndex = rawSearchIndex as Array<{
  slug: string;
  name: string;
  displayName: string;
  description: string;
  displayDescription: string;
  category: string;
  capabilities: string[];
  phase?: string;
  headings: string[];
  markdown: string;
}>;

export function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug);
}

export function formatPhase(phase?: string) {
  return phase ? phase.replaceAll('-', ' ') : 'unclassified';
}

