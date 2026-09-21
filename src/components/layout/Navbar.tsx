import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { BlogPost, Skill } from '../../types';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  resumeUrl?: string;
  blogPosts?: BlogPost[];
  skills?: Skill[];
  onSelectPost?: (slugOrId: string) => void;
  onOpenResumeGenerator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  resumeUrl,
  blogPosts = [],
  skills = [],
  onSelectPost,
  onOpenResumeGenerator
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white tracking-tight block text-sm sm:text-base">
              Johnny Siele
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono block -mt-0.5">
              Full-Stack & Cloud
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side utility actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CV Button */}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Download Curriculum Vitae"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>CV / Resume</span>
            </a>
          )}

          {/* Visitor Notification Center */}
          <NotificationCenter
            blogPosts={blogPosts}
            skills={skills}
            onNavigate={onNavigate}
            onSelectPost={onSelectPost}
          />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Authenticated Admin CMS Indicator (Hidden for regular visitors) */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer animate-in fade-in duration-200"
              title="Open Admin CMS Dashboard (Active Session)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CMS Active</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition ${
                currentTab === link.id
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          {resumeUrl && (
            <div className="pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                Download CV / Resume
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
