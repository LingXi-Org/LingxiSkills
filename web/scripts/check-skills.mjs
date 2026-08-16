import fs from 'node:fs';
import path from 'node:path';
import { webDirectory, discoverSkills } from './skill-data.mjs';

function readJson(name) {
  const filePath = path.join(webDirectory, 'generated', name);
  if (!fs.existsSync(filePath)) throw new Error(`Missing generated artifact: ${filePath}. Run npm run generate first.`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sortedUnique(values, label) {
  const list = values.map(String);
  const duplicates = list.filter((value, index) => list.indexOf(value) !== index);
  if (duplicates.length) throw new Error(`${label} contains duplicate slugs: ${[...new Set(duplicates)].join(', ')}`);
  return [...new Set(list)].sort();
}

function assertSetEqual(expected, actual, label) {
  const missing = expected.filter((slug) => !actual.includes(slug));
  const extra = actual.filter((slug) => !expected.includes(slug));
  if (missing.length || extra.length) {
    const details = [missing.length ? `missing: ${missing.join(', ')}` : '', extra.length ? `extra: ${extra.join(', ')}` : '']
      .filter(Boolean)
      .join('; ');
    throw new Error(`${label} set mismatch (${details})`);
  }
}

const repositorySkills = discoverSkills();
const expected = sortedUnique(repositorySkills.map((entry) => entry.slug), 'repository skills');
const catalog = readJson('skills.json');
const catalogAlias = readJson('catalog.json');
const registry = readJson('registry.json');
const searchIndex = readJson('search-index.json');
const searchDatabase = readJson('search-db.json');
const routes = readJson('routes.json');
const manifest = readJson('manifest.json');

const generatedCatalogSlugs = sortedUnique(catalog.map((entry) => entry.slug), 'generated catalog');
assertSetEqual(generatedCatalogSlugs, sortedUnique(catalogAlias.map((entry) => entry.slug), 'catalog alias'), 'skills.json ↔ catalog.json');
const registrySlugs = sortedUnique(registry.map((entry) => entry.slug), 'registry');
const searchIndexSlugs = sortedUnique(searchIndex.map((entry) => entry.slug), 'search index');
const searchDatabaseSlugs = sortedUnique(
  Object.values(searchDatabase.docs?.docs ?? {}).map((entry) => entry.id),
  'search database',
);
const staticPageSlugs = sortedUnique(routes.map((route) => String(route).replace(/^\/skills\//, '').replace(/\/$/, '')), 'static routes');

assertSetEqual(expected, generatedCatalogSlugs, 'repository ↔ generated catalog');
assertSetEqual(expected, registrySlugs, 'repository ↔ registry');
assertSetEqual(expected, searchIndexSlugs, 'repository ↔ search index');
assertSetEqual(expected, searchDatabaseSlugs, 'repository ↔ search database');
assertSetEqual(expected, staticPageSlugs, 'repository ↔ static routes');

for (const entry of catalog) {
  if (!entry.displayName || !entry.displayDescription || !entry.category || !Array.isArray(entry.capabilities)) {
    throw new Error(`Catalog entry ${entry.slug} is missing required fallback metadata`);
  }
  if (!entry.resources || typeof entry.resources !== 'object') throw new Error(`Catalog entry ${entry.slug} has no resources map`);
}

for (const key of ['repositorySkillSlugs', 'generatedCatalogSlugs', 'registrySlugs', 'searchIndexSlugs', 'staticPageSlugs']) {
  const value = manifest?.[key];
  if (!Array.isArray(value)) throw new Error(`manifest.${key} must be an array`);
  assertSetEqual(expected, sortedUnique(value, `manifest.${key}`), `manifest.${key}`);
}

if (catalog.length !== repositorySkills.length || registry.length !== repositorySkills.length || searchIndex.length !== repositorySkills.length || searchDatabaseSlugs.length !== repositorySkills.length) {
  throw new Error(`Count mismatch: repository=${repositorySkills.length}, catalog=${catalog.length}, registry=${registry.length}, search=${searchIndex.length}, searchDatabase=${searchDatabaseSlugs.length}`);
}

console.log(`Skill coverage check passed: ${expected.length}/${expected.length} repository skills in catalog, registry, search, and static routes.`);
