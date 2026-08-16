import Link from 'next/link';

export default function NotFound() {
  return <div className="shell empty-state" style={{ marginTop: 80 }}><p className="eyebrow">404</p><h1>Skill not found.</h1><p className="muted">This route is not part of the current repository scan.</p><Link className="secondary-button" href="/skills/">Back to registry</Link></div>;
}

