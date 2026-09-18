import React, { useState } from 'react';
import { Bell, CheckCircle2, Send, Sparkles, BookOpen, Cpu } from 'lucide-react';
import { firestoreService } from '../../services/firestoreService';
import { useToast } from '../../context/ToastContext';

interface NotificationSubscribeCardProps {
  type?: 'general' | 'blog' | 'skills';
  title?: string;
  description?: string;
}

export const NotificationSubscribeCard: React.FC<NotificationSubscribeCardProps> = ({
  type = 'general',
  title,
  description
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [notifyBlogs, setNotifyBlogs] = useState(true);
  const [notifySkills, setNotifySkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const defaultTitle =
    type === 'blog'
      ? 'Get Notified on New Technical Articles'
      : type === 'skills'
      ? 'Get Notified on New Skills & Engineering Tools'
      : 'Stay Updated on New Articles & Skills';

  const defaultDescription =
    type === 'blog'
      ? 'Subscribe to receive immediate email notifications whenever a new deep-dive architectural post is published.'
      : type === 'skills'
      ? 'Be the first to know when new cloud architectures, languages, and technical proficiencies are mastered.'
      : 'Receive instant notifications when new technical blogs or engineering skill updates are released.';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await firestoreService.addSubscriber(email, notifyBlogs, notifySkills);
      setIsSubscribed(true);
      showToast(res.message, 'success');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 dark:from-zinc-900/90 dark:via-zinc-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Visitor Notifications</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {title || defaultTitle}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description || defaultDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyBlogs}
                onChange={(e) => setNotifyBlogs(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>New Articles</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifySkills}
                onChange={(e) => setNotifySkills(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>New Skills & Stack</span>
            </label>
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-[340px]">
          {isSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <strong className="block font-semibold">Subscription Active!</strong>
                <span>You're registered to receive updates on newly published content.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || (!notifyBlogs && !notifySkills)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Notify Me'}</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                No spam ever. You can unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
