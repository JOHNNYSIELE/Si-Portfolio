import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Cpu, X, ArrowRight, Bell } from 'lucide-react';
import { BlogPost, Skill } from '../../types';

interface VisitorUpdateToastProps {
  blogPosts: BlogPost[];
  skills: Skill[];
  onNavigate: (tab: string, param?: string) => void;
  onSelectPost?: (slugOrId: string) => void;
}

const DISMISS_KEY = 'johnny_siele_visitor_update_dismissed_v1';

export const VisitorUpdateToast: React.FC<VisitorUpdateToastProps> = ({
  blogPosts,
  skills,
  onNavigate,
  onSelectPost
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [updateItem, setUpdateItem] = useState<{
    type: 'blog' | 'skill';
    title: string;
    subtitle: string;
    targetId: string;
  } | null>(null);

  useEffect(() => {
    // Check if user previously dismissed toast in this session
    const isDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (isDismissed) return;

    // Pick latest blog post if available
    const latestBlog = blogPosts.find((b) => b.status === 'published');
    if (latestBlog) {
      setUpdateItem({
        type: 'blog',
        title: latestBlog.title,
        subtitle: `New deep-dive in ${latestBlog.category}`,
        targetId: latestBlog.slug || latestBlog.id || ''
      });
      // Delay entrance by 2.5 seconds so visitor is settled
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (skills.length > 0) {
      const topSkill = skills[0];
      setUpdateItem({
        type: 'skill',
        title: `${topSkill.name}`,
        subtitle: `Mastered skill in ${topSkill.category}`,
        targetId: topSkill.name
      });
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [blogPosts, skills]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  const handleClick = () => {
    if (!updateItem) return;
    handleDismiss();
    if (updateItem.type === 'blog') {
      if (onSelectPost) {
        onSelectPost(updateItem.targetId);
      } else {
        onNavigate('blog', updateItem.targetId);
      }
    } else {
      onNavigate('skills');
    }
  };

  if (!isVisible || !updateItem) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-zinc-700 shadow-xl shadow-indigo-500/10 dark:shadow-black/60 relative overflow-hidden flex items-start gap-3 text-xs">
        {/* Accent indicator */}
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
          {updateItem.type === 'blog' ? (
            <BookOpen className="w-4 h-4" />
          ) : (
            <Cpu className="w-4 h-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>New Content Available</span>
          </div>

          <h4
            onClick={handleClick}
            className="font-bold text-zinc-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition"
          >
            {updateItem.title}
          </h4>

          <p className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">
            {updateItem.subtitle}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleClick}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{updateItem.type === 'blog' ? 'Read article' : 'View skill'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <button
              onClick={() => {
                handleDismiss();
                onNavigate(updateItem.type === 'blog' ? 'blog' : 'skills');
              }}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              Notifications
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
