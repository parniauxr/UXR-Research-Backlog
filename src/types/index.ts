/**
 * Types for PinDis UX Research Backlog
 */

export type Priority = 'High' | 'Medium' | 'Low' | 'Not Set' | string;

export interface StakeholderContact {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

export interface ResearchInitiative {
  id: string;
  title: string;

  // Basic Information
  objective?: string;
  problemOpportunity?: string;
  status: string;
  priority: Priority;
  category?: string;

  // Research Definition
  researchQuestions?: string[];
  researchMethod?: string;
  targetUserSegment?: string;
  researchTrigger?: string;
  existingEvidence?: string;
  researchScope?: string;

  // Stakeholder Information
  primaryStakeholderTeam?: string;
  stakeholderContacts?: StakeholderContact[];
  decisionMaker?: string;

  // Planning
  researchOwner?: string;
  startDate?: string;
  targetDate?: string;
  dependencies?: string;
  effortEstimate?: string;

  // Outcomes
  expectedDeliverables?: string;
  keyFindings?: string;
  productDecisions?: string;
  documentationLink?: string;
  notes?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface ResearchOpportunity {
  id: string;
  title: string;
  description?: string;
  status?: string; // e.g., 'Idea', 'Under Review', 'Validated', 'Archived'
  relatedInitiativeId?: string;
  convertedToInitiativeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  statusOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  researchTeams: string[];
}

export interface AppDataStore {
  initiatives: ResearchInitiative[];
  opportunities: ResearchOpportunity[];
  settings: AppSettings;
  version: number;
  lastModified: string;
}
