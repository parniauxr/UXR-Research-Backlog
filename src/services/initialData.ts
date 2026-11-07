import { AppDataStore, ResearchInitiative, AppSettings } from '../types';

export const INITIAL_STATUS_OPTIONS: string[] = [
  'Not Started',
  'Scoping',
  'Ready for Prioritization',
  'Planned',
  'In Progress',
  'Analysis',
  'Reporting',
  'Completed',
  'On Hold'
];

export const INITIAL_PRIORITY_OPTIONS: string[] = [
  'High',
  'Medium',
  'Low',
  'Not Set'
];

export const INITIAL_CATEGORY_OPTIONS: string[] = [
  'Ordering & Basket',
  'Direct Delivery',
  'Credit & Barook',
  'CRM & Retention',
  'Telesales & Activation',
  'Satisfaction & NPS',
  'Campaigns & Missions',
  'Discovery & Catalog'
];

export const INITIAL_TEAMS: string[] = [
  'Product',
  'Design',
  'Data & BI',
  'CRM',
  'Marketing',
  'Telesales',
  'Commercial / Operations'
];

export const INITIAL_INITIATIVE_TITLES: string[] = [
  'CRM Experience Measurement Framework',
  'Direct Delivery – Users with Delivered Orders',
  'Credit Line & Barook Usage Logic',
  'Direct Delivery – 2500 Hamisan Calls Analysis',
  'Direct Delivery – Users with App Interaction but No Submitted Order',
  'Direct Delivery – Combined Delivery',
  'Long-term Customer Satisfaction Measurement Model (NPS / CSAT)',
  'Marketing Campaign Mission Evaluation',
  'New User Activation Blockers – Telesales Research',
  'Retailer Product Demand – Requirement List & Add-to-Basket Behavior'
];

export function createInitialInitiatives(): ResearchInitiative[] {
  const baseTimestamp = new Date('2026-11-06T12:00:00Z').toISOString();

  return INITIAL_INITIATIVE_TITLES.map((title, index) => {
    // Generate deterministic id for stable hydration
    const id = `init-${index + 1}`;
    return {
      id,
      title,
      // All other fields remain explicitly empty / undefined
      objective: '',
      problemOpportunity: '',
      status: 'Not Started',
      priority: 'Not Set',
      category: '',
      researchQuestions: [],
      researchMethod: '',
      targetUserSegment: '',
      researchTrigger: '',
      existingEvidence: '',
      researchScope: '',
      primaryStakeholderTeam: '',
      stakeholderContacts: [],
      decisionMaker: '',
      researchOwner: '',
      startDate: '',
      targetDate: '',
      dependencies: '',
      effortEstimate: '',
      expectedDeliverables: '',
      keyFindings: '',
      productDecisions: '',
      documentationLink: '',
      notes: '',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp
    };
  });
}

export function createInitialSettings(): AppSettings {
  return {
    statusOptions: [...INITIAL_STATUS_OPTIONS],
    priorityOptions: [...INITIAL_PRIORITY_OPTIONS],
    categoryOptions: [...INITIAL_CATEGORY_OPTIONS],
    researchTeams: [...INITIAL_TEAMS]
  };
}

export function createInitialStore(): AppDataStore {
  return {
    initiatives: createInitialInitiatives(),
    opportunities: [],
    settings: createInitialSettings(),
    version: 1,
    lastModified: new Date().toISOString()
  };
}
