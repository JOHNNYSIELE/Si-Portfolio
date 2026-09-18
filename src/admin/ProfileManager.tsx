import React, { useState } from 'react';
import { Profile } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Save, User, Mail, MapPin, Download, CheckCircle2, Award, Plus, Trash2 } from 'lucide-react';

interface ProfileManagerProps {
  profile: Profile;
  onRefresh: () => Promise<void>;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ profile, onRefresh }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [aboutStoryText, setAboutStoryText] = useState(
    formData.aboutStory?.join('\n\n') || formData.bio || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleHighlightChange = (index: number, field: string, val: string) => {
    const updated = [...(formData.highlights || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, highlights: updated });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [
        ...(formData.highlights || []),
        { title: 'Milestone Title', value: '100+', description: 'Brief benchmark metric' }
      ]
    });
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const paragraphs = aboutStoryText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: Profile = {
        ...formData,
        aboutStory: paragraphs
      };

      await firestoreService.updateProfile(payload);
      showToast('Profile & CV details updated successfully', 'success');
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Profile & CV Configuration</h2>
          <p className="text-xs text-zinc-400">
            Edit your professional biography, avatar, contact credentials, and downloadable CV link.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Basic Identity Box */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3">
          Core Identity & Headlines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Professional Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Hero Headline (Punchline)</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
          />
        </div>

        {/* Avatar URL with preview */}
        <div className="space-y-2">
          <label className="font-semibold text-zinc-300">Avatar Image URL *</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
              <ImageWithFallback
                src={formData.avatarUrl}
                alt={formData.fullName}
                className="w-full h-full object-cover"
                fallbackText={formData.fullName}
              />
            </div>
            <input
              type="text"
              required
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Short Bio (Hero section summary)</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">
            About Me Narrative Story (Separate paragraphs with double newlines)
          </label>
          <textarea
            rows={7}
            value={aboutStoryText}
            onChange={(e) => setAboutStoryText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* Contact & Availability */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3">
          Contact Details & Availability
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Downloadable CV / Resume Link</label>
            <input
              type="text"
              value={formData.resumeUrl || ''}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.availableForHire}
              onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
            />
            <span className="font-semibold text-zinc-300">
              Display "Available for Hire" badge on public portfolio
            </span>
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3">
          Social & Profile Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">GitHub Profile URL</label>
            <input
              type="url"
              value={formData.socialLinks?.github || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value }
                })
              }
              placeholder="https://github.com/johnnysiele"
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">LinkedIn Profile URL</label>
            <input
              type="url"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })
              }
              placeholder="https://linkedin.com/in/johnnysiele"
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Twitter / X URL</label>
            <input
              type="url"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })
              }
              placeholder="https://x.com/johnnysiele"
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Website URL</label>
            <input
              type="url"
              value={formData.socialLinks?.website || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, website: e.target.value }
                })
              }
              placeholder="https://johnnysiele.dev"
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Benchmarks & Highlights */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-white">Career Milestones & Metric Cards</h3>
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.highlights?.map((hl, i) => (
            <div key={i} className="flex gap-3 items-center bg-zinc-800/60 p-3 rounded-xl border border-zinc-700">
              <input
                type="text"
                value={hl.value}
                onChange={(e) => handleHighlightChange(i, 'value', e.target.value)}
                placeholder="Value (e.g. 10+)"
                className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-bold text-center"
              />
              <input
                type="text"
                value={hl.title}
                onChange={(e) => handleHighlightChange(i, 'title', e.target.value)}
                placeholder="Title (e.g. Years of Experience)"
                className="w-48 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
              />
              <input
                type="text"
                value={hl.description}
                onChange={(e) => handleHighlightChange(i, 'description', e.target.value)}
                placeholder="Description / Context"
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="p-1.5 text-zinc-400 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
