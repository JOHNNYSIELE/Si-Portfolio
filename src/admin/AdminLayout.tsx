import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  FolderGit2,
  BookOpen,
  Cpu,
  Briefcase,
  Sliders,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onViewPublicSite: () => void;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  unreadMessagesCount,
  children
}) => {
  const { userProfile, signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & CV', icon: UserCheck },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'blog', label: 'Blog CMS', icon: BookOpen },
    { id: 'skills', label: 'Skills Matrix', icon: Cpu },
    { id: 'experience', label: 'Career & Edu', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Sliders },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
    { id: 'messages', label: 'Messages Inbox', icon: Mail, badge: unreadMessagesCount },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  const handleNav = (tab: string) => {
    onSelectTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/90 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Portfolio CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="p-2 text-zinc-400 hover:text-white"
            title="View Live Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="p-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight">Johnny Siele</h2>
              <p className="text-[11px] text-zinc-400 font-mono">Portfolio CMS Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User profile info & sign out */}
        <div className="p-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="block text-xs font-semibold text-zinc-200 truncate">
                {userProfile?.displayName || 'Administrator'}
              </span>
              <span className="block text-[10px] font-mono text-zinc-500 truncate">
                {userProfile?.email}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ADMIN
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onViewPublicSite}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Site</span>
            </button>
            <button
              onClick={signOut}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/50 hover:text-rose-400 text-zinc-400 transition cursor-pointer"
              title="Sign Out of CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
};
