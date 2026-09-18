import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Eye } from 'lucide-react';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onRefresh: () => Promise<void>;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ gallery, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Architecture',
    date: new Date().toISOString().slice(0, 7),
    tags: ['Architecture', 'Cloud'],
    featured: false,
    displayOrder: gallery.length + 1
  });
  const [tagsInput, setTagsInput] = useState('');

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      category: 'Architecture',
      date: new Date().toISOString().slice(0, 7),
      tags: ['Architecture', 'Systems'],
      featured: false,
      displayOrder: gallery.length + 1
    });
    setTagsInput('Architecture, Systems');
    setSelectedItemId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setSelectedItemId(item.id || null);
    setFormData({ ...item });
    setTagsInput(item.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.imageUrl?.trim()) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<GalleryItem> = {
        ...formData,
        tags: tagsArray
      };

      if (selectedItemId) {
        payload.id = selectedItemId;
      }

      await firestoreService.saveGalleryItem(payload);
      showToast('Gallery item saved', 'success');
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save media item', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItemId) return;
    try {
      await firestoreService.deleteGalleryItem(selectedItemId);
      showToast('Gallery item deleted', 'success');
      setDeleteModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Media Gallery Management</h2>
          <p className="text-xs text-zinc-400">
            Upload and organize architecture diagrams, interface blueprints, and technical screenshots.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 bg-zinc-800 overflow-hidden">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                fallbackText={item.title}
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white backdrop-blur-xs">
                {item.category}
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono text-[11px]">{item.date}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItemId(item.id || null);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {selectedItemId ? 'Edit Media Item' : 'Add Media Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Media Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Database Topology"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="font-semibold text-zinc-300">Date (YYYY-MM)</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-28 w-44 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
                    <ImageWithFallback
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      fallbackText="Preview"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Architecture, DevOps, Kubernetes"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isSaving ? 'Saving...' : 'Save Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Media Item"
        message="Are you sure you want to delete this media item?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
