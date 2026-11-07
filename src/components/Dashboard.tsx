import React from 'react';
import { ResearchInitiative } from '../types';
import { formatRelativeTime, getStatusColorClass, getPriorityColorClass } from '../utils/helpers';
import { 
  FolderKanban, 
  CircleDashed, 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  initiatives: ResearchInitiative[];
  statusOptions: string[];
  priorityOptions: string[];
  onOpenInitiative: (initiative: ResearchInitiative) => void;
  onNavigateToBacklog: (filter?: { status?: string; priority?: string }) => void;
  onNewInitiative: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  initiatives,
  statusOptions,
  priorityOptions,
  onOpenInitiative,
  onNavigateToBacklog,
  onNewInitiative
}) => {
  // Calculate dynamic metrics from actual records
  const totalCount = initiatives.length;
  
  const notStartedCount = initiatives.filter(
    i => (i.status || '').toLowerCase() === 'not started'
  ).length;

  const inProgressCount = initiatives.filter(
    i => (i.status || '').toLowerCase() === 'in progress'
  ).length;

  const completedCount = initiatives.filter(
    i => (i.status || '').toLowerCase() === 'completed'
  ).length;

  const onHoldCount = initiatives.filter(
    i => (i.status || '').toLowerCase() === 'on hold'
  ).length;

  // Status breakdown
  const statusCounts = statusOptions.map(status => {
    const count = initiatives.filter(i => (i.status || '').toLowerCase() === status.toLowerCase()).length;
    return {
      status,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    };
  });

  // Priority breakdown
  const priorityCounts = priorityOptions.map(priority => {
    const count = initiatives.filter(i => (i.priority || 'Not Set').toLowerCase() === priority.toLowerCase()).length;
    return {
      priority,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    };
  });

  // Recently updated initiatives (sorted by updatedAt descending)
  const recentlyUpdated = [...initiatives]
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">UX Research Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            PinDis B2B ordering platform research portfolio & initiative pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToBacklog()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition"
          >
            <span>View Full Backlog</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Top 5 Core Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Initiatives */}
        <div 
          onClick={() => onNavigateToBacklog()}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-400">initiatives</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1">
            <span>Explore all</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Not Started */}
        <div 
          onClick={() => onNavigateToBacklog({ status: 'Not Started' })}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Not Started</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition">
              <CircleDashed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{notStartedCount}</span>
            <span className="text-xs text-slate-400">in queue</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Ready for scoping</span>
          </div>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => onNavigateToBacklog({ status: 'In Progress' })}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{inProgressCount}</span>
            <span className="text-xs text-slate-400">active</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
            <span>Currently working</span>
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => onNavigateToBacklog({ status: 'Completed' })}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-400">delivered</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span>Insights shared</span>
          </div>
        </div>

        {/* On Hold */}
        <div 
          onClick={() => onNavigateToBacklog({ status: 'On Hold' })}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">On Hold</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-105 transition">
              <PauseCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{onHoldCount}</span>
            <span className="text-xs text-slate-400">paused</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Pending input</span>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: Status & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Initiatives by Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Research Initiatives by Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any stage to filter backlog</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{statusOptions.length} stages</span>
          </div>

          <div className="space-y-3">
            {statusCounts.map(item => {
              const colors = getStatusColorClass(item.status);
              return (
                <div
                  key={item.status}
                  onClick={() => onNavigateToBacklog({ status: item.status })}
                  className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 min-w-[28px] text-center">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research Initiatives by Priority */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Research Initiatives by Priority</h2>
              <p className="text-xs text-slate-500 mt-0.5">Researcher-managed prioritization</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{totalCount} total</span>
          </div>

          <div className="space-y-3">
            {priorityCounts.map(item => {
              const colors = getPriorityColorClass(item.priority);
              return (
                <div
                  key={item.priority}
                  onClick={() => onNavigateToBacklog({ priority: item.priority })}
                  className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      {item.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          item.priority === 'High' ? 'bg-red-500' :
                          item.priority === 'Medium' ? 'bg-amber-500' :
                          item.priority === 'Low' ? 'bg-slate-400' : 'bg-gray-300'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${colors.badge} min-w-[28px] text-center`}>
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Note about Prioritization */}
          <div className="mt-5 p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-xs text-indigo-900 leading-relaxed">
              <strong>Human-driven prioritization:</strong> You maintain full ownership over priorities. Click any initiative in the Backlog to set or adjust its priority as product needs evolve.
            </p>
          </div>
        </div>
      </div>

      {/* Recently Updated Initiatives */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recently Updated Initiatives</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quick access to initiatives you recently edited</p>
          </div>
          <button
            onClick={() => onNavigateToBacklog()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            View all ({totalCount})
          </button>
        </div>

        {recentlyUpdated.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No initiatives found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentlyUpdated.map(init => {
              const statusColors = getStatusColorClass(init.status);
              const priorityColors = getPriorityColorClass(init.priority);

              return (
                <div
                  key={init.id}
                  onClick={() => onOpenInitiative(init)}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition group"
                >
                  <div className="min-w-0 pr-4">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {init.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>Updated {formatRelativeTime(init.updatedAt)}</span>
                      {init.researchOwner && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{init.researchOwner}</span>
                        </>
                      )}
                      {init.category && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">{init.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors.badge}`}>
                      {init.status}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md border hidden sm:inline-block ${priorityColors.badge}`}>
                      {init.priority}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
