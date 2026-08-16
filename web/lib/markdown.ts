import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

export function headingSlug(value: string) {
  const slug = value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\w\u0080-\uFFFF -]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return slug || 'section';
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const value = node as { value?: unknown; children?: unknown[] };
  if (typeof value.value === 'string') return value.value;
  return (value.children ?? []).map(nodeText).join('');
}

/** Add stable anchors so the Fumadocs TOC can observe rendered headings. */
function rehypeHeadingIds() {
  return (tree: unknown) => {
    const used = new Map<string, number>();
    const visit = (node: unknown) => {
      if (!node || typeof node !== 'object') return;
      const current = node as { type?: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] };
      if (current.type === 'element' && /^h[1-6]$/.test(current.tagName ?? '')) {
        const base = headingSlug(nodeText(current));
        const count = used.get(base) ?? 0;
        used.set(base, count + 1);
        current.properties = { ...(current.properties ?? {}), id: count ? `${base}-${count + 1}` : base };
      }
      for (const child of current.children ?? []) visit(child);
    };
    visit(tree);
  };
}

// Keep source rendering on the same standards-based Markdown pipeline used by
// the Fumadocs/MDX toolchain. GFM covers the tables, task lists, and other
// extensions used by the repository's SKILL.md files.
const markdownProcessor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeHeadingIds);

export function renderMarkdown(markdown: string) {
  const mdast = markdownProcessor.parse(markdown);
  const hast = markdownProcessor.runSync(mdast);
  return toHtml(hast as Parameters<typeof toHtml>[0]);
}
