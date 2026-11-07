import React, { useState } from 'react';
import { AppSettings, ResearchInitiative } from '../types';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  initiatives: ResearchInitiative[];
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => { success: boolean; message: string };
  onResetToInitial: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  initiatives,
  onUpdateSettings,
  onExportJSON,
  onImportJSON,
  onResetToInitial
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  // Status management
  const handleAddStatus = () => {
    if (!newStatus.trim()) return;
    const clean = newStatus.trim();
    if (settings.statusOptions.includes(clean)) {
      alert('Status option already exists.');
      return;
    }
    onUpdateSettings({
      statusOptions: [...settings.statusOptions, clean]
    });
    setNewStatus('');
  };

  const handleRemoveStatus = (status: string) => {
    const inUseCount = initiatives.filter(i => (i.status || '').toLowerCase() === status.toLowerCase()).length;
    if (inUseCount > 0) {
      if (!window.confirm(`Warning: ${inUseCount} initiative(s) currently use status "${status}". Remove anyway?`)) {
        return;
      }
    }
    onUpdateSettings({
      statusOptions: settings.statusOptions.filter(s => s !== status)
    });
  };

  // Category management
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const clean = newCategory.trim();
    if (settings.categoryOptions.includes(clean)) {
      alert('Category already exists.');
      return;
    }
    onUpdateSettings({
      categoryOptions: [...settings.categoryOptions, clean]
    });
    setNewCategory('');
  };

  const handleRemoveCategory = (cat: string) => {
    onUpdateSettings({
      categoryOptions: settings.categoryOptions.filter(c => c !== cat)
    });
  };

  // Team management
  const handleAddTeam = () => {
    if (!newTeam.trim()) return;
    const clean = newTeam.trim();
    if (settings.researchTeams.includes(clean)) return;
    onUpdateSettings({
      researchTeams: [...settings.researchTeams, clean]
    });
    setNewTeam('');
  };

  const handleRemoveTeam = (team: string) => {
    onUpdateSettings({
      researchTeams: settings.researchTeams.filter(t => t !== team)
    });
  };

  // Handle file import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const res = onImportJSON(content);
      setImportStatus({
        message: res.message,
        isError: !res.success
      });
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings & Workspace Config</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Customize status workflows, priority tags, research domains, and manage data backups.
        </p>
      </div>

      {/* Persistence Architecture Status Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Database & Persistence Status</h2>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Active & Persistent
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            All your research briefs, question lists, stakeholders, and findings are automatically stored in the server database (<code>data/pindis_db.json</code>) and dual-synchronized with browser LocalStorage. Data persists across reloads, browser restarts, and offline sessions.
          </p>
        </div>
      </div>

      {/* 1. Status Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Research Status Options</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stages reflecting your research lifecycle from scoping to reporting.
          </p>
        </div>

        {/* Add new status */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddStatus()}
            placeholder="Add new status (e.g., Synthesis)..."
            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddStatus}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Status list */}
        <div className="flex flex-wrap gap-2 pt-2">
          {settings.statusOptions.map(status => (
            <span
              key={status}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-lg border border-slate-200"
            >
              <span>{status}</span>
              {settings.statusOptions.length > 2 && (
                <button
                  onClick={() => handleRemoveStatus(status)}
                  className="text-slate-400 hover:text-red-600 p-0.5 transition"
                  title="Remove status"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Priority Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Priority Options</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Default priority levels for initiatives. Researcher-managed without automated scoring.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {settings.priorityOptions.map(pr => (
            <span
              key={pr}
              className={`px-3 py-1 text-xs font-medium rounded-md border ${
                pr === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                pr === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                pr === 'Low' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {pr}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Research Categories */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Research Categories / Domain Tags</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Categorize research initiatives by PinDis product pillars (Ordering, Direct Delivery, Barook, etc.).
          </p>
        </div>

        {/* Add Category */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            placeholder="Add new category tag (e.g., Pricing & Rebates)..."
            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddCategory}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {settings.categoryOptions.map(cat => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"
            >
              <Tag className="w-3 h-3 text-indigo-400" />
              <span>{cat}</span>
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="text-indigo-400 hover:text-red-600 p-0.5 transition"
                title="Remove category"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 4. Stakeholder Teams */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Stakeholder Teams</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-functional teams collaborating with PinDis UX Research.
          </p>
        </div>

        {/* Add Team */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newTeam}
            onChange={e => setNewTeam(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTeam()}
            placeholder="Add stakeholder team (e.g., Logistics)..."
            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddTeam}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Team pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {settings.researchTeams.map(team => (
            <span
              key={team}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
            >
              <span>{team}</span>
              <button
                onClick={() => handleRemoveTeam(team)}
                className="text-slate-400 hover:text-red-600 p-0.5 transition"
                title="Remove team"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 5. Backup, Export & Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Data Backup & Recovery</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download your research backlog for offline safekeeping or migrate between devices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export JSON */}
          <button
            onClick={onExportJSON}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Backlog (.json)</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs cursor-pointer transition">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import Backlog (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Reset to Initial */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Initial 10 Initiatives</span>
          </button>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            importStatus.isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {importStatus.isError ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset to Initial 10 Initiatives?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will restore the original 10 empty initiative titles from the PinDis portfolio and wipe any added custom research briefs. Type <strong>RESET</strong> below to confirm.
            </p>

            <input
              type="text"
              value={resetConfirmInput}
              onChange={e => setResetConfirmInput(e.target.value)}
              placeholder="Type RESET"
              className="mt-3 w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  setResetConfirmInput('');
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                disabled={resetConfirmInput !== 'RESET'}
                onClick={() => {
                  onResetToInitial();
                  setShowResetConfirm(false);
                  setResetConfirmInput('');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg transition"
              >
                Confirm Full Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
