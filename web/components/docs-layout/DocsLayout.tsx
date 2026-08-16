import type { ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import { DocsLayout as FumadocsDocsLayout } from 'fumadocs-ui/layouts/docs';
import { skills } from '../../lib/skills';

const categoryOrder = [
  'Teaching & Dialogue',
  'Content & Visualization',
  'Assessment & Practice',
  'Learner State & Curriculum',
  'Orchestration & Runtime',
  'Quality & Utilities',
];

const pageTree: Root = {
  type: 'root',
  name: 'LingxiSkills',
  children: [
    { type: 'page', name: 'Registry overview', url: '/skills/' },
    ...categoryOrder.flatMap((category) => {
      const entries = skills.filter((skill) => skill.category === category);
      if (!entries.length) return [];
      return [{
        type: 'folder' as const,
        name: category,
        defaultOpen: true,
        children: entries.map((skill) => ({
          type: 'page' as const,
          name: skill.displayName,
          url: `/skills/${skill.slug}/`,
          description: skill.displayDescription,
        })),
      }];
    }),
  ],
};

/** Fumadocs page-tree backed layout for the static capability registry. */
export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <FumadocsDocsLayout
      tree={pageTree}
      nav={{
        enabled: false,
        title: (
          <span className="inline-flex items-center gap-2.5 font-medium">
            <img src="/logo-icon.svg" width="28" height="28" alt="" />
            <span>LingxiSkills</span>
          </span>
        ),
      }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      sidebar={{ collapsible: false }}
    >
      {children}
    </FumadocsDocsLayout>
  );
}
