import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  if (!content) return null;

  return (
    <div
      className={`prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-img:rounded-xl leading-relaxed ${className}`}
    >
      <Markdown>{content}</Markdown>
    </div>
  );
};
