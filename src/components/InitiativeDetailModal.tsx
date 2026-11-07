import React, { useState, useEffect, useRef } from 'react';
import { ResearchInitiative, StakeholderContact } from '../types';
import { getStatusColorClass, getPriorityColorClass, formatRelativeTime } from '../utils/helpers';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Check, 
  AlertCircle,
  HelpCircle,
  Users,
  Calendar,
  Award,
  Layers,
  FileText
} from 'lucide-react';

interface InitiativeDetailModalProps {
  initiative: ResearchInitiative;
  statusOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  teamOptions: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ResearchInitiative>) => void;
  onDelete: (id: string) => void;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  initiative,
  statusOptions,
  priorityOptions,
  categoryOptions,
  teamOptions,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  // Working draft state
  const [formData, setFormData] = useState<ResearchInitiative>(initiative);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'definition' | 'stakeholders' | 'planning' | 'outcomes'>('basic');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync when initiative prop changes
  useEffect(() => {
    setFormData(initiative);
    setHasUnsavedChanges(false);
    setShowSavedFeedback(false);
  }, [initiative]);

  // Keyboard shortcut: Cmd/Ctrl + S to save, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape' && !showDeleteConfirm) {
        handleCloseWithCheck();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, formData, hasUnsavedChanges, showDeleteConfirm]);

  const handleChange = (field: keyof ResearchInitiative, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    setShowSavedFeedback(false);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Initiative title cannot be empty.');
      return;
    }
    onSave(formData.id, formData);
    setHasUnsavedChanges(false);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 2500);
  };

  const handleCloseWithCheck = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to save before closing?')) {
        handleSave();
      }
    }
    onClose();
  };

  // Add Question to list
  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const currentQuestions = formData.researchQuestions || [];
    handleChange('researchQuestions', [...currentQuestions, newQuestionText.trim()]);
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (index: number) => {
    const currentQuestions = formData.researchQuestions || [];
    const updated = currentQuestions.filter((_, i) => i !== index);
    handleChange('researchQuestions', updated);
  };

  // Add Stakeholder contact
  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newContact: StakeholderContact = {
      id: `contact-${Date.now()}`,
      name: newContactName.trim(),
      role: newContactRole.trim(),
      email: newContactEmail.trim()
    };
    const currentContacts = formData.stakeholderContacts || [];
    handleChange('stakeholderContacts', [...currentContacts, newContact]);
    setNewContactName('');
    setNewContactRole('');
    setNewContactEmail('');
  };

  const handleRemoveContact = (id: string) => {
    const currentContacts = formData.stakeholderContacts || [];
    handleChange('stakeholderContacts', currentContacts.filter(c => c.id !== id));
  };

  if (!isOpen) return null;

  const statusColors = getStatusColorClass(formData.status);
  const priorityColors = getPriorityColorClass(formData.priority);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Research Brief
            </span>
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertCircle className="w-3 h-3" />
                Unsaved changes
              </span>
            ) : showSavedFeedback ? (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3" />
                Saved
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Last updated {formatRelativeTime(formData.updatedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md shadow-xs transition ${
                hasUnsavedChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-300'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save (⌘S)</span>
            </button>
            <button
              onClick={handleCloseWithCheck}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Header: Editable Title and Core Pills */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white">
          <div className="space-y-3">
            {/* Title Input */}
            <input
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Initiative Title"
              className="w-full text-xl sm:text-2xl font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition pb-1"
            />

            {/* Quick Pickers Bar: Status, Priority, Category */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Status Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={formData.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${statusColors.badge}`}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Priority Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Priority:</span>
                <select
                  value={formData.priority || 'Not Set'}
                  onChange={e => handleChange('priority', e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${priorityColors.badge}`}
                >
                  {priorityOptions.map(opt => (
                    <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Category Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Category:</span>
                <select
                  value={formData.category || ''}
                  onChange={e => handleChange('category', e.target.value)}
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">No Category</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Research Owner */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Owner:</span>
                <input
                  type="text"
                  value={formData.researchOwner || ''}
                  onChange={e => handleChange('researchOwner', e.target.value)}
                  placeholder="e.g. Senior UX Researcher"
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 w-44 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-3 overflow-x-auto">
            <button
              onClick={() => setActiveSection('basic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                activeSection === 'basic'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              1. Basic Info
            </button>

            <button
              onClick={() => setActiveSection('definition')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                activeSection === 'definition'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              2. Research Definition
              {(formData.researchQuestions?.length || 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-200 text-indigo-800">
                  {formData.researchQuestions?.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('stakeholders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                activeSection === 'stakeholders'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              3. Stakeholders
              {(formData.stakeholderContacts?.length || 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-200 text-indigo-800">
                  {formData.stakeholderContacts?.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('planning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                activeSection === 'planning'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              4. Planning & Timeline
            </button>

            <button
              onClick={() => setActiveSection('outcomes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                activeSection === 'outcomes'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              5. Outcomes & Findings
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* SECTION 1: BASIC INFORMATION */}
          {activeSection === 'basic' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Research Objective
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  What strategic business goal or product decision will this research inform?
                </p>
                <textarea
                  rows={3}
                  value={formData.objective || ''}
                  onChange={e => handleChange('objective', e.target.value)}
                  placeholder="e.g., Define baseline user satisfaction and identify core friction in the ordering journey..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Problem / Opportunity
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  What specific retailer or distributor pain point are we investigating?
                </p>
                <textarea
                  rows={4}
                  value={formData.problemOpportunity || ''}
                  onChange={e => handleChange('problemOpportunity', e.target.value)}
                  placeholder="e.g., Retailers with app interaction abandon before placing an order. Need to understand checkout blockers..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: RESEARCH DEFINITION */}
          {activeSection === 'definition' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Research Questions List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Research Questions
                  </label>
                  <span className="text-xs text-slate-400">Add multiple questions</span>
                </div>

                {/* Add new question box */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={e => setNewQuestionText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddQuestion();
                      }
                    }}
                    placeholder="Type a research question and press Enter..."
                    className="flex-1 text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                  >
                    + Add Question
                  </button>
                </div>

                {/* Questions List */}
                {(!formData.researchQuestions || formData.researchQuestions.length === 0) ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                    No research questions added yet. Add the primary questions you need answered.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.researchQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg group hover:border-slate-300 transition"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-3">
                          <span className="text-xs font-bold text-indigo-600 mt-0.5">Q{idx + 1}.</span>
                          <span className="text-sm text-slate-800 leading-snug">{q}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition shrink-0"
                          title="Remove question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Research Method & Target User Segment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Research Method
                  </label>
                  <input
                    type="text"
                    value={formData.researchMethod || ''}
                    onChange={e => handleChange('researchMethod', e.target.value)}
                    placeholder="e.g., In-depth Interviews, Usability Testing, Log Analysis"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target User Segment
                  </label>
                  <input
                    type="text"
                    value={formData.targetUserSegment || ''}
                    onChange={e => handleChange('targetUserSegment', e.target.value)}
                    placeholder="e.g., Retailers with 1+ delivered orders, New Telesales leads"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Trigger & Existing Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Research Trigger
                  </label>
                  <input
                    type="text"
                    value={formData.researchTrigger || ''}
                    onChange={e => handleChange('researchTrigger', e.target.value)}
                    placeholder="e.g., High rate of customer support calls, Barook launch"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Existing Evidence
                  </label>
                  <input
                    type="text"
                    value={formData.existingEvidence || ''}
                    onChange={e => handleChange('existingEvidence', e.target.value)}
                    placeholder="e.g., 2500 Telesales calls analysis, Mixpanel funnel report"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Research Scope */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Research Scope
                </label>
                <textarea
                  rows={2}
                  value={formData.researchScope || ''}
                  onChange={e => handleChange('researchScope', e.target.value)}
                  placeholder="In-scope vs out-of-scope boundaries (e.g., Focus only on Direct Delivery flow; exclude marketplace orders)..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* SECTION 3: STAKEHOLDER INFORMATION */}
          {activeSection === 'stakeholders' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Team */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Stakeholder Team
                  </label>
                  <select
                    value={formData.primaryStakeholderTeam || ''}
                    onChange={e => handleChange('primaryStakeholderTeam', e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Select Primary Team...</option>
                    {teamOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Decision Maker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Decision Maker
                  </label>
                  <input
                    type="text"
                    value={formData.decisionMaker || ''}
                    onChange={e => handleChange('decisionMaker', e.target.value)}
                    placeholder="e.g., Head of Product, Commercial Director"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Stakeholder Contacts (Multiple) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stakeholder Contacts
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Add team members who need to be consulted or kept updated.
                </p>

                {/* Inline contact creator */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      placeholder="Name *"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={newContactRole}
                      onChange={e => setNewContactRole(e.target.value)}
                      placeholder="Role / Team (e.g. Telesales Lead)"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={e => setNewContactEmail(e.target.value)}
                      placeholder="Email"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddContact}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
                    >
                      + Add Stakeholder
                    </button>
                  </div>
                </div>

                {/* List of Contacts */}
                {(!formData.stakeholderContacts || formData.stakeholderContacts.length === 0) ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                    No stakeholder contacts added yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {formData.stakeholderContacts.map(c => (
                      <div key={c.id} className="p-3 bg-white flex items-center justify-between hover:bg-slate-50 transition">
                        <div>
                          <span className="text-sm font-semibold text-slate-900">{c.name}</span>
                          {c.role && (
                            <span className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {c.role}
                            </span>
                          )}
                          {c.email && (
                            <span className="ml-2 text-xs text-slate-400">
                              {c.email}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveContact(c.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                          title="Remove stakeholder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: PLANNING & TIMELINE */}
          {activeSection === 'planning' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={e => handleChange('startDate', e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Date / Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate || ''}
                    onChange={e => handleChange('targetDate', e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Effort Estimate
                  </label>
                  <input
                    type="text"
                    value={formData.effortEstimate || ''}
                    onChange={e => handleChange('effortEstimate', e.target.value)}
                    placeholder="e.g. 2 weeks, 1 Sprint, Medium"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dependencies
                  </label>
                  <input
                    type="text"
                    value={formData.dependencies || ''}
                    onChange={e => handleChange('dependencies', e.target.value)}
                    placeholder="e.g. Data team query export, Telesales recording access"
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: OUTCOMES & FINDINGS */}
          {activeSection === 'outcomes' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Expected Deliverables */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Deliverables
                </label>
                <input
                  type="text"
                  value={formData.expectedDeliverables || ''}
                  onChange={e => handleChange('expectedDeliverables', e.target.value)}
                  placeholder="e.g. Insights Presentation, Journey Map, Opportunity Backlog"
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Research Documentation Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Research Documentation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.documentationLink || ''}
                    onChange={e => handleChange('documentationLink', e.target.value)}
                    placeholder="https://drive.google.com/... or https://figma.com/..."
                    className="flex-1 text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.documentationLink && (
                    <a
                      href={formData.documentationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Findings & Insights
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Core qualitative discoveries, user quotes, and quantitative metrics gathered.
                </p>
                <textarea
                  rows={4}
                  value={formData.keyFindings || ''}
                  onChange={e => handleChange('keyFindings', e.target.value)}
                  placeholder="Record summary of research discoveries here..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Product Decisions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Decisions
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  How did this research change the roadmap, UI designs, or business logic?
                </p>
                <textarea
                  rows={3}
                  value={formData.productDecisions || ''}
                  onChange={e => handleChange('productDecisions', e.target.value)}
                  placeholder="Decisions taken by product and business teams based on this research..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Notes & Scratchpad */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notes & Scratchpad
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={e => handleChange('notes', e.target.value)}
                  placeholder="Freeform thoughts, meeting logs, or reminders..."
                  className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Initiative</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCloseWithCheck}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">Delete this initiative?</h4>
            <p className="text-sm text-slate-600 mt-2">
              "{formData.title}" will be permanently removed from your research backlog.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(formData.id);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
