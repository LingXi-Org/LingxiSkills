import Link from 'next/link';
import { SearchTrigger } from './SearchTrigger';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="LingxiSkills home">
          <span className="brand-mark" aria-hidden="true">LX</span>
          <span>LingxiSkills</span>
        </Link>
        <nav className="header-nav" aria-label="Primary navigation">
          <SearchTrigger />
          <Link href="/skills/">Registry</Link>
          <a href="https://github.com/LingXi-Org/LingxiSkills" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
