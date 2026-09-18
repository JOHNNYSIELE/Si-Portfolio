import React, { useState } from 'react';
import { Project } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Check,
  X,
  Eye,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onRefresh }) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    coverImageUrl: '',
    galleryImageUrls: [],
    technologies: [],
    category: 'Full Stack',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    completionDate: new Date().toISOString().slice(0, 7),
    displayOrder: projects.length + 1,
    status: 'published'
  });

  const [techInput, setTechInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const openCreateModal = () => {
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      galleryImageUrls: [],
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      category: 'Full Stack',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      completionDate: new Date().toISOString().slice(0, 7),
      displayOrder: projects.length + 1,
      status: 'published'
    });
    setTechInput('TypeScript, Node.js, PostgreSQL, Tailwind CSS');
    setSelectedProjectId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProjectId(project.id || null);
    setFormData({ ...project });
    setTechInput(project.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Automatically generate slug if not editing an existing custom slug
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

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImageUrls: [...(prev.galleryImageUrls || []), galleryUrlInput.trim()]
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImageUrls: (prev.galleryImageUrls || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      showToast('Title and short description are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const technologiesArray = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<Project> = {
        ...formData,
        technologies: technologiesArray,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      if (selectedProjectId) {
        payload.id = selectedProjectId;
      }

      await firestoreService.saveProject(payload);
      showToast(selectedProjectId ? 'Project updated successfully' : 'Project created in Firestore', 'success');
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      console.error('Error saving project:', err);
      showToast(err.message || 'Failed to save project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProjectId) return;
    try {
      await firestoreService.deleteProject(selectedProjectId);
      showToast('Project deleted successfully', 'success');
      setDeleteModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Projects Management</h2>
          <p className="text-xs text-zinc-400">
            Create, update, and publish showcase projects and technical case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
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
            <option value="Full Stack">Full Stack</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No projects found. Click "Add New Project" to create one.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                          <ImageWithFallback
                            src={proj.coverImageUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                            fallbackText={proj.title}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white text-sm">{proj.title}</span>
                            {proj.featured && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-400 font-mono text-[11px] block">
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-300">{proj.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          proj.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-700/50 text-zinc-400'
                        }`}
                      >
                        {proj.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{proj.displayOrder || 1}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{proj.completionDate}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProjectId(proj.id || null);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete Project"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedProjectId ? 'Edit Project' : 'Create New Project'}
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
                  <label className="font-semibold text-zinc-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Distributed Cloud Engine"
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
                    placeholder="e.g. distributed-cloud-engine"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Completion Date (YYYY-MM)</label>
                  <input
                    type="text"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    placeholder="2024-06"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Short Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise overview displayed on cards and search results..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Full Description (Markdown)</label>
                <textarea
                  rows={6}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Write full case study in Markdown (## Overview, ## Architecture, etc.)..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-hidden"
                />
                {formData.coverImageUrl && (
                  <div className="mt-2 h-28 w-44 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
                    <ImageWithFallback
                      src={formData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      fallbackText="Cover Preview"
                    />
                  </div>
                )}
              </div>

              {/* Technologies input */}
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="PHP 8, TypeScript, Docker, Redis, Tailwind CSS"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              {/* Gallery Image URLs */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="font-semibold text-zinc-300">
                  Additional Gallery / Screenshot URLs ({formData.galleryImageUrls?.length || 0})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer font-semibold"
                  >
                    Add URL
                  </button>
                </div>
                {formData.galleryImageUrls && formData.galleryImageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.galleryImageUrls.map((url, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 max-w-xs truncate"
                      >
                        <span className="truncate text-[11px]">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryUrl(i)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Live Demo / Production URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-zinc-800 gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
                    />
                    <span className="font-semibold text-zinc-300">Featured on Homepage</span>
                  </label>

                  <div className="flex items-center gap-2">
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
                    {isSaving ? 'Saving...' : 'Save Project'}
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
        title="Delete Project"
        message="Are you sure you want to delete this project from Firestore? This action cannot be undone."
        confirmLabel="Delete Project"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
