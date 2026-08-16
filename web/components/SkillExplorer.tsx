'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import { useDocsSearch } from 'fumadocs-core/search/client';
import type { SkillEntry } from '../lib/skills';
import { SkillCard } from './SkillCard';

type Filters = {
  query: string;
  category: string;
  phase: string;
  capability: string;
  learnerFacing: boolean;
  criticalPath: boolean;
  parallelSafe: boolean;
};

const initialFilters: Filters = {
  query: '', category: '', phase: '', capability: '', learnerFacing: false, criticalPath: false, parallelSafe: false,
};

export function SkillExplorer({ skills, categories, phases }: { skills: SkillEntry[]; categories: string[]; phases: string[] }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const searchClient = useMemo(() => oramaStaticClient({ from: '/api/search' }), []);
  const indexedSearch = useDocsSearch({ client: searchClient, delayMs: 120 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters({
      query: params.get('q') ?? '',
      category: params.get('category') ?? '',
      phase: params.get('phase') ?? '',
      capability: params.get('capability') ?? '',
      learnerFacing: params.get('learnerFacing') === 'true',
      criticalPath: params.get('criticalPath') === 'true',
      parallelSafe: params.get('parallelSafe') === 'true',
    });
    indexedSearch.setSearch(params.get('q') ?? '');
  }, [indexedSearch.setSearch]);

  useEffect(() => {
    if (indexedSearch.search !== filters.query) indexedSearch.setSearch(filters.query);
  }, [filters.query, indexedSearch.search, indexedSearch.setSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.phase) params.set('phase', filters.phase);
    if (filters.capability) params.set('capability', filters.capability);
    if (filters.learnerFacing) params.set('learnerFacing', 'true');
    if (filters.criticalPath) params.set('criticalPath', 'true');
    if (filters.parallelSafe) params.set('parallelSafe', 'true');
    const query = params.toString();
    window.history.replaceState(null, '', query ? `/skills/?${query}` : '/skills/');
  }, [filters]);

  const filtered = useMemo(() => {
    const capability = filters.capability.trim().toLowerCase();
    const query = filters.query.trim();
    const indexedUrls = query && indexedSearch.search === query
      ? indexedSearch.query.isLoading
        ? null
        : indexedSearch.query.data === 'empty'
          ? new Set<string>()
          : new Set(indexedSearch.query.data?.map((item) => item.url) ?? [])
      : null;
    return skills.filter((skill) => {
      const skillUrl = `/skills/${skill.slug}/`;
      return (!query || indexedUrls === null || indexedUrls.has(skillUrl))
        && (!filters.category || skill.category === filters.category)
        && (!filters.phase || skill.phase === filters.phase)
        && (!capability || skill.capabilities.some((item) => item.toLowerCase().includes(capability)))
        && (!filters.learnerFacing || skill.learnerFacing === true)
        && (!filters.criticalPath || skill.criticalPath === true)
        && (!filters.parallelSafe || skill.parallelSafe === true);
    });
  }, [filters, indexedSearch.query.data, indexedSearch.query.isLoading, indexedSearch.search, skills]);

  const patch = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="explorer-layout">
      <aside className="filter-panel" aria-label="Filter skills">
        <label className="field-label" htmlFor="skill-search">Search</label>
        <input id="skill-search" className="text-input" value={filters.query} onChange={(event) => patch('query', event.target.value)} placeholder="Search name, description, capability…" />
        <label className="field-label" htmlFor="category-filter">Category</label>
        <select id="category-filter" className="select-input" value={filters.category} onChange={(event) => patch('category', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <label className="field-label" htmlFor="phase-filter">Phase</label>
        <select id="phase-filter" className="select-input" value={filters.phase} onChange={(event) => patch('phase', event.target.value)}>
          <option value="">All phases</option>
          {phases.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
        </select>
        <label className="field-label" htmlFor="capability-filter">Capability</label>
        <input id="capability-filter" className="text-input" value={filters.capability} onChange={(event) => patch('capability', event.target.value)} placeholder="e.g. retrieval" />
        <div className="filter-checks">
          {([
            ['learnerFacing', 'Learner-facing'],
            ['criticalPath', 'Critical path'],
            ['parallelSafe', 'Parallel-safe'],
          ] as const).map(([key, label]) => (
            <label key={key} className="check-label"><input type="checkbox" checked={filters[key]} onChange={(event) => patch(key, event.target.checked)} /> {label}</label>
          ))}
        </div>
        <button type="button" className="quiet-button" onClick={() => setFilters(initialFilters)}>Clear filters</button>
      </aside>
      <div className="results-panel">
        <div className="results-header">
          <p className="eyebrow">Live registry</p>
          <p className="result-count"><strong>{filtered.length}</strong> of {skills.length} skills</p>
        </div>
        {filtered.length ? (
          <div className="skill-grid">{filtered.map((skill) => <SkillCard key={skill.slug} skill={skill} />)}</div>
        ) : (
          <div className="empty-state">
            <h2>No skills match these filters.</h2>
            <p className="muted">Try a broader search or clear the filters.</p>
            <button type="button" className="secondary-button" onClick={() => setFilters(initialFilters)}>Reset search</button>
          </div>
        )}
        <p className="registry-note">Every result is discovered from a direct <code>skills/*/SKILL.md</code> scan. <Link href="/">Read the approach →</Link></p>
      </div>
    </div>
  );
}
