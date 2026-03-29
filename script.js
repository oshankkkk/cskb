const readmeRoot = document.querySelector("#readme-root");

const HTML_ESCAPE_LOOKUP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPE_LOOKUP[character]);
}

function sanitizeUrl(url) {
  const trimmed = url.trim();

  if (/^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }

  return "#";
}

function stripHiddenComments(markdown) {
  return markdown.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function parseInline(markdown) {
  const codeTokens = [];
  let html = escapeHtml(markdown);

  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const token = `%%CODE_${codeTokens.length}%%`;
    codeTokens.push(`<code>${code}</code>`);
    return token;
  });

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safeUrl = sanitizeUrl(url);
    const isExternal = /^(https?:|mailto:|tel:)/i.test(url.trim());
    const attrs = isExternal ? ' target="_blank" rel="noreferrer"' : "";
    return `<a href="${safeUrl}"${attrs}>${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  return html.replace(/%%CODE_(\d+)%%/g, (_, index) => codeTokens[Number(index)]);
}

function markdownToHtml(markdown) {
  const html = [];
  const lines = stripHiddenComments(markdown).replace(/\r\n?/g, "\n").split("\n");

  let paragraphBuffer = [];
  let listBuffer = [];
  let listType = null;
  let quoteBuffer = [];

  function flushParagraph() {
    if (!paragraphBuffer.length) {
      return;
    }

    html.push(`<p>${parseInline(paragraphBuffer.join(" "))}</p>`);
    paragraphBuffer = [];
  }

  function flushList() {
    if (!listBuffer.length || !listType) {
      return;
    }

    const items = listBuffer.map((item) => `<li>${parseInline(item)}</li>`).join("");
    html.push(`<${listType}>${items}</${listType}>`);
    listBuffer = [];
    listType = null;
  }

  function flushQuote() {
    if (!quoteBuffer.length) {
      return;
    }

    const paragraphs = quoteBuffer
      .map((item) => `<p>${parseInline(item)}</p>`)
      .join("");

    html.push(`<blockquote>${paragraphs}</blockquote>`);
    quoteBuffer = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (/^```/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();

      const codeBlock = [];
      index += 1;

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeBlock.push(lines[index]);
        index += 1;
      }

      html.push(`<pre><code>${escapeHtml(codeBlock.join("\n"))}</code></pre>`);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();

      const level = headingMatch[1].length;
      const content = parseInline(headingMatch[2].trim());
      html.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push("<hr>");
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)$/);

    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteBuffer.push(quoteMatch[1]);
      continue;
    }

    const unorderedListMatch = line.match(/^[-*+]\s+(.*)$/);

    if (unorderedListMatch) {
      flushParagraph();
      flushQuote();

      if (listType && listType !== "ul") {
        flushList();
      }

      listType = "ul";
      listBuffer.push(unorderedListMatch[1]);
      continue;
    }

    const orderedListMatch = line.match(/^\d+\.\s+(.*)$/);

    if (orderedListMatch) {
      flushParagraph();
      flushQuote();

      if (listType && listType !== "ol") {
        flushList();
      }

      listType = "ol";
      listBuffer.push(orderedListMatch[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join("\n");
}

function extractTitle(markdown) {
  const match = stripHiddenComments(markdown).match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Portfolio";
}

function updatePageMeta(markdown) {
  const title = extractTitle(markdown);
  document.title = `${title} | Portfolio`;
}

function showError(error) {
  document.title = "README not loaded | Portfolio";
  readmeRoot.innerHTML = `
    <h1>README.md could not be loaded</h1>
    <p>This page renders directly from <code>README.md</code>.</p>
    <p>
      If you opened the file directly in the browser, use a local server instead. Browsers usually block
      <code>fetch()</code> requests from <code>file://</code> pages.
    </p>
    <pre><code>${escapeHtml(error.message)}</code></pre>
  `;
}

async function renderReadme() {
  try {
    const response = await fetch("./README.md", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const markdown = await response.text();
    readmeRoot.innerHTML = markdownToHtml(markdown);
    updatePageMeta(markdown);
  } catch (error) {
    showError(error);
  }
}

renderReadme();
