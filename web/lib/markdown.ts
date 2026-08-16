function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

/** A deliberately small, safe renderer for the source SKILL.md body. */
export function renderMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let inCode = false;
  let codeLanguage = '';
  let listOpen = false;
  let paragraph: string[] = [];

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };
  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      flushParagraph();
      closeList();
      if (!inCode) {
        codeLanguage = line.trim().slice(3).trim();
        html.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">`);
      } else {
        html.push('</code></pre>');
        codeLanguage = '';
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(4, heading[1].length + 1);
      html.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(bullet[1])}</li>`);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  if (inCode) html.push('</code></pre>');
  return html.join('\n');
}

