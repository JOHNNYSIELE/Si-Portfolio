import React, { useState } from 'react';
import { Skill } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, X, Cpu, Star } from 'lucide-react';

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => Promise<void>;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: 'Backend',
    proficiency: 90,
    levelLabel: 'Expert',
    description: '',
    isTopSkill: false,
    displayOrder: skills.length + 1
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: 'Backend',
      proficiency: 90,
      levelLabel: 'Expert',
      description: '',
      isTopSkill: false,
      displayOrder: skills.length + 1
    });
    setSelectedSkillId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setSelectedSkillId(skill.id || null);
    setFormData({ ...skill });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Skill name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Skill> = { ...formData };
      if (selectedSkillId) {
        payload.id = selectedSkillId;
      }
      await firestoreService.saveSkill(payload);
      showToast(selectedSkillId ? 'Skill updated' : 'Skill created', 'success');
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save skill', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSkillId) return;
    try {
      await firestoreService.deleteSkill(selectedSkillId);
      showToast('Skill deleted', 'success');
      setDeleteModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete skill', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Skills Matrix Management</h2>
          <p className="text-xs text-zinc-400">
            Control technical proficiencies, skill categories, and primary day-to-day technologies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Skills Grid/Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
              <tr>
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Top Skill</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{skill.name}</span>
                    {skill.description && (
                      <span className="block text-zinc-400 text-[11px] truncate max-w-xs">
                        {skill.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-400">{skill.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="font-mono text-zinc-400">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-300">{skill.levelLabel}</td>
                  <td className="py-3 px-4">
                    {skill.isTopSkill ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Primary
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSkillId(skill.id || null);
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
                {selectedSkillId ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PHP 8+ / Laravel / Symfony"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  >
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Database">Database</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Design & Tools">Design & Tools</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Level Label</label>
                  <input
                    type="text"
                    value={formData.levelLabel}
                    onChange={(e) => setFormData({ ...formData, levelLabel: e.target.value })}
                    placeholder="Expert / Advanced"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-zinc-300">
                  <label>Proficiency ({formData.proficiency}%)</label>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description / Focus Area</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Modern typed features, attributes, match expressions..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTopSkill}
                    onChange={(e) => setFormData({ ...formData, isTopSkill: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="font-semibold text-zinc-300">Mark as Core Top Skill</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Skill'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Skill"
        message="Are you sure you want to remove this skill from the portfolio?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
