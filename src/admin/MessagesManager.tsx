import React, { useState } from 'react';
import { Message } from '../types';
import { firestoreService } from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  X,
  ExternalLink,
  Reply,
  Inbox
} from 'lucide-react';

interface MessagesManagerProps {
  messages: Message[];
  onRefresh: () => Promise<void>;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({ messages, onRefresh }) => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = messages.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread' && msg.id) {
      try {
        await firestoreService.updateMessageStatus(msg.id, 'read');
        await onRefresh();
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await firestoreService.updateMessageStatus(id, newStatus);
      showToast(`Message marked as ${newStatus}`, 'success');
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await firestoreService.deleteMessage(deleteTargetId);
      showToast('Message deleted', 'success');
      setDeleteModalOpen(false);
      if (selectedMessage?.id === deleteTargetId) {
        setSelectedMessage(null);
      }
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Client Inquiries & Messages</h2>
          <p className="text-xs text-zinc-400">
            Review and respond to messages submitted through the portfolio contact form.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
          {(['all', 'unread', 'read', 'replied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium cursor-pointer transition ${
                filterStatus === status
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono bg-zinc-900/80">
              <tr>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject & Preview</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No messages found under this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-zinc-800/40 transition cursor-pointer ${
                      msg.status === 'unread' ? 'bg-indigo-950/20' : ''
                    }`}
                    onClick={() => handleOpenMessage(msg)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{msg.name}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">{msg.email}</span>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <span className="font-medium text-white block truncate">{msg.subject}</span>
                      <span className="text-zinc-400 text-[11px] truncate block">
                        {msg.message}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {msg.createdAt
                        ? new Date(
                            msg.createdAt.seconds
                              ? msg.createdAt.seconds * 1000
                              : msg.createdAt
                          ).toLocaleDateString()
                        : 'Recent'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.status === 'unread'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : msg.status === 'replied'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenMessage(msg)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                        title="View Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTargetId(msg.id || null);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete Message"
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-indigo-400 font-semibold">
                  Inquiry Details
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">From:</span>
                <span className="font-semibold text-white">{selectedMessage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-mono text-indigo-400 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="uppercase font-mono font-bold text-zinc-300">
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 font-mono uppercase">
                Full Message Content
              </label>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleToggleStatus(
                      selectedMessage.id!,
                      selectedMessage.status === 'read' ? 'unread' : 'read'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                >
                  Mark as {selectedMessage.status === 'read' ? 'Unread' : 'Read'}
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedMessage.id!, 'replied')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 cursor-pointer"
                >
                  Mark as Replied
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
              >
                <Reply className="w-4 h-4" />
                <span>Reply via Mail</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Message"
        message="Are you sure you want to permanently remove this message?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
