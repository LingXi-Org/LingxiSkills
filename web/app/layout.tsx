import type { Metadata } from 'next';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://skills.lingxilearn.cn'),
  title: {
    default: 'LingxiSkills — Capability Registry',
    template: '%s — LingxiSkills',
  },
  description: 'Composable capabilities for intelligent learning systems, generated directly from the LingxiSkills repository.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'LingxiSkills — Capability Registry',
    description: 'Composable capabilities for intelligent learning systems.',
    url: 'https://skills.lingxilearn.cn/',
    siteName: 'LingxiSkills',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RootProvider search={{ options: { type: 'static', api: '/api/search' } }}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
