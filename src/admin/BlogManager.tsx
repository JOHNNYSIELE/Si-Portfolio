import React, { useState } from 'react';
import { BlogPost } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  FileText
} from 'lucide-react';

interface BlogManagerProps {
  posts: BlogPost[];
  onRefresh: () => Promise<void>;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ posts, onRefresh }) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'write' | 'preview'>('write');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Architecture',
    tags: ['Architecture', 'PHP 8', 'Systems'],
    featuredImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date().toISOString().slice(0, 10),
    readingTimeMinutes: 5,
    status: 'published'
  });

  const [tagInput, setTagInput] = useState('');

  const openCreateModal = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Overview\n\nWrite your article in Markdown here.\n\n### Architectural Key Principles\n\n- Zero latency caching\n- Idempotent API endpoints\n\n```typescript\nconst message = "Clean architecture";\n```',
      category: 'Architecture',
      tags: ['Architecture', 'PHP', 'Performance'],
      featuredImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date().toISOString().slice(0, 10),
      readingTimeMinutes: 6,
      status: 'published'
    });
    setTagInput('Architecture, PHP, Performance');
    setSelectedPostId(null);
    setActiveEditorTab('write');
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPostId(post.id || null);
    setFormData({ ...post });
    setTagInput(post.tags?.join(', ') || '');
    setActiveEditorTab('write');
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : generatedSlug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.excerpt?.trim() || !formData.content?.trim()) {
      showToast('Title, excerpt, and markdown content are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<BlogPost> = {
        ...formData,
        tags: tagsArray,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      if (selectedPostId) {
        payload.id = selectedPostId;
      }

      await firestoreService.saveBlogPost(payload);
      showToast(selectedPostId ? 'Article updated successfully' : 'Article published to Firestore', 'success');
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      console.error('Error saving post:', err);
      showToast(err.message || 'Failed to save blog post.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPostId) return;
    try {
      await firestoreService.deleteBlogPost(selectedPostId);
      showToast('Article deleted successfully', 'success');
      setDeleteModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete article.', 'error');
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Blog CMS Management</h2>
          <p className="text-xs text-zinc-400">
            Publish engineering articles, technical analysis, and system architecture thoughts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-zinc-400">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Architecture">Architecture</option>
            <option value="Performance">Performance</option>
            <option value="Security">Security</option>
            <option value="DevOps">DevOps</option>
            <option value="Cloud">Cloud</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4">Reading Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No articles found. Click "Write New Article" to draft one.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                          <ImageWithFallback
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            fallbackText={post.title}
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-white text-sm block">{post.title}</span>
                          <span className="text-zinc-400 font-mono text-[11px] block">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-300">{post.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          post.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-700/50 text-zinc-400'
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{post.publishedAt}</td>
                    <td className="py-3 px-4 font-mono">{post.readingTimeMinutes} min</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPostId(post.id || null);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedPostId ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Architecting Distributed Microservices"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Published Date</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readingTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readingTimeMinutes: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Article Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A compelling synopsis shown on card grids and search listings..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Featured Banner Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden"
                />
              </div>

              {/* Markdown Content Editor with Live Preview Toggle */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300">
                    Article Body (Markdown Supported) *
                  </label>
                  <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('write')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        activeEditorTab === 'write'
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Write Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('preview')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        activeEditorTab === 'preview'
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {activeEditorTab === 'write' ? (
                  <textarea
                    required
                    rows={12}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Article Heading&#10;&#10;Write with standard markdown syntax, code blocks, lists, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 min-h-[250px] max-h-[350px] overflow-y-auto">
                    <MarkdownRenderer content={formData.content || '*No content written yet.*'} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="PHP 8, Microservices, Security, Redis"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden font-semibold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmLabel="Delete Article"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
