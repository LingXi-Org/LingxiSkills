import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

// Keep source rendering on the same standards-based Markdown pipeline used by
// the Fumadocs/MDX toolchain. GFM covers the tables, task lists, and other
// extensions used by the repository's SKILL.md files.
const markdownProcessor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);

export function renderMarkdown(markdown: string) {
  const mdast = markdownProcessor.parse(markdown);
  const hast = markdownProcessor.runSync(mdast);
  return toHtml(hast as Parameters<typeof toHtml>[0]);
}
