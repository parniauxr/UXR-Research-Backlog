import React, { useState } from 'react';
import { ResearchOpportunity, ResearchInitiative } from '../types';
import { formatRelativeTime } from '../utils/helpers';
import { 
  Lightbulb, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Link as LinkIcon,
  X,
  Sparkles
} from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: ResearchOpportunity[];
  initiatives: ResearchInitiative[];
  onCreateOpportunity: (data: {
    title: string;
    description?: string;
    status?: string;
    relatedInitiativeId?: string;
  }) => void;
  onUpdateOpportunity: (id: string, updates: Partial<ResearchOpportunity>) => void;
  onDeleteOpportunity: (id: string) => void;
  onConvertOpportunity: (id: string) => void;
  onOpenInitiativeById: (initiativeId: string) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  initiatives,
  onCreateOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onConvertOpportunity,
  onOpenInitiativeById
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<ResearchOpportunity | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Idea');
  const [relatedInitiativeId, setRelatedInitiativeId] = useState('');

  const statusOptions = ['Idea', 'Under Review', 'Validated', 'Converted', 'Archived'];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Idea');
    setRelatedInitiativeId('');
    setEditingOpp(null);
    setIsAddModalOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (opp: ResearchOpportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setDescription(opp.description || '');
    setStatus(opp.status || 'Idea');
    setRelatedInitiativeId(opp.relatedInitiativeId || '');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingOpp) {
      onUpdateOpportunity(editingOpp.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        relatedInitiativeId: relatedInitiativeId || undefined
      });
    } else {
      onCreateOpportunity({
        title: title.trim(),
        description: description.trim(),
        status,
        relatedInitiativeId: relatedInitiativeId || undefined
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Opportunities</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">
              {opportunities.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Lightweight repository for emerging user problems, untested hunches, and unshaped discovery ideas.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Overview Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong>Continuous Discovery Incubator:</strong> Opportunities do not automatically enter the backlog. When a research problem matures and requires structured scoping, use the <strong>"Convert to Initiative"</strong> action to seamlessly transfer it into your primary research backlog.
        </div>
      </div>

      {/* Opportunities List / Cards */}
      {opportunities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
            <Lightbulb className="w-6 h-6" />
          </div>
          <p className="text-slate-800 font-semibold text-base">No research opportunities yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Log raw user pain points, unverified stakeholder hypotheses, or follow-up questions from sales and support calls.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
          >
            + Add First Opportunity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map(opp => {
            const relatedInit = initiatives.find(i => i.id === opp.relatedInitiativeId);
            const convertedInit = initiatives.find(i => i.id === opp.convertedToInitiativeId);
            const isConverted = !!opp.convertedToInitiativeId || opp.status === 'Converted';

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isConverted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : opp.status === 'Under Review'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : opp.status === 'Validated'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {opp.status || 'Idea'}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(opp)}
                        title="Edit opportunity"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(opp.id)}
                        title="Delete opportunity"
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    {opp.title}
                  </h3>

                  {opp.description && (
                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  )}

                  {/* Related Initiative Link */}
                  {relatedInit && (
                    <div 
                      onClick={() => onOpenInitiativeById(relatedInit.id)}
                      className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer p-1.5 rounded bg-indigo-50/50 hover:bg-indigo-50 transition"
                    >
                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Linked: {relatedInit.title}</span>
                    </div>
                  )}

                  {/* Converted Indicator */}
                  {convertedInit && (
                    <div 
                      onClick={() => onOpenInitiativeById(convertedInit.id)}
                      className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 cursor-pointer p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-medium">Converted into: {convertedInit.title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatRelativeTime(opp.updatedAt)}</span>

                  {!isConverted ? (
                    <button
                      onClick={() => onConvertOpportunity(opp.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-md transition shadow-xs"
                      title="Convert this opportunity into a formal Backlog Initiative"
                    >
                      <span>Convert to Initiative</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      In Backlog
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingOpp ? 'Edit Opportunity' : 'New Research Opportunity'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Telesales complaints regarding product substitutions..."
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Context, user quote, or preliminary observations..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status (Optional)
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Related Initiative (Optional)
                  </label>
                  <select
                    value={relatedInitiativeId}
                    onChange={e => setRelatedInitiativeId(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">None</option>
                    {initiatives.map(i => (
                      <option key={i.id} value={i.id}>{i.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition"
                >
                  {editingOpp ? 'Save Changes' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">Delete this opportunity?</h4>
            <p className="text-sm text-slate-600 mt-2">
              This opportunity idea will be removed from your discovery list.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteOpportunity(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
