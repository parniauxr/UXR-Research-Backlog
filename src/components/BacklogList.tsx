import React, { useState, useMemo } from 'react';
import { ResearchInitiative } from '../types';
import { formatRelativeTime, getStatusColorClass, getPriorityColorClass } from '../utils/helpers';
import { 
  Search, 
  Plus, 
  Trash2, 
  LayoutList, 
  LayoutGrid, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface BacklogListProps {
  initiatives: ResearchInitiative[];
  statusOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  initialStatusFilter?: string;
  initialPriorityFilter?: string;
  onOpenInitiative: (initiative: ResearchInitiative) => void;
  onNewInitiative: () => void;
  onQuickUpdateStatus: (id: string, status: string) => void;
  onDeleteInitiative: (id: string) => void;
}

export const BacklogList: React.FC<BacklogListProps> = ({
  initiatives,
  statusOptions,
  priorityOptions,
  categoryOptions,
  initialStatusFilter = 'ALL',
  initialPriorityFilter = 'ALL',
  onOpenInitiative,
  onNewInitiative,
  onQuickUpdateStatus,
  onDeleteInitiative
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState(initialPriorityFilter);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'updated-desc' | 'updated-asc' | 'title-asc' | 'priority-desc'>('updated-desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sync if initial filters change from outside (e.g. dashboard click)
  React.useEffect(() => {
    if (initialStatusFilter) setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  React.useEffect(() => {
    if (initialPriorityFilter) setPriorityFilter(initialPriorityFilter);
  }, [initialPriorityFilter]);

  // Priority sort weight
  const priorityWeight: Record<string, number> = {
    'High': 4,
    'Medium': 3,
    'Low': 2,
    'Not Set': 1
  };

  // Filter & Sort
  const filteredInitiatives = useMemo(() => {
    return initiatives
      .filter(item => {
        // Search by title
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesCategory = item.category?.toLowerCase().includes(q);
          const matchesOwner = item.researchOwner?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesOwner) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'ALL') {
          if ((item.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
          }
        }

        // Priority Filter
        if (priorityFilter !== 'ALL') {
          if ((item.priority || 'Not Set').toLowerCase() !== priorityFilter.toLowerCase()) {
            return false;
          }
        }

        // Category Filter
        if (categoryFilter !== 'ALL') {
          if ((item.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'updated-desc') {
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        }
        if (sortBy === 'updated-asc') {
          return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority-desc') {
          const wA = priorityWeight[a.priority] || 0;
          const wB = priorityWeight[b.priority] || 0;
          return wB - wA;
        }
        return 0;
      });
  }, [initiatives, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + 
                            (priorityFilter !== 'ALL' ? 1 : 0) + 
                            (categoryFilter !== 'ALL' ? 1 : 0) + 
                            (searchQuery ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setCategoryFilter('ALL');
  };

  const itemToDelete = initiatives.find(i => i.id === deleteConfirmId);

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Backlog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage research initiatives, scope briefs, and track discoveries for PinDis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewInitiative}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Initiative</span>
          </button>
        </div>
      </div>

      {/* Search, Filter, Sort Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search initiatives by title..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter: Status */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="w-full py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Filter: Priority */}
          <div className="w-full md:w-36">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
              className="w-full py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              {priorityOptions.map(pr => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Sort initiatives"
              className="w-full py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="updated-desc">Last Updated (Newest)</option>
              <option value="updated-asc">Last Updated (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="priority-desc">Priority (High to Low)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50 self-end md:self-auto">
            <button
              onClick={() => setViewMode('list')}
              title="List view"
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Cards view"
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active filter count & clear badge */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredInitiatives.length} of {initiatives.length} initiatives
            </span>
            <button
              onClick={clearAllFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Initiatives Content */}
      {filteredInitiatives.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-700 font-medium">No research initiatives found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No initiatives match your current search or filter criteria. Try clearing filters or create a new initiative.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={onNewInitiative}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
            >
              + Create Initiative
            </button>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-12 sm:col-span-6 md:col-span-6">Initiative Title</div>
            <div className="hidden sm:block sm:col-span-3 md:col-span-2 text-left">Status</div>
            <div className="hidden md:block md:col-span-2 text-left">Priority</div>
            <div className="hidden sm:block sm:col-span-3 md:col-span-2 text-right">Last Updated</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredInitiatives.map(item => {
              const statusColors = getStatusColorClass(item.status);
              const priorityColors = getPriorityColorClass(item.priority);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/70 transition group"
                >
                  {/* Title & Populated Metadata */}
                  <div 
                    onClick={() => onOpenInitiative(item)}
                    className="col-span-12 sm:col-span-6 md:col-span-6 cursor-pointer"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                      {item.title}
                    </h3>
                    {/* Show only populated metadata tags - do not show empty fields */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                      {item.category && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {item.category}
                        </span>
                      )}
                      {item.researchOwner && (
                        <span className="text-slate-500">
                          Owner: <span className="font-medium text-slate-700">{item.researchOwner}</span>
                        </span>
                      )}
                      {item.researchQuestions && item.researchQuestions.length > 0 && (
                        <span className="text-slate-400">
                          {item.researchQuestions.length} research {item.researchQuestions.length === 1 ? 'question' : 'questions'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown/Pill */}
                  <div className="col-span-6 sm:col-span-3 md:col-span-2">
                    <div className="relative inline-block w-full sm:w-auto">
                      <select
                        value={item.status}
                        onChange={e => onQuickUpdateStatus(item.id, e.target.value)}
                        aria-label={`Change status for ${item.title}`}
                        className={`text-xs font-medium pl-2.5 pr-6 py-1 rounded-full border cursor-pointer appearance-none ${statusColors.badge} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      >
                        {statusOptions.map(st => (
                          <option key={st} value={st} className="bg-white text-slate-900">{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="col-span-6 md:col-span-2">
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-md border ${priorityColors.badge}`}>
                      {item.priority}
                    </span>
                  </div>

                  {/* Last Updated & Actions */}
                  <div className="col-span-12 sm:col-span-3 md:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-right">
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(item.updatedAt)}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onOpenInitiative(item)}
                        title="Open research brief"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Delete initiative"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid / Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInitiatives.map(item => {
            const statusColors = getStatusColorClass(item.status);
            const priorityColors = getPriorityColorClass(item.priority);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusColors.badge}`}>
                      {item.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${priorityColors.badge}`}>
                      {item.priority}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onOpenInitiative(item)}
                    className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h3>

                  {/* Populated tags only */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {item.category && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {item.category}
                      </span>
                    )}
                    {item.researchOwner && (
                      <span className="text-slate-500">
                        By {item.researchOwner}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatRelativeTime(item.updatedAt)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenInitiative(item)}
                      className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                    >
                      Open Brief
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Delete Research Initiative?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{itemToDelete.title}"</span>? All research notes and brief contents for this initiative will be removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteInitiative(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete Initiative
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
