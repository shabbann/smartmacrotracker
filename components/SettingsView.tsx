import React, { useState } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '../types';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onSave: (s: UserSettings) => void;
  onCancel: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);

  const handleChange = (field: keyof UserSettings, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-xl font-bold">Settings</h2>
      
      <div className="bg-slate-800 rounded-2xl p-6 space-y-6 border border-slate-700">
        
        {/* Mode Selector */}
        <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Goal Mode</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl">
                <button
                    onClick={() => handleChange('mode', 'CUT')}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${formData.mode === 'CUT' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Cut
                </button>
                <button
                    onClick={() => handleChange('mode', 'BULK')}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${formData.mode === 'BULK' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Bulk
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
                {formData.mode === 'CUT' ? 'Track to stay under your calorie limit.' : 'Track to ensure you eat enough calories.'}
            </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm text-slate-300 mb-1">Target Calories</label>
                <input 
                    type="number" 
                    value={formData.targetCalories}
                    onChange={(e) => handleChange('targetCalories', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-300 mb-1">Protein (g)</label>
                    <input 
                        type="number" 
                        value={formData.targetProtein}
                        onChange={(e) => handleChange('targetProtein', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-300 mb-1">Fat (g)</label>
                    <input 
                        type="number" 
                        value={formData.targetFat}
                        onChange={(e) => handleChange('targetFat', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
         <button 
            onClick={() => setFormData(DEFAULT_SETTINGS)}
            className="flex-1 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
         >
            <RefreshCw size={18} /> Reset
         </button>
         <button 
            onClick={() => onSave(formData)}
            className="flex-[2] py-4 bg-emerald-500 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
         >
            <Save size={18} /> Save Changes
         </button>
      </div>
    </div>
  );
};