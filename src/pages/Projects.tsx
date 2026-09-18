import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  Github,
  Filter,
  ArrowRight,
  ArrowUpDown,
  X,
  Sparkles,
  Tag,
  Layers,
  Check
} from 'lucide-react';
import { Project } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface ProjectsProps {
  projects: Project[];
  onSelectProject: (slugOrId: string) => void;
}

type SortOption = 'featured' | 'newest' | 'oldest' | 'alphabetical' | 'alphabetical-desc';

export const Projects: React.FC<ProjectsProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showAllTechs, setShowAllTechs] = useState<boolean>(false);

  // Extract unique categories with project counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [projects]);

  const categories = useMemo(() => {
    return Object.keys(categoryStats);
  }, [categoryStats]);

  // Extract unique technologies with frequency counts
  const techStats = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      p.technologies?.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [projects]);

  const sortedTechList = useMemo(() => {
    return Object.entries(techStats)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);
  }, [techStats]);

  // Handle tech chip click
  const handleTechClick = (tech: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedTech === tech) {
      setSelectedTech('All');
    } else {
      setSelectedTech(tech);
    }
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    // 1. Filtering
    const filtered = projects.filter((p) => {
      const matchCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchTech =
        selectedTech === 'All' || p.technologies?.includes(selectedTech);
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchCategory && matchTech && matchSearch;
    });

    // 2. Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // fallback to date
        return (b.completionDate || '').localeCompare(a.completionDate || '');
      }
      if (sortBy === 'newest') {
        return (b.completionDate || '').localeCompare(a.completionDate || '');
      }
      if (sortBy === 'oldest') {
        return (a.completionDate || '').localeCompare(b.completionDate || '');
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'alphabetical-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [projects, selectedCategory, selectedTech, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedTech !== 'All' || searchQuery.trim() !== '' || sortBy !== 'featured';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedTech('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Limit shown technology chips initially to top 10 unless toggled
  const displayedTechs = showAllTechs ? sortedTechList : sortedTechList.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-medium">
          <Layers className="w-3.5 h-3.5" />
          <span>Case Studies & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Featured Engineering Projects
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A showcase of production-ready web applications, distributed cloud infrastructure, microservices, and custom developer platforms.
        </p>
      </div>

      {/* Interactive Filter & Sorting Control Center */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Search input with clear button */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, stack (e.g. Docker, Go, React), or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Title (A - Z)</option>
              <option value="alphabetical-desc">Title (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider font-mono">
            <span>Filter by Category</span>
            <span className="text-[11px] normal-case font-normal">
              {filteredAndSortedProjects.length} of {projects.length} displayed
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

        {/* Technology Filter Chips */}
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Filter by Technology Stack</span>
            </div>
            {sortedTechList.length > 10 && (
              <button
                onClick={() => setShowAllTechs(!showAllTechs)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                {showAllTechs ? 'Show Fewer' : `Show All (${sortedTechList.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {/* "All Technologies" pill */}
            <button
              onClick={() => setSelectedTech('All')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedTech === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>All Stacks</span>
            </button>

            {/* Individual Technology Pills */}
            {displayedTechs.map((tech) => {
              const isSelected = selectedTech === tech;
              const count = techStats[tech] || 0;
              return (
                <button
                  key={tech}
                  onClick={() => handleTechClick(tech)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{tech}</span>
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

        {/* Active Filters Summary Bar (shows when filters are active) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs bg-zinc-50 dark:bg-zinc-800/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 font-medium">Active filters:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTech !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Stack: {selectedTech}
                  <button
                    onClick={() => setSelectedTech('All')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-xs">
                  Query: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-indigo-950 dark:hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== 'featured' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs">
                  Sort: {sortBy}
                  <button
                    onClick={() => setSortBy('featured')}
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

      {/* Projects Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              No projects found matching current criteria
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Try selecting a different category, clearing technology filters, or searching for other keywords.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col"
            >
              {/* Cover Image */}
              <div
                onClick={() => onSelectProject(project.slug || project.id || '')}
                className="relative h-48 sm:h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
              >
                <ImageWithFallback
                  src={project.coverImageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  fallbackText={project.title}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(project.category);
                  }}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 transition cursor-pointer"
                  title={`Filter by category: ${project.category}`}
                >
                  {project.category}
                </button>
                {project.featured && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-black flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                    <span>{project.completionDate}</span>
                    <span className="text-[11px] text-zinc-500">
                      {project.technologies?.length || 0} technologies
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectProject(project.slug || project.id || '')}
                    className="text-lg font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer leading-snug"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Interactive Technology Tags - Clicking filters by technology */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 font-mono block">Tech Stack (click to filter):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 5).map((tech, i) => {
                        const isTechActive = selectedTech === tech;
                        return (
                          <button
                            key={i}
                            onClick={(e) => handleTechClick(tech, e)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                              isTechActive
                                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-300'
                            }`}
                            title={`Filter projects by ${tech}`}
                          >
                            {tech}
                          </button>
                        );
                      })}
                      {project.technologies && project.technologies.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[11px] text-zinc-500 font-mono">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <button
                      onClick={() => onSelectProject(project.slug || project.id || '')}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          title="View Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
