import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-title">LingxiSkills</p>
          <p className="muted">Composable capabilities for intelligent learning systems.</p>
        </div>
        <div className="footer-links">
          <Link href="/skills/">Browse registry</Link>
          <a href="https://github.com/LingXi-Org/LingxiSkills" rel="noreferrer">Source on GitHub</a>
          <Link href="/llms.txt">llms.txt</Link>
        </div>
      </div>
    </footer>
  );
}

