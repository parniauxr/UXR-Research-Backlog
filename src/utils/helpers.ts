/**
 * Helper utilities for formatting and visual styling
 */

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 14) return `${diffInDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getStatusColorClass(status: string): {
  badge: string;
  dot: string;
  border: string;
} {
  const normalized = (status || '').toLowerCase().trim();

  switch (normalized) {
    case 'not started':
      return {
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        border: 'border-l-slate-400'
      };
    case 'scoping':
      return {
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-500',
        border: 'border-l-sky-500'
      };
    case 'ready for prioritization':
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        border: 'border-l-indigo-500'
      };
    case 'planned':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        border: 'border-l-blue-500'
      };
    case 'in progress':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        border: 'border-l-amber-500'
      };
    case 'analysis':
      return {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        border: 'border-l-purple-500'
      };
    case 'reporting':
      return {
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dot: 'bg-cyan-500',
        border: 'border-l-cyan-500'
      };
    case 'completed':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        border: 'border-l-emerald-500'
      };
    case 'on hold':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        border: 'border-l-rose-500'
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        border: 'border-l-slate-400'
      };
  }
}

export function getPriorityColorClass(priority: string): {
  badge: string;
  dot: string;
  label: string;
} {
  const normalized = (priority || '').toLowerCase().trim();

  switch (normalized) {
    case 'high':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200 font-medium',
        dot: 'bg-red-500',
        label: 'High'
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
        dot: 'bg-amber-500',
        label: 'Medium'
      };
    case 'low':
      return {
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        label: 'Low'
      };
    case 'not set':
    default:
      return {
        badge: 'bg-gray-50 text-gray-500 border-gray-200',
        dot: 'bg-gray-300',
        label: 'Not Set'
      };
  }
}
