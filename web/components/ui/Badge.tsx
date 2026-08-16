import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return <span className="capability-list"><span>{children}</span></span>;
}
