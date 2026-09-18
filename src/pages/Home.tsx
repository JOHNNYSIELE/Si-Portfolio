import React from 'react';
import {
  ArrowRight,
  Download,
  Terminal,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  Github,
  Calendar,
  Clock
} from 'lucide-react';
import { Profile, Project, Skill, BlogPost } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface HomeProps {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  blogPosts: BlogPost[];
  onNavigate: (tab: string, param?: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  profile,
  projects,
  skills,
  blogPosts,
  onNavigate
}) => {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const topSkills = skills.filter((s) => s.isTopSkill).slice(0, 8);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div className="space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {profile.availableForHire && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Available for Senior Engineering Roles & Architecture Advisory</span>
                </div>
              )}

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Hi, I'm <span className="text-indigo-600 dark:text-indigo-400">{profile.fullName}</span>
                </h1>
                <p className="text-xl sm:text-2xl font-medium text-zinc-700 dark:text-zinc-300">
                  {profile.title}
                </p>
              </div>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {profile.headline}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-sm transition cursor-pointer"
                >
                  <span>Get in Touch</span>
                </button>
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-semibold transition"
                  >
                    <Download className="w-4 h-4 text-indigo-500" />
                    <span>Resume / CV</span>
                  </a>
                )}
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800/80">
                {profile.highlights?.map((h, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                      {h.value}
                    </p>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {h.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Profile Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-80 sm:w-84 sm:h-96">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl rotate-3 opacity-20 dark:opacity-30 filter blur-xl" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-900">
                  <ImageWithFallback
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    fallbackText={profile.fullName}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                    <p className="font-semibold text-sm">{profile.fullName}</p>
                    <p className="text-xs text-zinc-300">{profile.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              Production Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Featured Case Studies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition cursor-pointer"
          >
            <span>View all projects ({projects.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col"
            >
              <div
                className="relative h-48 sm:h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                onClick={() => onNavigate('project-detail', project.slug || project.id)}
              >
                <ImageWithFallback
                  src={project.coverImageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  fallbackText={project.title}
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {project.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => onNavigate('project-detail', project.slug || project.id)}
                    className="text-lg font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-zinc-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <button
                      onClick={() => onNavigate('project-detail', project.slug || project.id)}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Read Case Study →
                    </button>
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
      </section>

      {/* Selected Technical Skills */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              Core Competencies
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Technical Proficiencies
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Modern full-stack technologies, architectural paradigms, and cloud engineering skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">
                    {skill.name}
                  </h3>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {skill.proficiency}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                {skill.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('skills')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition cursor-pointer"
            >
              <span>Explore Complete Skills Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Technical Publications / Blog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
              Engineering Notes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Latest Articles & Insights
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition cursor-pointer"
          >
            <span>Read all articles ({blogPosts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate('blog-post', post.slug || post.id)}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <ImageWithFallback
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  fallbackText={post.title}
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-xs font-semibold bg-black/60 backdrop-blur-md text-white">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt || 'Recent'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-zinc-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              Let's Collaborate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Have a high-impact engineering challenge or project in mind?
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Whether you need scalable cloud architecture consulting, a bespoke web application, or senior full-stack execution, let's discuss your roadmap.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-md transition cursor-pointer"
              >
                Start a Conversation
              </button>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="px-6 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-medium text-sm border border-indigo-500/40 transition"
                >
                  {profile.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
