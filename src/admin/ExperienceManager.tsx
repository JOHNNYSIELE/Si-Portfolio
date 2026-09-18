import React, { useState } from 'react';
import { Experience, Education } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, X, Briefcase, GraduationCap } from 'lucide-react';

interface ExperienceManagerProps {
  experience: Experience[];
  education: Education[];
  onRefresh: () => Promise<void>;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({
  experience,
  education,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  // Modal states
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'exp' | 'edu'; id: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Experience Form State
  const [expFormData, setExpFormData] = useState<Partial<Experience>>({
    organization: '',
    position: '',
    location: 'Remote',
    locationType: 'Remote',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: [],
    technologies: [],
    displayOrder: experience.length + 1
  });
  const [expBulletsText, setExpBulletsText] = useState('');
  const [expTechText, setExpTechText] = useState('');

  // Education Form State
  const [eduFormData, setEduFormData] = useState<Partial<Education>>({
    institution: '',
    qualification: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    displayOrder: education.length + 1
  });

  // Open Exp Modal
  const openExpCreate = () => {
    setExpFormData({
      organization: '',
      position: '',
      location: 'Remote',
      locationType: 'Remote',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      description: [],
      technologies: [],
      displayOrder: experience.length + 1
    });
    setExpBulletsText('');
    setExpTechText('');
    setIsExpModalOpen(true);
  };

  const openExpEdit = (item: Experience) => {
    setExpFormData({ ...item });
    setExpBulletsText(item.description?.join('\n') || '');
    setExpTechText(item.technologies?.join(', ') || '');
    setIsExpModalOpen(true);
  };

  // Open Edu Modal
  const openEduCreate = () => {
    setEduFormData({
      institution: '',
      qualification: '',
      field: '',
      startDate: '2016',
      endDate: '2020',
      description: '',
      displayOrder: education.length + 1
    });
    setIsEduModalOpen(true);
  };

  const openEduEdit = (item: Education) => {
    setEduFormData({ ...item });
    setIsEduModalOpen(true);
  };

  // Submit Exp
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expFormData.organization?.trim() || !expFormData.position?.trim()) {
      showToast('Organization and Position are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const bullets = expBulletsText
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);
      const techs = expTechText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await firestoreService.saveExperience({
        ...expFormData,
        description: bullets,
        technologies: techs
      });

      showToast('Experience entry saved', 'success');
      setIsExpModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save experience', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Edu
  const handleEduSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduFormData.institution?.trim() || !eduFormData.qualification?.trim()) {
      showToast('Institution and Qualification are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await firestoreService.saveEducation({ ...eduFormData });
      showToast('Education record saved', 'success');
      setIsEduModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save education', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'exp') {
        await firestoreService.deleteExperience(deleteTarget.id);
        showToast('Experience deleted', 'success');
      } else {
        await firestoreService.deleteEducation(deleteTarget.id);
        showToast('Education deleted', 'success');
      }
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Delete operation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Career & Education Records</h2>
          <p className="text-xs text-zinc-400">
            Manage professional roles, career milestones, degrees, and academic credentials.
          </p>
        </div>

        <button
          onClick={activeTab === 'experience' ? openExpCreate : openEduCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'experience' ? 'Add Work Role' : 'Add Degree / Cert'}</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'experience'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>Work Experience ({experience.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'education'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Education & Degrees ({education.length})</span>
        </button>
      </div>

      {/* Experience Table */}
      {activeTab === 'experience' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
                <tr>
                  <th className="py-3 px-4">Position & Company</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Current</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {experience.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{exp.position}</span>
                      <span className="text-zinc-400 font-mono">{exp.organization}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {exp.location} ({exp.locationType})
                    </td>
                    <td className="py-3 px-4">
                      {exp.isCurrent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openExpEdit(exp)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'exp', id: exp.id || '' });
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
      )}

      {/* Education Table */}
      {activeTab === 'education' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
                <tr>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Degree / Qualification</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {education.map((edu) => (
                  <tr key={edu.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-white">{edu.institution}</td>
                    <td className="py-3 px-4 text-indigo-400 font-medium">{edu.qualification}</td>
                    <td className="py-3 px-4 text-zinc-400">{edu.field}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEduEdit(edu)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'edu', id: edu.id || '' });
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
      )}

      {/* Experience Modal */}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {expFormData.id ? 'Edit Work Role' : 'Add Work Role'}
              </h3>
              <button onClick={() => setIsExpModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Position Title *</label>
                  <input
                    type="text"
                    required
                    value={expFormData.position}
                    onChange={(e) => setExpFormData({ ...expFormData, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={expFormData.organization}
                    onChange={(e) => setExpFormData({ ...expFormData, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Location</label>
                  <input
                    type="text"
                    value={expFormData.location}
                    onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Start Date</label>
                  <input
                    type="text"
                    value={expFormData.startDate}
                    onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
                    placeholder="2022-03"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">End Date</label>
                  <input
                    type="text"
                    disabled={expFormData.isCurrent}
                    value={expFormData.endDate}
                    onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
                    placeholder="2024-01"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono disabled:opacity-40 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expFormData.isCurrent}
                    onChange={(e) => setExpFormData({ ...expFormData, isCurrent: e.target.checked })}
                    className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="font-semibold text-zinc-300">Currently in this position</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">
                  Key Achievements & Responsibilities (one bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={expBulletsText}
                  onChange={(e) => setExpBulletsText(e.target.value)}
                  placeholder="Architected cloud services with PHP 8 and Redis&#10;Decreased build latency by 45%&#10;Managed team of 6 engineers"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={expTechText}
                  onChange={(e) => setExpTechText(e.target.value)}
                  placeholder="PHP 8, Docker, Kubernetes, AWS, GraphQL"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isSaving ? 'Saving...' : 'Save Work Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {eduFormData.id ? 'Edit Education Record' : 'Add Degree / Certificate'}
              </h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEduSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={eduFormData.institution}
                  onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                  placeholder="Stanford University"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Degree / Qualification *</label>
                  <input
                    type="text"
                    required
                    value={eduFormData.qualification}
                    onChange={(e) => setEduFormData({ ...eduFormData, qualification: e.target.value })}
                    placeholder="B.S. / M.S."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Field of Study</label>
                  <input
                    type="text"
                    value={eduFormData.field}
                    onChange={(e) => setEduFormData({ ...eduFormData, field: e.target.value })}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Start Year</label>
                  <input
                    type="text"
                    value={eduFormData.startDate}
                    onChange={(e) => setEduFormData({ ...eduFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">End Year / Completion</label>
                  <input
                    type="text"
                    value={eduFormData.endDate}
                    onChange={(e) => setEduFormData({ ...eduFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description / Honors</label>
                <textarea
                  rows={3}
                  value={eduFormData.description}
                  onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                  placeholder="Specialization in distributed computing, Magna Cum Laude..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isSaving ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmLabel="Delete Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
