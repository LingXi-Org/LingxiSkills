import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '../../../lib/markdown';
import { formatPhase, getSkill, skills } from '../../../lib/skills';

export const dynamicParams = false;

export function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return {};
  return {
    title: skill.displayName,
    description: skill.displayDescription,
    alternates: { canonical: `/skills/${skill.slug}/` },
    openGraph: { title: skill.displayName, description: skill.displayDescription, type: 'article' },
  };
}

function SpecRow({ label, value }: { label: string; value?: string | number | boolean }) {
  if (value === undefined || value === null || value === '') return null;
  return <div className="spec-row"><span className="spec-label">{label}</span><span className="spec-value">{String(value)}</span></div>;
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();
  const index = skills.findIndex((item) => item.slug === skill.slug);
  const previous = index > 0 ? skills[index - 1] : undefined;
  const next = index < skills.length - 1 ? skills[index + 1] : undefined;
  const markdownHtml = renderMarkdown(skill.body);
  const resourceSections = Object.entries(skill.resources).filter(([, resources]) => resources.length);

  return (
    <div className="detail-shell">
      <header className="detail-header">
        <Link className="back-link" href="/skills/">← Back to registry</Link>
        <p className="eyebrow" style={{ marginTop: 30 }}>{skill.category}</p>
        <h1>{skill.displayName}</h1>
        <p className="detail-slug">{skill.slug}</p>
        <p className="detail-description">{skill.displayDescription}</p>
      </header>
      <div className="detail-layout">
        <article className="detail-content">
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: markdownHtml }} />
          {resourceSections.map(([kind, resources]) => (
            <section className="resource-section" key={kind}>
              <p className="eyebrow">Repository resources</p>
              <h2>{kind[0].toUpperCase() + kind.slice(1)}</h2>
              <ul className="resource-list">
                {resources.map((resource) => <li key={resource.path}><a href={resource.sourceUrl} rel="noreferrer">{resource.name || resource.path}</a></li>)}
              </ul>
            </section>
          ))}
          <nav className="detail-nav" aria-label="Skill navigation">
            {previous ? <Link href={`/skills/${previous.slug}/`}><small>Previous skill</small>{previous.displayName}</Link> : <span />}
            {next ? <Link href={`/skills/${next.slug}/`}><small>Next skill</small>{next.displayName}</Link> : <span />}
          </nav>
        </article>
        <aside className="spec-panel">
          <h2>Runtime spec</h2>
          <SpecRow label="Slug" value={skill.slug} />
          <SpecRow label="Version" value={skill.version} />
          <SpecRow label="Category" value={skill.category} />
          <SpecRow label="Phase" value={skill.phase ? formatPhase(skill.phase) : undefined} />
          <SpecRow label="Execution mode" value={skill.executionMode} />
          <SpecRow label="Output contract" value={skill.outputContract} />
          <SpecRow label="Output language" value={skill.outputLanguage} />
          <SpecRow label="Latency class" value={skill.latencyClass} />
          <SpecRow label="Critical path" value={skill.criticalPath} />
          <SpecRow label="Learner-facing" value={skill.learnerFacing} />
          <SpecRow label="Parallel-safe" value={skill.parallelSafe} />
          <SpecRow label="Capabilities" value={skill.capabilities.join(', ')} />
          <div className="spec-row"><span className="spec-label">Install</span><code className="spec-value">npx skills add LingXi-Org/LingxiSkills --skill {skill.slug}</code></div>
          <div className="spec-row"><a className="text-link" href={skill.sourceUrl} rel="noreferrer">View SKILL.md on GitHub →</a></div>
        </aside>
      </div>
    </div>
  );
}

