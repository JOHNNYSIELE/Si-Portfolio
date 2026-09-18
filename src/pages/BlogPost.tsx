import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

interface BlogPostProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: (searchTag?: string) => void;
  onSelectPost: (slugOrId: string) => void;
}

export const BlogPostView: React.FC<BlogPostProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost
}) => {
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags?.some((t) => post.tags?.includes(t))))
    .slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={() => onBack()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBack(post.category)}
            className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer"
            title={`View all articles in ${post.category}`}
          >
            {post.category}
          </button>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt}
          </span>
          <span className="text-zinc-400">•</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      {/* Featured Banner Image */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl aspect-16/9 bg-zinc-100 dark:bg-zinc-800">
        <ImageWithFallback
          src={post.featuredImageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
          fallbackText={post.title}
        />
      </div>

      {/* Article Body */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <MarkdownRenderer content={post.content || post.excerpt} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-zinc-500 font-semibold">
              Tags:
            </span>
            {post.tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => onBack(tag)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-300 transition cursor-pointer"
                title={`Search articles tagged #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Author Bio Box */}
      <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
          JS
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
            Written by Johnny Siele
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            Senior Full-Stack Engineer & Cloud Solutions Architect. Writing on high-throughput backend systems, clean architecture, and modern distributed infrastructure.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Related Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                onClick={() => onSelectPost(related.slug || related.id || '')}
                className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition cursor-pointer space-y-2"
              >
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {related.category}
                </span>
                <h4 className="font-bold text-zinc-900 dark:text-white text-base hover:text-indigo-600 transition">
                  {related.title}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {related.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
