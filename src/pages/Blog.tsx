import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  X,
  BookOpen,
  ArrowUpDown,
  Filter,
  Eye,
  Sparkles,
  Check
} from 'lucide-react';
import { BlogPost } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface BlogProps {
  posts: BlogPost[];
  onSelectPost: (slugOrId: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

type SortOption = 'newest' | 'oldest' | 'views' | 'reading-asc' | 'reading-desc' | 'alphabetical';

// Helper to highlight matching text in title/excerpt
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 rounded px-0.5 font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const Blog: React.FC<BlogProps> = ({
  posts,
  onSelectPost,
  initialSearch = '',
  initialCategory = 'All'
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initial search if changed from parent
  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Keyboard shortcut: '/' focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute category statistics
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    posts.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const categories = useMemo(() => {
    return Object.keys(categoryStats);
  }, [categoryStats]);

  // Compute tag statistics
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      p.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);

  const topTags = useMemo(() => {
    return Object.entries(tagStats)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [tagStats]);

  // Search, filter, and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filtering
    const filtered = posts.filter((p) => {
      const matchCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchTag =
        selectedTag === 'All' || p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query)) ||
        (p.content && p.content.toLowerCase().includes(query));

      return matchCategory && matchTag && matchSearch;
    });

    // 2. Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
      }
      if (sortBy === 'oldest') {
        return (a.publishedAt || '').localeCompare(b.publishedAt || '');
      }
      if (sortBy === 'views') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'reading-asc') {
        return a.readingTimeMinutes - b.readingTimeMinutes;
      }
      if (sortBy === 'reading-desc') {
        return b.readingTimeMinutes - a.readingTimeMinutes;
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedTag !== 'All' ||
    sortBy !== 'newest';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag('All');
    setSortBy('newest');
  };

  const handleTagClick = (tag: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedTag.toLowerCase() === tag.toLowerCase()) {
      setSelectedTag('All');
    } else {
      setSelectedTag(tag);
    }
  };

  const featuredPost = posts[0];
  const isFilteringActive = hasActiveFilters;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Writing & System Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Engineering Insights & Articles
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            In-depth case studies, system design notes, distributed architecture patterns, and software craft.
          </p>
        </div>

        {/* Quick stat pill */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-2xl">
          <div>
            <span className="font-bold text-zinc-900 dark:text-white">{posts.length}</span> Articles
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white">{categories.length - 1}</span> Topics
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white">{Object.keys(tagStats).length}</span> Tags
          </div>
        </div>
      </div>

      {/* Prominent Featured Post (Only displayed when no search/filters are active) */}
      {!isFilteringActive && featuredPost && (
        <div
          onClick={() => onSelectPost(featuredPost.slug || featuredPost.id || '')}
          className="group rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <ImageWithFallback
              src={featuredPost.featuredImageUrl}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
              fallbackText={featuredPost.title}
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Insight</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featuredPost.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredPost.readingTimeMinutes} min read
                </span>
                {featuredPost.viewsCount && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {featuredPost.viewsCount.toLocaleString()} views
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                {featuredPost.title}
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap gap-1.5">
                {featuredPost.tags?.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-xs text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Control Center */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        {/* Top Controls: Search Input + Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Real-time Search Input with Keyboard Shortcut and Clear Button */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles by title, topic, tags, or content (Press '/' to focus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-200/60 dark:bg-zinc-700/60 rounded border border-zinc-300 dark:border-zinc-600">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="reading-asc">Quick Reads (&lt; 5m)</option>
              <option value="reading-desc">Deep Dives</option>
              <option value="alphabetical">Title (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider font-mono">
            <span>Filter by Category</span>
            <span className="text-[11px] normal-case font-normal">
              {filteredAndSortedPosts.length} of {posts.length} articles displayed
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryStats[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isSelected
                        ? 'bg-indigo-700/80 text-indigo-100'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Tags / Topics Bar */}
        {topTags.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider font-semibold">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Popular Tags & Topics</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                onClick={() => setSelectedTag('All')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedTag === 'All'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>All Tags</span>
              </button>

              {topTags.map((tag) => {
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                const count = tagStats[tag] || 0;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>#{tag}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded-full font-mono font-medium ${
                        isSelected
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filters Ribbon (visible whenever any filter is applied) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs bg-zinc-50 dark:bg-zinc-800/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 font-medium">Active search filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Keyword: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                    title="Remove keyword filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                    title="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTag !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Tag: #{selectedTag}
                  <button
                    onClick={() => setSelectedTag('All')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                    title="Remove tag filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== 'newest' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs">
                  Sort: {sortBy}
                  <button
                    onClick={() => setSortBy('newest')}
                    className="hover:text-zinc-900 dark:hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Articles Grid or Zero Results State */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
            <Search className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              No matching articles found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              We couldn't find any articles matching{' '}
              {searchQuery ? <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{searchQuery}"</span> : 'your criteria'}.
            </p>
          </div>

          {/* Quick suggestions to try */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-400 font-mono block">Try searching for:</span>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
              {['Architecture', 'Firestore', 'Firebase', 'Security', 'PHP', 'Docker'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-300 transition cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search Filters</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post.slug || post.id || '')}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition cursor-pointer flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <ImageWithFallback
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  fallbackText={post.title}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(post.category);
                  }}
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 transition cursor-pointer"
                  title={`Filter by category: ${post.category}`}
                >
                  {post.category}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTimeMinutes} min
                    </span>
                    {post.viewsCount && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.viewsCount.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                    <HighlightedText text={post.title} query={searchQuery} />
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    <HighlightedText text={post.excerpt} query={searchQuery} />
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Interactive Tags - Clicking filters directly by that tag */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 4).map((t, i) => {
                        const isTagActive = selectedTag.toLowerCase() === t.toLowerCase();
                        return (
                          <button
                            key={i}
                            onClick={(e) => handleTagClick(t, e)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                              isTagActive
                                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-300'
                            }`}
                            title={`Filter articles by #${t}`}
                          >
                            #{t}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
