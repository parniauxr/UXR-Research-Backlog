import React, { useState } from 'react';
import { ResearchInitiative } from '../types';
import { X, Plus, ExternalLink } from 'lucide-react';

interface NewInitiativeModalProps {
  isOpen: boolean;
  statusOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  onClose: () => void;
  onCreate: (data: Partial<ResearchInitiative> & { title: string }, openImmediately: boolean) => void;
}

export const NewInitiativeModal: React.FC<NewInitiativeModalProps> = ({
  isOpen,
  statusOptions,
  priorityOptions,
  categoryOptions,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [priority, setPriority] = useState('Not Set');
  const [category, setCategory] = useState('');
  const [researchOwner, setResearchOwner] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (openImmediately: boolean) => {
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      status,
      priority,
      category: category || undefined,
      researchOwner: researchOwner.trim() || undefined
    }, openImmediately);

    // Reset
    setTitle('');
    setStatus('Not Started');
    setPriority('Not Set');
    setCategory('');
    setResearchOwner('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">New Research Initiative</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only title is required. You can build research details anytime later.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(false);
          }}
          className="mt-4 space-y-4"
        >
          {/* Initiative Title (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Initiative Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Retailer Barook Repayment Friction Analysis"
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
            />
          </div>

          {/* Quick optional fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {priorityOptions.map(pr => (
                  <option key={pr} value={pr}>{pr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category (Optional)
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">No Category</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Owner (Optional)
              </label>
              <input
                type="text"
                value={researchOwner}
                onChange={e => setResearchOwner(e.target.value)}
                placeholder="e.g. UX Researcher"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => handleSubmit(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 rounded-lg border border-indigo-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Create & Open Brief</span>
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Initiative</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
