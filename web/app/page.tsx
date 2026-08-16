import Link from 'next/link';
import { SkillCard } from '../components/SkillCard';
import { skills } from '../lib/skills';

const categoryCount = new Set(skills.map((skill) => skill.category)).size;
const capabilityCount = new Set(skills.flatMap((skill) => skill.capabilities)).size;
const featured = skills.filter((skill) => skill.criticalPath).slice(0, 6);

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="eyebrow">Capability registry · generated from source</p>
            <h1>Everything is a Skill.</h1>
            <p className="hero-copy">Composable capabilities for intelligent learning systems. Explore the runtime contracts, resources, and intent behind every skill in the repository.</p>
            <div className="hero-actions">
              <Link className="primary-button" href="/skills/">Browse all skills</Link>
              <a className="secondary-button" href="https://github.com/LingXi-Org/LingxiSkills" rel="noreferrer">View source</a>
            </div>
          </div>
          <div className="hero-aside">
            <p className="eyebrow">Live inventory</p>
            <div className="stat-list">
              <div className="stat-row"><span className="stat-value">{skills.length}</span><span className="stat-label">repository skills</span></div>
              <div className="stat-row"><span className="stat-value">{capabilityCount}</span><span className="stat-label">capabilities</span></div>
              <div className="stat-row"><span className="stat-value">{categoryCount}</span><span className="stat-label">categories</span></div>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>No curated allowlist. The registry is rebuilt from <code>skills/*/SKILL.md</code> at build time.</p>
          </div>
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <div><p className="eyebrow">Selected entry points</p><h2>Start with the critical path.</h2></div>
          <Link className="text-link" href="/skills/">See all {skills.length} skills →</Link>
        </div>
        {featured.length ? <div className="skill-grid">{featured.map((skill) => <SkillCard key={skill.slug} skill={skill} />)}</div> : <p className="muted">No skills are marked critical path yet. Browse the live registry for the full collection.</p>}
      </section>
      <section className="shell section">
        <div className="section-heading"><div><p className="eyebrow">Built for builders</p><h2>One source, two audiences.</h2></div></div>
        <div className="hero-grid" style={{ alignItems: 'start', gap: 36 }}>
          <p className="hero-copy" style={{ fontSize: 18 }}>Agents read the operational contract in <code>SKILL.md</code>. People read the same source as navigable product documentation. Every detail page, search result, registry record, and sitemap entry is generated together.</p>
          <div className="stat-list"><div className="stat-row"><span className="stat-label">Source of truth</span><span className="meta-value">filesystem</span></div><div className="stat-row"><span className="stat-label">Export mode</span><span className="meta-value">static</span></div><div className="stat-row"><span className="stat-label">Coverage gate</span><span className="meta-value">set equality</span></div></div>
        </div>
      </section>
    </>
  );
}

