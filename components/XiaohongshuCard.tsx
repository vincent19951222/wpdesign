import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CardPage } from '../types/publish';
import { XHS_CARD_PREVIEW_HEIGHT, XHS_CARD_PREVIEW_WIDTH } from '../lib/xiaohongshu';

interface XiaohongshuCardProps {
  page: CardPage;
  title: string;
  totalPages: number;
  exportRef?: (node: HTMLElement | null) => void;
  bodyRef?: (node: HTMLDivElement | null) => void;
  onContentLoad?: () => void;
}

const brutalTheme = {
  bg: '#FAFAFA',
  yellow: '#F0C808',
  red: '#E64A57',
  dark: '#1E1E1E',
  green: '#00FF00',
  text: '#222222',
  light: '#888888',
};

const shellFont = '"SFMono-Regular", "Courier New", Consolas, monospace';
const bodyFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const markdownComponents = (onContentLoad?: () => void) => ({
  h1: () => null,
  h2: () => null,
  h3: ({ ...props }) => (
    <h3
      className="mb-4 flex items-center text-[27px] font-bold leading-[1.35] text-[#222222]"
      style={{ wordBreak: 'break-word' }}
      {...props}
    >
      <span className="mr-3 inline-block h-[12px] w-6 rounded-[6px] bg-black" aria-hidden="true" />
      <span>{props.children}</span>
    </h3>
  ),
  h4: ({ ...props }) => (
    <h4
      className="mb-3 mt-6 flex items-center text-[24px] font-bold leading-[1.35] text-[#222222]"
      style={{ wordBreak: 'break-word' }}
      {...props}
    >
      <span className="mr-3 inline-block h-6 w-[6px] bg-[#F0C808]" aria-hidden="true" />
      <span>{props.children}</span>
    </h4>
  ),
  p: ({ ...props }) => <p className="mb-5 text-[24px] leading-[1.8] text-[#222222]" {...props} />,
  strong: ({ ...props }) => (
    <strong
      className="font-black text-black"
      style={{ backgroundColor: brutalTheme.yellow, borderBottom: '3px solid #000', padding: '0 6px' }}
      {...props}
    />
  ),
  em: ({ ...props }) => <em className="italic text-[#666666]" {...props} />,
  a: ({ ...props }) => (
    <a
      className="font-bold text-[#E64A57] no-underline"
      style={{ borderBottom: `3px dashed ${brutalTheme.red}` }}
      {...props}
    />
  ),
  ul: ({ ...props }) => <ul className="mb-4 ml-0 mt-0 list-none p-0" {...props} />,
  ol: ({ ...props }) => <ol className="mb-4 ml-0 mt-0 list-none p-0" {...props} />,
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="relative mb-3 pl-8 text-[22px] leading-[1.6] text-[#222222]" {...props}>
      <span
        className="absolute left-0 top-[10px] h-3 w-3 border-[2px] border-[#E64A57] bg-[#1E1E1E]"
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="mb-0 mt-[30px] bg-[#eeeeee] px-[15px] py-[10px] text-[22px] italic leading-[1.7] text-[#222222]"
      style={{ borderLeft: '6px solid #000' }}
      {...props}
    />
  ),
  code: ({ inline, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
    inline ? (
      <code
        className="rounded-[2px] bg-[#1E1E1E] px-[6px] py-[2px] text-[0.9em] text-[#00FF00]"
        style={{ fontFamily: shellFont }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className="block whitespace-pre-wrap text-[18px] leading-[1.7] text-[#00FF00]" style={{ fontFamily: shellFont }} {...props}>
        {children}
      </code>
    ),
  pre: ({ ...props }) => (
    <pre
      className="mb-5 overflow-hidden rounded-[2px] bg-[#1E1E1E] px-4 py-3"
      style={{ boxShadow: '4px 4px 0 #000' }}
      {...props}
    />
  ),
  img: ({ ...props }) => (
    <img
      className="mb-5 block max-h-[250px] w-full object-cover"
      style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000' }}
      onLoad={onContentLoad}
      {...props}
    />
  ),
  table: ({ ...props }) => (
    <div className="mb-5 overflow-hidden" style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000' }}>
      <table className="w-full border-collapse bg-white text-left text-[18px]" {...props} />
    </div>
  ),
  thead: ({ ...props }) => <thead className="bg-[#1E1E1E] text-[#F0C808]" {...props} />,
  th: ({ ...props }) => (
    <th className="px-3 py-2 text-[14px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: shellFont }} {...props} />
  ),
  td: ({ ...props }) => <td className="border-t border-black/10 px-3 py-2 align-top text-[18px] leading-[1.5] text-[#222222]" {...props} />,
  hr: () => <div className="mb-5 mt-6 h-px w-full bg-black/12" />,
});

export const XiaohongshuCard: React.FC<XiaohongshuCardProps> = ({
  page,
  title,
  totalPages,
  exportRef,
  bodyRef,
  onContentLoad,
}) => {
  const topBarLeft = page.isCover ? '👾 心情: 编码中  📡 AI: 99%' : `> Paging_Sys.exe /load p${page.index}`;

  return (
    <article
      ref={exportRef}
      className="relative flex flex-col overflow-hidden border border-[#dddddd] bg-[#FAFAFA]"
      style={{
        width: XHS_CARD_PREVIEW_WIDTH,
        height: XHS_CARD_PREVIEW_HEIGHT,
        boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
        fontFamily: bodyFont,
      }}
    >
      <header
        className="absolute left-0 right-0 top-0 flex items-center justify-between bg-[#1E1E1E] px-[22px] text-[#00FF00]"
        style={{ height: 45, fontFamily: shellFont, fontSize: 18 }}
      >
        <span>{topBarLeft}</span>
        {page.isCover && (
          <span className="inline-flex items-center gap-2">
            <span>电源</span>
            <span className="relative inline-block h-[15px] w-[30px] border border-[#00FF00]">
              <span className="absolute inset-[2px] bg-[#F0C808]" />
            </span>
          </span>
        )}
      </header>

      <div
        ref={page.isCover ? undefined : bodyRef}
        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${page.isCover ? 'items-center justify-center text-center' : ''}`}
        style={{ padding: '15% 10% 20% 10%' }}
      >
        {page.isCover ? (
          <>
            <div
              className="mb-8 border-[4px] border-black bg-[#F0C808] px-[38px] py-[22px] text-[42px] font-black leading-[1.24] text-black"
              style={{ boxShadow: '9px 9px 0 #000', letterSpacing: '0.08em', transform: 'rotate(-2deg)', wordBreak: 'break-word' }}
            >
              {title || '未填写标题'}
            </div>
            <div className="text-[21px] uppercase tracking-[0.08em] text-[#888888]" style={{ fontFamily: shellFont }}>
              BUILDING WITH AI & CATS
            </div>
          </>
        ) : (
          <>
            <div
              className="mb-[30px] inline-block self-start border-[4px] border-black bg-[#E64A57] px-6 py-3 text-[30px] font-bold leading-[1.3] text-white"
              style={{ boxShadow: '6px 6px 0 #000', wordBreak: 'break-word' }}
            >
              {page.heading || `Page ${page.index - 1}`}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents(onContentLoad)}>
                {page.markdown || '这页还没有正文内容。'}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>

      <footer
        className="absolute bottom-[30px] left-0 right-0 flex items-center justify-center gap-[9px]"
        aria-label="page-indicator"
      >
        {Array.from({ length: totalPages }).map((_, index) => {
          const step = index + 1;
          const isActive = step === page.index;

          return (
            <span
              key={`page-dot-${step}`}
              className={isActive ? 'h-[9px] w-[18px] rounded-[6px] bg-black' : 'h-[9px] w-[9px] rounded-full bg-[#cccccc]'}
            />
          );
        })}
      </footer>
    </article>
  );
};
