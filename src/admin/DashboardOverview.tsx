import React from 'react';
import {
  FolderGit2,
  BookOpen,
  Cpu,
  Mail,
  Image as ImageIcon,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Project, BlogPost, Skill, GalleryItem, Message, Profile } from '../types';

interface DashboardOverviewProps {
  projects: Project[];
  blogPosts: BlogPost[];
  skills: Skill[];
  gallery: GalleryItem[];
  messages: Message[];
  profile: Profile;
  onNavigateTab: (tab: string) => void;
  onSeedDatabase: () => void;
  isSeeding: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  blogPosts,
  skills,
  gallery,
  messages,
  profile,
  onNavigateTab,
  onSeedDatabase,
  isSeeding
}) => {
  const unreadMessages = messages.filter((m) => m.status === 'unread');
  const publishedProjects = projects.filter((p) => p.status === 'published');
  const publishedPosts = blogPosts.filter((p) => p.status === 'published');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Portfolio Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time control center for your personal portfolio, case studies, articles, and client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSeedDatabase}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-indigo-400 text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
            title="Populates Firestore with comprehensive seed data if collections are empty"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{isSeeding ? 'Syncing to Firestore...' : 'Sync/Seed Firestore'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-medium">Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
          <span className="block text-[11px] text-zinc-500">
            {publishedProjects.length} Published Live
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('blog')}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-medium">Articles</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white">{blogPosts.length}</p>
          <span className="block text-[11px] text-zinc-500">
            {publishedPosts.length} Published
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('skills')}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-medium">Skills</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{skills.length}</p>
          <span className="block text-[11px] text-zinc-500">
            {skills.filter((s) => s.isTopSkill).length} Core Top Skills
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('gallery')}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-medium">Media</span>
            <ImageIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{gallery.length}</p>
          <span className="block text-[11px] text-zinc-500">Gallery Items</span>
        </div>

        <div
          onClick={() => onNavigateTab('messages')}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer space-y-2 col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono font-medium">Inquiries</span>
            <Mail className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white">{messages.length}</p>
          <span className={`block text-[11px] font-semibold ${unreadMessages.length > 0 ? 'text-rose-400' : 'text-zinc-500'}`}>
            {unreadMessages.length} Unread Messages
          </span>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Quick Administrative Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="p-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-left border border-zinc-700/60 hover:border-indigo-500/50 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm font-semibold text-white">Manage Projects</span>
              <span className="text-xs text-zinc-400">Create or edit case studies</span>
            </div>
            <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateTab('blog')}
            className="p-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-left border border-zinc-700/60 hover:border-sky-500/50 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm font-semibold text-white">Write Blog Post</span>
              <span className="text-xs text-zinc-400">Markdown editor & drafts</span>
            </div>
            <PlusCircle className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateTab('profile')}
            className="p-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-left border border-zinc-700/60 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm font-semibold text-white">Profile & CV</span>
              <span className="text-xs text-zinc-400">Bio, highlights & resume link</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateTab('messages')}
            className="p-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-left border border-zinc-700/60 hover:border-rose-500/50 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="block text-sm font-semibold text-white">Client Inquiries</span>
              <span className="text-xs text-zinc-400">{unreadMessages.length} unread submissions</span>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Contact Submissions */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Inquiries</h3>
            <p className="text-xs text-zinc-400">Public messages submitted via the contact form.</p>
          </div>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs font-semibold text-indigo-400 hover:underline cursor-pointer"
          >
            View All ({messages.length}) →
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No contact submissions received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="py-2.5 px-3">Sender</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {messages.slice(0, 5).map((msg) => (
                  <tr key={msg.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white block">{msg.name}</span>
                      <span className="text-zinc-500 font-mono text-[11px]">{msg.email}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate">
                      <span className="font-medium text-zinc-200">{msg.subject}</span>
                      <span className="block text-zinc-400 truncate text-[11px]">{msg.message}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.status === 'unread'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onNavigateTab('messages')}
                        className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        Open Inbox
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
