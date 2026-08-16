import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const webDirectory = path.resolve(scriptsDirectory, '..');
export const repositoryRoot = path.resolve(webDirectory, '..');
export const skillsDirectory = path.join(repositoryRoot, 'skills');

const RESOURCE_KINDS = ['references', 'scripts', 'assets', 'agents', 'tests'];
export const SKILL_CATEGORIES = [
  'Teaching & Dialogue',
  'Content & Visualization',
  'Assessment & Practice',
  'Learner State & Curriculum',
  'Orchestration & Runtime',
  'Quality & Utilities',
];

function unquote(value) {
  const trimmed = String(value ?? '').trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\([\\"'])/g, '$1');
  }
  return trimmed;
}

function parseScalar(value) {
  const normalized = unquote(value);
  if (normalized === '') return '';
  if (/^(true|false)$/i.test(normalized)) return normalized.toLowerCase() === 'true';
  if (/^[-+]?\d+(?:\.\d+)?$/.test(normalized)) return Number(normalized);
  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    return normalized
      .slice(1, -1)
      .split(',')
      .map((part) => unquote(part))
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return normalized;
}

/**
 * Parse the intentionally small YAML front matter dialect used by Agent Skills.
 * Keeping this parser local means the site can discover every SKILL.md without
 * making README or a second catalog a runtime dependency.
 */
export function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return { attributes: {}, body: markdown };
  const lines = markdown.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { attributes: {}, body: markdown };
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end < 0) return { attributes: {}, body: markdown };

  const attributes = {};
  let section = null;
  for (let index = 1; index < end; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    const match = line.match(/^\s*([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!match) continue;
    const key = match[1];
    let rawValue = match[2] ?? '';

    if (indent === 0) {
      section = null;
      if (rawValue === '' || rawValue === '>' || rawValue === '|\n' || /^>[+-]$/.test(rawValue) || /^\|[+-]$/.test(rawValue)) {
        if (rawValue === '' && index + 1 < end && /^\s+/.test(lines[index + 1])) {
          section = key;
          attributes[key] = {};
        } else {
          const continuation = [];
          while (index + 1 < end && (/^\s+/.test(lines[index + 1]) || lines[index + 1].trim() === '')) {
            index += 1;
            continuation.push(lines[index].replace(/^\s{2}/, '').trimEnd());
          }
          attributes[key] = continuation.join(rawValue.startsWith('|') ? '\n' : ' ').trim();
        }
      } else {
        attributes[key] = parseScalar(rawValue);
      }
      continue;
    }

    if (section && typeof attributes[section] === 'object' && !Array.isArray(attributes[section])) {
      if (rawValue === '' && index + 1 < end && /^\s+-\s+/.test(lines[index + 1])) {
        const list = [];
        while (index + 1 < end && /^\s+-\s+/.test(lines[index + 1])) {
          index += 1;
          list.push(parseScalar(lines[index].replace(/^\s+-\s+/, '')));
        }
        attributes[section][key] = list;
      } else {
        attributes[section][key] = parseScalar(rawValue);
      }
    }
  }

  return { attributes, body: lines.slice(end + 1).join('\n').replace(/^\n+/, '') };
}

function firstHeading(markdown) {
  return markdown.match(/^\s*#\s+(.+?)\s*$/m)?.[1]?.trim() ?? '';
}

function firstParagraph(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('```'))[0] ?? '';
}

function normalizeName(value, fallback) {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function asString(value) {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string' && /^(true|false)$/i.test(value.trim())) return value.trim().toLowerCase() === 'true';
  return undefined;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,;|]/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function titleCaseSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const CAPABILITY_CATEGORY_PREFIXES = new Map([
  ['dialog', 'Teaching & Dialogue'],
  ['teach', 'Teaching & Dialogue'],
  ['content', 'Content & Visualization'],
  ['visual', 'Content & Visualization'],
  ['assess', 'Assessment & Practice'],
  ['practice', 'Assessment & Practice'],
  ['grade', 'Assessment & Practice'],
  ['graph', 'Learner State & Curriculum'],
  ['model', 'Learner State & Curriculum'],
  ['profile', 'Learner State & Curriculum'],
  ['review', 'Learner State & Curriculum'],
  ['curriculum', 'Learner State & Curriculum'],
  ['goal', 'Orchestration & Runtime'],
  ['orchestrator', 'Orchestration & Runtime'],
  ['plan', 'Orchestration & Runtime'],
  ['runtime', 'Orchestration & Runtime'],
  ['meta.report', 'Learner State & Curriculum'],
  ['meta.evaluate', 'Quality & Utilities'],
  ['meta.author_skill', 'Quality & Utilities'],
]);

const PHASE_CATEGORIES = new Map([
  ['teach', 'Teaching & Dialogue'],
  ['teaching', 'Teaching & Dialogue'],
  ['prepare', 'Content & Visualization'],
  ['authoring', 'Content & Visualization'],
  ['assess', 'Assessment & Practice'],
  ['practice', 'Assessment & Practice'],
  ['learner-model', 'Learner State & Curriculum'],
  ['report', 'Learner State & Curriculum'],
  ['runtime', 'Orchestration & Runtime'],
]);

function categoryFromCapabilities(capabilities) {
  for (const capability of capabilities) {
    const normalized = capability.toLowerCase();
    const prefix = normalized.split('.')[0];
    const category = CAPABILITY_CATEGORY_PREFIXES.get(normalized) ?? CAPABILITY_CATEGORY_PREFIXES.get(prefix);
    if (category) return category;
  }
  return undefined;
}

/**
 * Resolve a category without making optional frontmatter a discovery gate.
 * Explicit taxonomy wins, then the stable capability prefix, then lifecycle
 * phase/ownership hints, and finally the safe utility bucket from Issue #2.
 */
function categoryFor(metadata, capabilities, phase, ownership) {
  const explicit = asString(metadata.category);
  if (explicit && SKILL_CATEGORIES.includes(explicit)) return explicit;

  const byCapability = categoryFromCapabilities(capabilities);
  if (byCapability) return byCapability;

  const byPhase = phase ? PHASE_CATEGORIES.get(phase.toLowerCase()) : undefined;
  if (byPhase) return byPhase;

  // Shared/runtime components with no recognized capability are operational
  // utilities by default; dedicated unknowns still fall through safely.
  if (ownership?.toLowerCase() === 'shared' && phase?.toLowerCase() === 'runtime') return 'Orchestration & Runtime';
  return 'Quality & Utilities';
}

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  const visit = (current) => {
    for (const item of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(current, item.name);
      if (item.isDirectory()) visit(absolute);
      else if (item.isFile()) result.push(absolute);
    }
  };
  visit(directory);
  return result;
}

function resourcesFor(skillDirectory, slug) {
  return Object.fromEntries(
    RESOURCE_KINDS.map((kind) => [
      kind,
      listFiles(path.join(skillDirectory, kind)).map((absolute) => {
        const relative = path.relative(path.join(skillDirectory, kind), absolute).replaceAll(path.sep, '/');
        return {
          name: relative,
          path: `skills/${slug}/${kind}/${relative}`,
          kind,
          sourceUrl: `https://github.com/LingXi-Org/LingxiSkills/blob/main/skills/${slug}/${kind}/${relative}`,
        };
      }),
    ]),
  );
}

function headingsFor(markdown) {
  return [...markdown.matchAll(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)].map((match) => match[1].trim());
}

function metadataFor(attributes) {
  const metadata = attributes.metadata && typeof attributes.metadata === 'object' ? attributes.metadata : {};
  return { ...metadata, ...Object.fromEntries(Object.entries(attributes).filter(([key]) => key !== 'metadata')) };
}

export function discoverSkills() {
  if (!fs.existsSync(skillsDirectory)) throw new Error(`Skills directory not found: ${skillsDirectory}`);
  const directories = fs
    .readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  const entries = [];

  for (const directory of directories) {
    const slug = directory.name;
    const skillDirectory = path.join(skillsDirectory, slug);
    const skillPath = path.join(skillDirectory, 'SKILL.md');
    if (!fs.existsSync(skillPath) || !fs.statSync(skillPath).isFile()) continue;
    const markdown = fs.readFileSync(skillPath, 'utf8');
    const { attributes, body } = parseFrontmatter(markdown);
    const metadata = metadataFor(attributes);
    const heading = firstHeading(body) || firstHeading(markdown);
    const name = normalizeName(attributes.name, slug);
    const displayName = normalizeName(metadata['display-name'] ?? metadata.displayName, heading || name || titleCaseSlug(slug));
    const description = normalizeName(attributes.description, firstParagraph(body) || `Composable capability: ${titleCaseSlug(slug)}.`);
    const displayDescription = normalizeName(metadata['display-description'] ?? metadata.displayDescription, description);
    const capabilities = asList(metadata.capabilities ?? metadata.capability);
    const normalizedCapabilities = capabilities.length ? capabilities : [slug];
    const phase = asString(metadata.phase);
    const ownership = asString(metadata.ownership);

    entries.push({
      slug,
      name,
      displayName,
      description,
      displayDescription,
      version: asString(metadata.version),
      category: categoryFor(metadata, normalizedCapabilities, phase, ownership),
      phase,
      capabilities: normalizedCapabilities,
      executionMode: asString(metadata['execution-mode'] ?? metadata.executionMode),
      criticalPath: asBoolean(metadata['critical-path'] ?? metadata.criticalPath),
      learnerFacing: asBoolean(metadata['learner-facing'] ?? metadata.learnerFacing),
      parallelSafe: asBoolean(metadata['parallel-safe'] ?? metadata.parallelSafe),
      latencyClass: asString(metadata['latency-class'] ?? metadata.latencyClass),
      provider: asString(metadata.provider),
      outputContract: asString(metadata['output-contract'] ?? metadata.outputContract),
      outputLanguage: asString(metadata['output-language'] ?? metadata.outputLanguage),
      ownership,
      statusLine: asString(metadata['status-line'] ?? metadata.statusLine),
      metadata,
      resources: resourcesFor(skillDirectory, slug),
      headings: headingsFor(body),
      markdown,
      body,
      sourcePath: `skills/${slug}/SKILL.md`,
      sourceUrl: `https://github.com/LingXi-Org/LingxiSkills/blob/main/skills/${slug}/SKILL.md`,
    });
  }

  if (!entries.length) throw new Error('No skills/*/SKILL.md files were discovered');
  return entries;
}
