import React, { useState, useEffect } from 'react';
import { Target, Calendar as CalendarIcon, Utensils, Settings, Activity } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { FoodInput } from './components/FoodInput';
import { UserSettings, DayLog, ViewMode, AppState, DEFAULT_SETTINGS } from './types';

export default function App() {
  // --- State ---
  const [view, setView] = useState<ViewMode>('dashboard');
  
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('smartmacro_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [logs, setLogs] = useState<Record<string, DayLog>>(() => {
    const saved = localStorage.getItem('smartmacro_logs');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('smartmacro_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem('smartmacro_logs', JSON.stringify(logs));
  }, [logs]);

  // --- Helpers ---
  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const addFoodLog = (items: any[], totals: { calories: number; protein: number; fat: number }) => {
    const today = getTodayKey();
    setLogs(prev => {
      const currentLog = prev[today] || { 
        date: today, 
        items: [], 
        totalCalories: 0, 
        totalProtein: 0, 
        totalFat: 0,
        mode: userSettings.mode,
        targetCalories: userSettings.targetCalories
      };
      
      return {
        ...prev,
        [today]: {
          ...currentLog,
          items: [...currentLog.items, ...items],
          totalCalories: currentLog.totalCalories + totals.calories,
          totalProtein: currentLog.totalProtein + totals.protein,
          totalFat: currentLog.totalFat + totals.fat,
          // Update snapshots to current settings to keep today consistent
          mode: userSettings.mode,
          targetCalories: userSettings.targetCalories
        }
      };
    });
    setView('dashboard');
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-slate-800">
      
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            SmartMacro
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            {userSettings.mode} MODE
          </p>
        </div>
        <button 
          onClick={() => setView('settings')}
          className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
        >
          <Settings size={20} className="text-slate-300" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 min-h-[80vh]">
        {view === 'dashboard' && (
          <Dashboard 
            settings={userSettings} 
            todayLog={logs[getTodayKey()]} 
            onAddFood={() => setView('add')}
          />
        )}
        
        {view === 'add' && (
          <FoodInput 
            onSave={addFoodLog} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {view === 'history' && (
          <HistoryView 
            logs={logs} 
            settings={userSettings} 
          />
        )}

        {view === 'settings' && (
          <SettingsView 
            settings={userSettings} 
            onSave={(newSettings) => {
              setUserSettings(newSettings);
              setView('dashboard');
            }} 
            onCancel={() => setView('dashboard')}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {view !== 'add' && (
        <nav className="fixed bottom-0 w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex justify-around items-center py-4 pb-6 z-50">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            <Activity size={24} />
            <span className="text-[10px] font-medium">Today</span>
          </button>

          <button 
            onClick={() => setView('add')}
            className="flex items-center justify-center bg-emerald-500 text-slate-900 rounded-full w-14 h-14 -mt-8 shadow-lg shadow-emerald-500/20 border-4 border-slate-900 hover:scale-105 transition-transform"
          >
            <Utensils size={24} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => setView('history')}
            className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            <CalendarIcon size={24} />
            <span className="text-[10px] font-medium">History</span>
          </button>
        </nav>
      )}
    </div>
  );
}