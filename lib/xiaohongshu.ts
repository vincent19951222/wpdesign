import type { CardDocument, CardDocumentResult, CardPage } from '../types/publish';

export const XHS_MAX_PAGES = 9;
export const XHS_EXPORT_WIDTH = 1080;
export const XHS_EXPORT_HEIGHT = 1440;
export const XHS_CARD_PREVIEW_WIDTH = 540;
export const XHS_CARD_PREVIEW_HEIGHT = 720;

const normalizeLineEndings = (value: string) => value.replace(/\r\n/g, '\n');

const extractPrimaryHeading = (markdown: string) => {
  const lines = normalizeLineEndings(markdown).split('\n');

  for (const line of lines) {
    const match = line.match(/^#\s+(.+?)\s*$/);
    if (match) {
      return match[1].trim();
    }
  }

  return '';
};

const splitSectionsByH2 = (markdown: string) => {
  const lines = normalizeLineEndings(markdown).split('\n');
  const sections: Array<{ heading: string; markdown: string }> = [];
  const strayIntroLines: string[] = [];
  let currentHeading = '';
  let currentLines: string[] = [];
  let seenTitle = false;

  const pushCurrentSection = () => {
    const sectionMarkdown = currentLines.join('\n').trim();
    if (!currentHeading || !sectionMarkdown) {
      currentHeading = '';
      currentLines = [];
      return;
    }

    sections.push({
      heading: currentHeading,
      markdown: sectionMarkdown,
    });
    currentHeading = '';
    currentLines = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (/^#\s+/.test(trimmed) && !seenTitle) {
      seenTitle = true;
      return;
    }

    const sectionMatch = trimmed.match(/^##\s+(.+?)\s*$/);
    if (sectionMatch) {
      pushCurrentSection();
      currentHeading = sectionMatch[1].trim();
      currentLines = [];
      return;
    }

    if (!currentHeading) {
      if (trimmed) {
        strayIntroLines.push(line);
      }
      return;
    }

    currentLines.push(line);
  });

  pushCurrentSection();

  return {
    sections,
    strayIntro: strayIntroLines.join('\n').trim(),
  };
};

export const parseCardDocument = (markdown: string): CardDocumentResult => {
  const title = extractPrimaryHeading(markdown);
  const { sections, strayIntro } = splitSectionsByH2(markdown);
  const pages: CardPage[] = [
    {
      index: 1,
      heading: title,
      markdown: '',
      isCover: true,
    },
    ...sections.map((section, index) => ({
      index: index + 2,
      heading: section.heading,
      markdown: section.markdown,
      isCover: false,
    })),
  ];
  const errors: string[] = [];

  if (!title) {
    errors.push('缺少一级标题。卡片模式要求用 `# 标题` 作为封面页内容。');
  }

  if (sections.length === 0) {
    errors.push('缺少二级标题。卡片模式要求至少提供一个 `##` section 作为正文页。');
  }

  if (strayIntro) {
    errors.push('检测到 H1 和第一个 H2 之间存在正文内容。卡片模式下请直接用 H2 开始每一页。');
  }

  if (pages.length > XHS_MAX_PAGES) {
    errors.push(`当前共 ${pages.length} 页（含封面），超过上限 ${XHS_MAX_PAGES} 页。请减少 H2 section 数量或精简内容。`);
  }

  const document: CardDocument = {
    title,
    pages,
  };

  return {
    document,
    errors,
  };
};

const waitForImages = async (node: HTMLElement) => {
  const images = Array.from(node.querySelectorAll('img'));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          const done = () => {
            image.removeEventListener('load', done);
            image.removeEventListener('error', done);
            resolve();
          };

          image.addEventListener('load', done);
          image.addEventListener('error', done);
        })
    )
  );
};

const inlineComputedStyles = (source: Element, clone: Element) => {
  const computed = window.getComputedStyle(source);
  const styleText = Array.from(computed)
    .map((property) => `${property}:${computed.getPropertyValue(property)};`)
    .join('');

  clone.setAttribute('style', styleText);

  if (source instanceof HTMLImageElement && clone instanceof HTMLImageElement) {
    clone.src = source.currentSrc || source.src;
    clone.crossOrigin = 'anonymous';
  }

  Array.from(source.children).forEach((child, index) => {
    const clonedChild = clone.children[index];
    if (clonedChild) {
      inlineComputedStyles(child, clonedChild);
    }
  });
};

const renderNodeToPngBlob = async (node: HTMLElement, filename: string) => {
  await document.fonts.ready;
  await waitForImages(node);

  const width = node.offsetWidth;
  const height = node.offsetHeight;
  const clonedNode = node.cloneNode(true) as HTMLElement;
  inlineComputedStyles(node, clonedNode);

  clonedNode.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

  const serialized = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        ${new XMLSerializer().serializeToString(clonedNode)}
      </foreignObject>
    </svg>
  `;

  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error(`无法导出 ${filename} 对应的卡片图片。`));
      nextImage.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = XHS_EXPORT_WIDTH;
    canvas.height = XHS_EXPORT_HEIGHT;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('浏览器当前环境不支持 PNG 导出。');
    }

    context.fillStyle = '#fffaf0';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          resolve(pngBlob);
          return;
        }

        reject(new Error(`导出 ${filename} 失败，浏览器没有返回 PNG 数据。`));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};

const sanitizeFilename = (value: string) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64) || 'xhs-note';

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportXhsImages = async (document: CardDocument, pageNodes: Array<HTMLElement | null>) => {
  const baseName = sanitizeFilename(document.title);

  for (const page of document.pages) {
    const node = pageNodes[page.index - 1];
    if (!node) {
      throw new Error(`未找到第 ${page.index} 页卡片节点，无法导出。`);
    }

    const fileName = `${baseName}-${String(page.index).padStart(2, '0')}.png`;
    const blob = await renderNodeToPngBlob(node, fileName);
    triggerDownload(blob, fileName);
  }
};
