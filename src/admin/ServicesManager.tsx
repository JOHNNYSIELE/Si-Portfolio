import React, { useState } from 'react';
import { Service } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, X, Sliders } from 'lucide-react';

interface ServicesManagerProps {
  services: Service[];
  onRefresh: () => Promise<void>;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({ services, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    iconName: 'server',
    features: [],
    displayOrder: services.length + 1,
    featured: true
  });
  const [featuresText, setFeaturesText] = useState('');

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      iconName: 'server',
      features: [],
      displayOrder: services.length + 1,
      featured: true
    });
    setFeaturesText('');
    setSelectedServiceId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedServiceId(service.id || null);
    setFormData({ ...service });
    setFeaturesText(service.features?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) {
      showToast('Title and description are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const featuresList = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload: Partial<Service> = {
        ...formData,
        features: featuresList
      };

      if (selectedServiceId) {
        payload.id = selectedServiceId;
      }

      await firestoreService.saveService(payload);
      showToast('Service saved successfully', 'success');
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedServiceId) return;
    try {
      await firestoreService.deleteService(selectedServiceId);
      showToast('Service removed', 'success');
      setDeleteModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Services Management</h2>
          <p className="text-xs text-zinc-400">
            Define contract offerings, technical consulting packages, and deliverables.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
              <tr>
                <th className="py-3 px-4">Service Title</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{srv.title}</span>
                    <span className="text-zinc-400 text-[11px] truncate max-w-sm block">
                      {srv.description}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-400">{srv.iconName}</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {srv.features?.length || 0} items
                  </td>
                  <td className="py-3 px-4 font-mono">{srv.displayOrder || 1}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedServiceId(srv.id || null);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {selectedServiceId ? 'Edit Service' : 'Create Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Icon</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  >
                    <option value="server">Server / Infrastructure</option>
                    <option value="layout">Layout / Full Stack</option>
                    <option value="sliders">Sliders / Architecture</option>
                    <option value="shield">Shield / Security</option>
                    <option value="cloud">Cloud / DevOps</option>
                  </select>
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
                <label className="font-semibold text-zinc-300">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">
                  Included Features / Deliverables (one per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Architectural review & RFC documentation&#10;Containerized deployment pipelines&#10;Database migration & indexing strategy"
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
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
