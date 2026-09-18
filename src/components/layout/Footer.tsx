import React from 'react';
import { Github, Linkedin, Twitter, Globe, Heart, ShieldCheck, Mail } from 'lucide-react';
import { Profile, SiteSettings } from '../../types';

interface FooterProps {
  profile?: Profile;
  settings?: SiteSettings;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, settings, onNavigate }) => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Bio summary */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
              {profile?.fullName || 'Johnny Siele'}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              {profile?.headline || 'Senior Full-Stack Engineer & Cloud Architect.'}
            </p>
            {profile?.availableForHire && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for select contract & advisory opportunities
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('skills')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  Technical Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('experience')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  Career & Education
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  Technical Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3 font-mono">
              Connect
            </h4>
            <div className="flex items-center gap-3 mb-4">
              {profile?.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 hover:bg-zinc-200 transition"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 hover:bg-zinc-200 transition"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile?.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 hover:bg-zinc-200 transition"
                  aria-label="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 hover:bg-zinc-200 transition"
                  aria-label="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-500 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS Portal</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>{settings?.footerText || `© ${new Date().getFullYear()} Johnny Siele. All rights reserved.`}</p>
          <p className="flex items-center gap-1">
            Built with PHP 8+, TypeScript, Tailwind CSS & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
};
