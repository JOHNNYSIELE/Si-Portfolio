import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  BookOpen,
  Cpu,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { BlogPost, Skill } from '../../types';
import { firestoreService } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';

interface NotificationCenterProps {
  blogPosts: BlogPost[];
  skills: Skill[];
  onNavigate: (tab: string, param?: string) => void;
  onSelectPost?: (slugOrId: string) => void;
}

interface NotificationItem {
  id: string;
  type: 'blog' | 'skill';
  title: string;
  subtitle: string;
  date: string;
  targetId: string;
  tag?: string;
  isNew?: boolean;
}

const STORAGE_KEY = 'johnny_siele_read_notifications_v1';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  blogPosts,
  skills,
  onNavigate,
  onSelectPost
}) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blog' | 'skill' | 'subscribe'>('all');
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Subscription Form State inside Notification Center
  const [subEmail, setSubEmail] = useState('');
  const [subNotifyBlogs, setSubNotifyBlogs] = useState(true);
  const [subNotifySkills, setSubNotifySkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Check Web Notifications permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserAlertsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Construct Notification items from published blogs & skills
  const notifications: NotificationItem[] = useMemo(() => {
    const items: NotificationItem[] = [];

    // Add published blog posts
    const publishedBlogs = blogPosts.filter((b) => b.status === 'published');
    publishedBlogs.slice(0, 6).forEach((post, index) => {
      items.push({
        id: `blog_${post.id || post.slug}`,
        type: 'blog',
        title: post.title,
        subtitle: post.excerpt || `Technical article in ${post.category}`,
        date: post.publishedAt || 'Recent',
        targetId: post.slug || post.id || '',
        tag: post.category,
        isNew: index < 2 // Mark newest 2 as "NEW"
      });
    });

    // Add top skills (prioritizing Cloud, Backend, and high proficiency)
    const featuredSkills = [...skills]
      .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
      .slice(0, 6);

    featuredSkills.forEach((s, index) => {
      items.push({
        id: `skill_${s.id || s.name}`,
        type: 'skill',
        title: `Skill: ${s.name}`,
        subtitle: `${s.levelLabel || 'Proficient'} (${s.proficiency || 85}%) in ${s.category}`,
        date: 'Active Proficiency',
        targetId: s.name,
        tag: s.category,
        isNew: index < 2
      });
    });

    return items;
  }, [blogPosts, skills]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch (e) {
      console.warn('localStorage error', e);
    }
    showToast('All notifications marked as read', 'info');
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      const updated = [...readIds, item.id];
      setReadIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage error', e);
      }
    }
    setIsOpen(false);

    if (item.type === 'blog') {
      if (onSelectPost) {
        onSelectPost(item.targetId);
      } else {
        onNavigate('blog', item.targetId);
      }
    } else if (item.type === 'skill') {
      onNavigate('skills');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await firestoreService.addSubscriber(subEmail, subNotifyBlogs, subNotifySkills);
      showToast(res.message, 'success');
      setSubEmail('');
      setActiveFilter('all');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestBrowserAlerts = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setBrowserAlertsEnabled(true);
          showToast('Browser notifications enabled for technical updates!', 'success');
          new Notification("Johnny Siele's Portfolio", {
            body: 'You will now receive desktop notifications on new blog posts and skill updates!',
            icon: '/favicon.ico'
          });
        } else {
          showToast('Notification permission was declined.', 'info');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      showToast('Desktop notifications not supported in this browser.', 'info');
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'blog') return notifications.filter((n) => n.type === 'blog');
    if (activeFilter === 'skill') return notifications.filter((n) => n.type === 'skill');
    return notifications;
  }, [notifications, activeFilter]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        aria-label="Notifications"
        title="Visitor Notifications & Updates"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-900/10 dark:shadow-black/50 z-50 overflow-hidden flex flex-col text-xs">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-white text-sm">
                Updates & Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium cursor-pointer"
                >
                  Mark read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-3 py-1.5 bg-white dark:bg-zinc-900 gap-1 overflow-x-auto text-[11px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('blog')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'blog'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3 h-3 text-indigo-500" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => setActiveFilter('skill')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'skill'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3 h-3 text-sky-500" />
              <span>Skills</span>
            </button>
            <button
              onClick={() => setActiveFilter('subscribe')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'subscribe'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Subscribe</span>
            </button>
          </div>

          {/* List or Subscribe Form */}
          {activeFilter === 'subscribe' ? (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-xs">
                  Visitor Email Notifications
                </h4>
                <p className="text-zinc-500 leading-relaxed text-[11px]">
                  Get immediate email notifications whenever Johnny writes a new deep-dive architectural article or updates technical skills.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />

                <div className="space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={subNotifyBlogs}
                      onChange={(e) => setSubNotifyBlogs(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Notify on new technical blog posts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={subNotifySkills}
                      onChange={(e) => setSubNotifySkills(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Notify on newly acquired skills & frameworks</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!subNotifyBlogs && !subNotifySkills)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? 'Registering...' : 'Subscribe to Notifications'}</span>
                </button>
              </form>

              {/* Browser Desktop Push Notification Toggle */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={requestBrowserAlerts}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{browserAlertsEnabled ? 'Browser alerts enabled' : 'Enable browser alerts'}</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${browserAlertsEnabled ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs">
                  No notifications in this category.
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const isRead = readIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition cursor-pointer flex items-start gap-3 ${
                        isRead ? 'opacity-70' : 'bg-indigo-50/20 dark:bg-indigo-950/10'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          item.type === 'blog'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {item.type === 'blog' ? (
                          <BookOpen className="w-4 h-4" />
                        ) : (
                          <Cpu className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-zinc-900 dark:text-white truncate block">
                            {item.title}
                          </span>
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </div>

                        <p className="text-zinc-500 dark:text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
                          {item.subtitle}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5">
                          {item.tag && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">
                              {item.tag}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {item.date}
                          </span>
                          {item.isNew && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[9px]">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0 self-center" />
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Footer Quick Action */}
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="font-mono">Johnny Siele Portfolio Engine</span>
            <button
              onClick={() => {
                setActiveFilter('subscribe');
              }}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Configure Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
