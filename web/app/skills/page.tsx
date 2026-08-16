import type { Metadata } from 'next';
import { SkillExplorer } from '../../components/SkillExplorer';
import { skills } from '../../lib/skills';

export const metadata: Metadata = {
  title: 'Skill registry',
  description: 'Browse every skill discovered from the LingxiSkills repository.',
  alternates: { canonical: '/skills/' },
};

export default function SkillsPage() {
  const categories = [...new Set(skills.map((skill) => skill.category))].sort();
  const phases = [...new Set(skills.map((skill) => skill.phase).filter((phase): phase is string => Boolean(phase)))].sort();
  return (
    <>
      <section className="page-intro">
        <div className="shell">
          <p className="eyebrow">Capability registry</p>
          <h1>All skills, in one place.</h1>
          <p>Search and filter the complete live inventory. Sparse metadata is given safe fallbacks; no skill is omitted because it is shared, runtime, or utility code.</p>
        </div>
      </section>
      <SkillExplorer skills={skills} categories={categories} phases={phases} />
    </>
  );
}

