import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverSkills, webDirectory } from './skill-data.mjs';

export function buildArtifacts(entries = discoverSkills()) {
  const slugs = entries.map((entry) => entry.slug).sort();
  const searchIndex = entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    displayName: entry.displayName,
    description: entry.description,
    displayDescription: entry.displayDescription,
    category: entry.category,
    capabilities: entry.capabilities,
    phase: entry.phase,
    headings: entry.headings,
    markdown: entry.markdown,
  }));
  const registry = entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    displayName: entry.displayName,
    displayDescription: entry.displayDescription,
    description: entry.description,
    category: entry.category,
    phase: entry.phase,
    capabilities: entry.capabilities,
    version: entry.version,
    criticalPath: entry.criticalPath,
    learnerFacing: entry.learnerFacing,
    parallelSafe: entry.parallelSafe,
    sourcePath: entry.sourcePath,
    sourceUrl: entry.sourceUrl,
  }));
  return {
    skills: entries,
    registry,
    searchIndex,
    routes: slugs.map((slug) => `/skills/${slug}/`),
    manifest: {
      repositorySkillSlugs: slugs,
      generatedCatalogSlugs: slugs,
      registrySlugs: registry.map((entry) => entry.slug).sort(),
      searchIndexSlugs: searchIndex.map((entry) => entry.slug).sort(),
      staticPageSlugs: slugs,
    },
  };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildSitemap(entries) {
  const siteUrl = 'https://skills.lingxilearn.cn';
  const urls = [siteUrl, `${siteUrl}/skills/`, ...entries.map((entry) => `${siteUrl}/skills/${entry.slug}/`)].map(
    (url) => `  <url><loc>${url}</loc></url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function buildLlms(entries) {
  const lines = [
    '# LingxiSkills',
    '',
    '> A static capability registry generated directly from skills/*/SKILL.md.',
    '',
    '## Skills',
    '',
  ];
  for (const entry of entries) {
    lines.push(`- [${entry.displayName}](https://skills.lingxilearn.cn/skills/${entry.slug}/): ${entry.displayDescription}`);
  }
  return `${lines.join('\n')}\n`;
}

export function writeArtifacts(artifacts = buildArtifacts()) {
  const generatedDirectory = path.join(webDirectory, 'generated');
  const publicDirectory = path.join(webDirectory, 'public');
  fs.mkdirSync(generatedDirectory, { recursive: true });
  fs.mkdirSync(publicDirectory, { recursive: true });
  writeJson(path.join(generatedDirectory, 'skills.json'), artifacts.skills);
  writeJson(path.join(generatedDirectory, 'catalog.json'), artifacts.skills);
  writeJson(path.join(generatedDirectory, 'registry.json'), artifacts.registry);
  writeJson(path.join(generatedDirectory, 'search-index.json'), artifacts.searchIndex);
  writeJson(path.join(generatedDirectory, 'routes.json'), artifacts.routes);
  writeJson(path.join(generatedDirectory, 'manifest.json'), artifacts.manifest);
  fs.writeFileSync(path.join(generatedDirectory, 'sitemap.xml'), buildSitemap(artifacts.skills), 'utf8');
  fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), buildSitemap(artifacts.skills), 'utf8');
  fs.writeFileSync(path.join(publicDirectory, 'llms.txt'), buildLlms(artifacts.skills), 'utf8');
  return artifacts;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const artifacts = writeArtifacts();
  console.log(`Generated ${artifacts.skills.length} skill entries, ${artifacts.routes.length} static routes, and ${artifacts.searchIndex.length} search records.`);
}
