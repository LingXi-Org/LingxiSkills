import type { ReactNode } from 'react';
import { DocsLayout } from '../../components/docs-layout/DocsLayout';

/** Shared shell for registry and generated skill detail routes. */
export default function SkillsLayout({ children }: { children: ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
