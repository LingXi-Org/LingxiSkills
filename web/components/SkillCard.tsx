import Link from 'next/link';
import type { SkillEntry } from '../lib/skills';
import { formatPhase } from '../lib/skills';

export function SkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <article className="skill-card">
      <div className="skill-card-topline">
        <span className="eyebrow">{skill.category}</span>
        {skill.version ? <span className="version">v{skill.version}</span> : null}
      </div>
      <h3><Link href={`/skills/${skill.slug}/`}>{skill.displayName}</Link></h3>
      <p className="skill-slug">{skill.slug}</p>
      <p className="card-description">{skill.displayDescription}</p>
      <div className="card-meta">
        {skill.phase ? <span>{formatPhase(skill.phase)}</span> : null}
        {skill.criticalPath ? <span>critical path</span> : null}
        {skill.learnerFacing ? <span>learner-facing</span> : null}
      </div>
      <div className="capability-list" aria-label="Capabilities">
        {skill.capabilities.slice(0, 3).map((capability) => <span key={capability}>{capability}</span>)}
      </div>
    </article>
  );
}

