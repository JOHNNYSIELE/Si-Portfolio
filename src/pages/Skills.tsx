import React, { useState } from 'react';
import {
  Server,
  Layers,
  Database,
  Cloud,
  Code2,
  Terminal,
  Cpu,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Skill } from '../types';
import { NotificationSubscribeCard } from '../components/notifications/NotificationSubscribeCard';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Backend', 'Frontend', 'Database', 'Cloud & DevOps', 'Design & Tools'];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'backend':
        return <Server className="w-4 h-4 text-indigo-500" />;
      case 'frontend':
        return <Layers className="w-4 h-4 text-sky-500" />;
      case 'database':
        return <Database className="w-4 h-4 text-amber-500" />;
      case 'cloud & devops':
        return <Cloud className="w-4 h-4 text-emerald-500" />;
      default:
        return <Code2 className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
          Technical Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Skills & Technical Matrix
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          A granular breakdown of languages, systems architectures, cloud infrastructures, and developer tooling.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat !== 'All' && getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">
                  {getCategoryIcon(skill.category)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                    {skill.name}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {skill.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  {skill.proficiency}%
                </span>
                {skill.levelLabel && (
                  <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {skill.levelLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Proficiency Bar */}
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>

            {skill.description && (
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {skill.description}
              </p>
            )}

            {skill.isTopSkill && (
              <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Primary Day-to-Day Technology</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Visitor Skills Notifications & Updates */}
      <NotificationSubscribeCard
        type="skills"
        title="Get Notified on Technical Skills & Stack Expansions"
        description="Subscribe to receive updates when Johnny masters new frameworks, adds cloud certifications, or publishes architectural reference implementations."
      />
    </div>
  );
};
