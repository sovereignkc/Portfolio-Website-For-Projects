"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownMessage({ content, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0 leading-6 text-inherit">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-inherit">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-inherit">{children}</ol>,
          li: ({ children }) => <li className="leading-6 text-inherit">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/30 underline-offset-2 hover:decoration-white/60"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-inherit">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-[0.85em] leading-6 text-inherit">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-white/15 pl-4 italic text-white/72">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => <h1 className="mb-3 text-lg font-semibold text-inherit">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 text-base font-semibold text-inherit">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 text-sm font-semibold text-inherit">{children}</h3>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
