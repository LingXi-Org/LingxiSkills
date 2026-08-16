import type { ReactNode } from 'react';

/** Lightweight static DocsLayout boundary for the exported registry. */
export function DocsLayout({ children }: { children: ReactNode }) {
  return <div className="docs-layout">{children}</div>;
}

