import React, { useState, useEffect } from 'react';
import { 
  loadStore, 
  subscribeToStore, 
  getSaveStatus, 
  getInitiatives, 
  getOpportunities, 
  getSettings, 
  createInitiative, 
  updateInitiative, 
  deleteInitiative, 
  createOpportunity, 
  updateOpportunity, 
  deleteOpportunity, 
  convertOpportunityToInitiative, 
  updateSettings, 
  exportBackupJSON, 
  importBackupJSON, 
  resetToInitialState 
} from './services/storageService';
import { ResearchInitiative, ResearchOpportunity, AppSettings } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BacklogList } from './components/BacklogList';
import { OpportunitiesView } from './components/OpportunitiesView';
import { SettingsView } from './components/SettingsView';
import { InitiativeDetailModal } from './components/InitiativeDetailModal';
import { NewInitiativeModal } from './components/NewInitiativeModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'backlog' | 'opportunities' | 'settings'>('dashboard');

  // Application Data States
  const [initiatives, setInitiatives] = useState<ResearchInitiative[]>([]);
  const [opportunities, setOpportunities] = useState<ResearchOpportunity[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    statusOptions: [],
    priorityOptions: [],
    categoryOptions: [],
    researchTeams: []
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Modals & Drawers
  const [selectedInitiative, setSelectedInitiative] = useState<ResearchInitiative | null>(null);
  const [isNewInitiativeOpen, setIsNewInitiativeOpen] = useState(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState(false);

  // Filters passed from Dashboard to Backlog
  const [backlogInitialFilters, setBacklogInitialFilters] = useState<{
    status?: string;
    priority?: string;
  }>({});

  // Synchronize state with store
  const refreshFromStore = () => {
    setInitiatives(getInitiatives());
    setOpportunities(getOpportunities());
    setSettings(getSettings());
    setSaveStatus(getSaveStatus());

    // If detail modal is open, keep its data fresh
    setSelectedInitiative(prev => {
      if (!prev) return null;
      const found = getInitiatives().find(i => i.id === prev.id);
      return found || null;
    });
  };

  useEffect(() => {
    // Initial load
    loadStore();
    refreshFromStore();

    // Subscribe to any updates (optimistic or server sync)
    const unsubscribe = subscribeToStore(() => {
      refreshFromStore();
    });

    return () => unsubscribe();
  }, []);

  // Handlers for Initiatives
  const handleCreateInitiative = (
    data: Partial<ResearchInitiative> & { title: string },
    openImmediately: boolean = false
  ) => {
    const created = createInitiative(data);
    if (openImmediately) {
      setSelectedInitiative(created);
    }
  };

  const handleUpdateInitiative = (id: string, updates: Partial<ResearchInitiative>) => {
    const updated = updateInitiative(id, updates);
    if (updated && selectedInitiative?.id === id) {
      setSelectedInitiative(updated);
    }
  };

  const handleDeleteInitiative = (id: string) => {
    deleteInitiative(id);
    if (selectedInitiative?.id === id) {
      setSelectedInitiative(null);
    }
  };

  const handleQuickUpdateStatus = (id: string, newStatus: string) => {
    updateInitiative(id, { status: newStatus });
  };

  // Handlers for Opportunities
  const handleCreateOpportunity = (data: {
    title: string;
    description?: string;
    status?: string;
    relatedInitiativeId?: string;
  }) => {
    createOpportunity(data);
  };

  const handleUpdateOpportunity = (id: string, updates: Partial<ResearchOpportunity>) => {
    updateOpportunity(id, updates);
  };

  const handleDeleteOpportunity = (id: string) => {
    deleteOpportunity(id);
  };

  const handleConvertOpportunity = (opportunityId: string) => {
    const newInitiative = convertOpportunityToInitiative(opportunityId);
    if (newInitiative) {
      setActiveTab('backlog');
      setSelectedInitiative(newInitiative);
    }
  };

  // Handler for Exporting JSON backup
  const handleExportJSON = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pindis-ux-research-backlog-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handler for Importing JSON backup
  const handleImportJSON = (jsonStr: string) => {
    const result = importBackupJSON(jsonStr);
    refreshFromStore();
    return result;
  };

  // Handler for resetting to initial 10 initiatives
  const handleResetToInitial = () => {
    resetToInitialState();
    refreshFromStore();
    setActiveTab('backlog');
  };

  // Navigate to backlog with pre-filled filters
  const handleNavigateToBacklog = (filters?: { status?: string; priority?: string }) => {
    setBacklogInitialFilters(filters || { status: 'ALL', priority: 'ALL' });
    setActiveTab('backlog');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backlogCount={initiatives.length}
        opportunitiesCount={opportunities.length}
        onNewInitiative={() => setIsNewInitiativeOpen(true)}
        onNewOpportunity={() => {
          setActiveTab('opportunities');
          setIsNewOpportunityOpen(true);
        }}
        saveStatus={saveStatus}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            initiatives={initiatives}
            statusOptions={settings.statusOptions}
            priorityOptions={settings.priorityOptions}
            onOpenInitiative={init => setSelectedInitiative(init)}
            onNavigateToBacklog={handleNavigateToBacklog}
            onNewInitiative={() => setIsNewInitiativeOpen(true)}
          />
        )}

        {activeTab === 'backlog' && (
          <BacklogList
            initiatives={initiatives}
            statusOptions={settings.statusOptions}
            priorityOptions={settings.priorityOptions}
            categoryOptions={settings.categoryOptions}
            initialStatusFilter={backlogInitialFilters.status || 'ALL'}
            initialPriorityFilter={backlogInitialFilters.priority || 'ALL'}
            onOpenInitiative={init => setSelectedInitiative(init)}
            onNewInitiative={() => setIsNewInitiativeOpen(true)}
            onQuickUpdateStatus={handleQuickUpdateStatus}
            onDeleteInitiative={handleDeleteInitiative}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            initiatives={initiatives}
            onCreateOpportunity={handleCreateOpportunity}
            onUpdateOpportunity={handleUpdateOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
            onConvertOpportunity={handleConvertOpportunity}
            onOpenInitiativeById={id => {
              const item = initiatives.find(i => i.id === id);
              if (item) {
                setSelectedInitiative(item);
              }
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            initiatives={initiatives}
            onUpdateSettings={updates => {
              updateSettings(updates);
              refreshFromStore();
            }}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onResetToInitial={handleResetToInitial}
          />
        )}
      </main>

      {/* Detail / Brief Modal */}
      {selectedInitiative && (
        <InitiativeDetailModal
          initiative={selectedInitiative}
          statusOptions={settings.statusOptions}
          priorityOptions={settings.priorityOptions}
          categoryOptions={settings.categoryOptions}
          teamOptions={settings.researchTeams}
          isOpen={!!selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
          onSave={handleUpdateInitiative}
          onDelete={handleDeleteInitiative}
        />
      )}

      {/* New Initiative Quick Modal */}
      <NewInitiativeModal
        isOpen={isNewInitiativeOpen}
        statusOptions={settings.statusOptions}
        priorityOptions={settings.priorityOptions}
        categoryOptions={settings.categoryOptions}
        onClose={() => setIsNewInitiativeOpen(false)}
        onCreate={handleCreateInitiative}
      />
    </div>
  );
}
