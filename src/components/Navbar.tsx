import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Lightbulb, 
  Settings, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'backlog' | 'opportunities' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'backlog' | 'opportunities' | 'settings') => void;
  backlogCount: number;
  opportunitiesCount: number;
  onNewInitiative: () => void;
  onNewOpportunity: () => void;
  saveStatus: 'saved' | 'saving' | 'error';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backlogCount,
  opportunitiesCount,
  onNewInitiative,
  onNewOpportunity,
  saveStatus
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-base">PinDis</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                    UX Research
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-tight">Backlog Management</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('backlog')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'backlog'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ListTodo className="w-4 h-4 text-slate-500" />
                <span>Research Backlog</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'backlog' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {backlogCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'opportunities'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-slate-500" />
                <span>Opportunities</span>
                {opportunitiesCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                    {opportunitiesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'settings'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Settings
              </button>
            </nav>
          </div>

          {/* Right Controls: Save state & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Save status badge */}
            <div className="hidden sm:flex items-center text-xs text-slate-500 gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200/80">
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-600 font-medium">Saved</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span className="text-indigo-600 font-medium">Saving...</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-700 font-medium">Local backup</span>
                </>
              )}
            </div>

            {/* Quick Opportunity add button */}
            <button
              onClick={onNewOpportunity}
              title="Add a new research opportunity or idea"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-md transition"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>+ Opportunity</span>
            </button>

            {/* Primary New Initiative button */}
            <button
              onClick={onNewInitiative}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-md shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Initiative</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden border-t border-slate-200 py-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'backlog' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Backlog ({backlogCount})
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'opportunities' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Opportunities ({opportunitiesCount})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};
