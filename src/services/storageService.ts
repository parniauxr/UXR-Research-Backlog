import { AppDataStore, ResearchInitiative, ResearchOpportunity, AppSettings } from '../types';
import { createInitialStore } from './initialData';

const LOCAL_STORAGE_KEY = 'pindis_ux_research_backlog_v1';
const API_BASE = '/api';

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (err) {
      console.error('Listener callback error', err);
    }
  });
}

// In-memory cache
let currentStore: AppDataStore | null = null;
let isSaving = false;
let lastSaveStatus: 'saved' | 'saving' | 'error' = 'saved';

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSaveStatus(): 'saved' | 'saving' | 'error' {
  return lastSaveStatus;
}

/**
 * Loads the application store from localStorage or initial seed.
 * Also attempts to hydrate with server API if available.
 */
export function loadStore(): AppDataStore {
  if (currentStore) {
    return currentStore;
  }

  // 1. Try localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.initiatives) && parsed.settings) {
        currentStore = parsed;
        // background sync with server
        syncWithServerIfPossible(currentStore!);
        return currentStore!;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using initial store', err);
  }

  // 2. Initialize fresh with the 10 original titles
  currentStore = createInitialStore();
  saveStore(currentStore);
  syncWithServerIfPossible(currentStore);
  return currentStore;
}

// Background initial server check
if (typeof window !== 'undefined') {
  fetch(`${API_BASE}/data`)
    .then(res => {
      if (res.ok) return res.json();
      return null;
    })
    .then(serverData => {
      if (serverData && Array.isArray(serverData.initiatives) && serverData.settings) {
        // If server data exists and is newer or client had defaults, hydrate
        const clientRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!clientRaw) {
          currentStore = serverData;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
          notifyListeners();
        }
      }
    })
    .catch(() => {
      // Offline or local only
    });
}

/**
 * Saves store to LocalStorage and triggers background server persist
 */
export function saveStore(store: AppDataStore): void {
  currentStore = {
    ...store,
    lastModified: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentStore));
    lastSaveStatus = 'saved';
  } catch (err) {
    console.error('Failed to write to localStorage', err);
    lastSaveStatus = 'error';
  }

  notifyListeners();
  syncWithServerIfPossible(currentStore);
}

/**
 * Attempt to persist store to backend API if running
 */
async function syncWithServerIfPossible(store: AppDataStore) {
  if (isSaving) return;
  isSaving = true;

  try {
    await fetch(`${API_BASE}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(store)
    });
  } catch {
    // If running purely client-side without API backend, local storage is active
  } finally {
    isSaving = false;
  }
}

// ================= Initiatives CRUD ================= //

export function getInitiatives(): ResearchInitiative[] {
  const store = loadStore();
  return store.initiatives;
}

export function getInitiativeById(id: string): ResearchInitiative | undefined {
  const store = loadStore();
  return store.initiatives.find(item => item.id === id);
}

export function createInitiative(data: Partial<ResearchInitiative> & { title: string }): ResearchInitiative {
  const store = loadStore();
  const now = new Date().toISOString();

  const newInitiative: ResearchInitiative = {
    id: `init-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: data.title.trim(),
    objective: data.objective || '',
    problemOpportunity: data.problemOpportunity || '',
    status: data.status || 'Not Started',
    priority: data.priority || 'Not Set',
    category: data.category || '',
    researchQuestions: data.researchQuestions || [],
    researchMethod: data.researchMethod || '',
    targetUserSegment: data.targetUserSegment || '',
    researchTrigger: data.researchTrigger || '',
    existingEvidence: data.existingEvidence || '',
    researchScope: data.researchScope || '',
    primaryStakeholderTeam: data.primaryStakeholderTeam || '',
    stakeholderContacts: data.stakeholderContacts || [],
    decisionMaker: data.decisionMaker || '',
    researchOwner: data.researchOwner || '',
    startDate: data.startDate || '',
    targetDate: data.targetDate || '',
    dependencies: data.dependencies || '',
    effortEstimate: data.effortEstimate || '',
    expectedDeliverables: data.expectedDeliverables || '',
    keyFindings: data.keyFindings || '',
    productDecisions: data.productDecisions || '',
    documentationLink: data.documentationLink || '',
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now
  };

  const updatedInitiatives = [newInitiative, ...store.initiatives];
  saveStore({
    ...store,
    initiatives: updatedInitiatives
  });

  return newInitiative;
}

export function updateInitiative(id: string, updates: Partial<ResearchInitiative>): ResearchInitiative | null {
  const store = loadStore();
  const index = store.initiatives.findIndex(item => item.id === id);
  if (index === -1) return null;

  const current = store.initiatives[index];
  const updated: ResearchInitiative = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedInitiatives = [...store.initiatives];
  updatedInitiatives[index] = updated;

  saveStore({
    ...store,
    initiatives: updatedInitiatives
  });

  return updated;
}

export function deleteInitiative(id: string): boolean {
  const store = loadStore();
  const initialLength = store.initiatives.length;
  const filtered = store.initiatives.filter(item => item.id !== id);

  if (filtered.length !== initialLength) {
    saveStore({
      ...store,
      initiatives: filtered
    });
    return true;
  }
  return false;
}

// ================= Opportunities CRUD ================= //

export function getOpportunities(): ResearchOpportunity[] {
  const store = loadStore();
  return store.opportunities || [];
}

export function createOpportunity(data: {
  title: string;
  description?: string;
  status?: string;
  relatedInitiativeId?: string;
}): ResearchOpportunity {
  const store = loadStore();
  const now = new Date().toISOString();

  const newOpp: ResearchOpportunity = {
    id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: data.title.trim(),
    description: data.description || '',
    status: data.status || 'Idea',
    relatedInitiativeId: data.relatedInitiativeId || '',
    createdAt: now,
    updatedAt: now
  };

  const updatedOpportunities = [newOpp, ...(store.opportunities || [])];
  saveStore({
    ...store,
    opportunities: updatedOpportunities
  });

  return newOpp;
}

export function updateOpportunity(id: string, updates: Partial<ResearchOpportunity>): ResearchOpportunity | null {
  const store = loadStore();
  const opps = store.opportunities || [];
  const index = opps.findIndex(item => item.id === id);
  if (index === -1) return null;

  const updated: ResearchOpportunity = {
    ...opps[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedOpps = [...opps];
  updatedOpps[index] = updated;

  saveStore({
    ...store,
    opportunities: updatedOpps
  });

  return updated;
}

export function deleteOpportunity(id: string): boolean {
  const store = loadStore();
  const opps = store.opportunities || [];
  const filtered = opps.filter(item => item.id !== id);

  if (filtered.length !== opps.length) {
    saveStore({
      ...store,
      opportunities: filtered
    });
    return true;
  }
  return false;
}

export function convertOpportunityToInitiative(opportunityId: string): ResearchInitiative | null {
  const store = loadStore();
  const opp = (store.opportunities || []).find(o => o.id === opportunityId);
  if (!opp) return null;

  // Create initiative from opportunity
  const newInitiative = createInitiative({
    title: opp.title,
    problemOpportunity: opp.description || '',
    status: 'Not Started',
    priority: 'Not Set'
  });

  // Mark opportunity as converted
  updateOpportunity(opportunityId, {
    convertedToInitiativeId: newInitiative.id,
    status: 'Converted'
  });

  return newInitiative;
}

// ================= Settings CRUD ================= //

export function getSettings(): AppSettings {
  const store = loadStore();
  return store.settings;
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const store = loadStore();
  const updatedSettings: AppSettings = {
    ...store.settings,
    ...updates
  };

  saveStore({
    ...store,
    settings: updatedSettings
  });

  return updatedSettings;
}

// ================= Backup & Reset ================= //

export function exportBackupJSON(): string {
  const store = loadStore();
  return JSON.stringify(store, null, 2);
}

export function importBackupJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.initiatives) || !parsed.settings) {
      return { success: false, message: 'Invalid format: Missing initiatives or settings data.' };
    }
    saveStore(parsed);
    return { success: true, message: `Successfully imported ${parsed.initiatives.length} initiatives.` };
  } catch (err) {
    return { success: false, message: 'Could not parse JSON file. Please check file format.' };
  }
}

export function resetToInitialState(): void {
  const fresh = createInitialStore();
  saveStore(fresh);
}
