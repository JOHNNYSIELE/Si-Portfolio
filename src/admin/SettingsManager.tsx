import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import {
  Save,
  Sparkles,
  Database,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import { firebaseConfig } from '../config/firebase';

interface SettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => Promise<void>;
  onSeedDatabase: () => void;
  isSeeding: boolean;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onRefresh,
  onSeedDatabase,
  isSeeding
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await firestoreService.updateSettings(formData);
      showToast('Site settings updated in Firestore', 'success');
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const data = await firestoreService.exportAllData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Database backup downloaded as JSON', 'success');
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">System Settings & Data Sync</h2>
          <p className="text-xs text-zinc-400">
            Configure site metadata, manage Firebase Firestore sync, and backup portfolio content.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3">
          Site Meta & Brand Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Website Title</label>
            <input
              type="text"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Contact Route Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Meta SEO Description</label>
          <textarea
            rows={2}
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Public Footer Notice</label>
          <input
            type="text"
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
          />
        </div>
      </form>

      {/* Database Management & Seeding */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Firestore Database Operations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Seed / Reseed Initial Content</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Populates Firestore with comprehensive seed data for Johnny Siele (projects, blog posts, skills, gallery, and career timeline).
            </p>
            <button
              type="button"
              onClick={onSeedDatabase}
              disabled={isSeeding}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Syncing to Firestore...' : 'Run Firestore Seed'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Download className="w-4 h-4" />
              <span>Export Full Portfolio Backup</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Extracts all collections (Profile, Projects, Articles, Skills, Media, Settings, Messages) as an organized JSON snapshot.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              disabled={isExporting}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export JSON Backup'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud & Security Overview */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Firebase Environment Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-300">
          <div className="space-y-1">
            <span className="text-zinc-500 font-mono">Firebase Project ID:</span>
            <p className="font-mono text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
              {firebaseConfig.projectId}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-500 font-mono">Auth Domain:</span>
            <p className="font-mono text-white bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
              {firebaseConfig.authDomain}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            Firestore security rules (<code>firestore.rules</code>) and project schema blueprint (<code>firebase-blueprint.json</code>) are active. Public users have read access to published content, while write operations are locked to authenticated administrators.
          </span>
        </div>
      </div>
    </div>
  );
};
