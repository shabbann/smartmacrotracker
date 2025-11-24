import React from 'react';
import { UserSettings, DayLog } from '../types';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface DashboardProps {
  settings: UserSettings;
  todayLog?: DayLog;
  onAddFood: () => void;
}

const ProgressRing = ({ 
  current, 
  target, 
  label, 
  colorClass, 
  unit = 'g', 
  mode 
}: { 
  current: number; 
  target: number; 
  label: string; 
  colorClass: string;
  unit?: string;
  mode: 'BULK' | 'CUT';
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color logic based on mode
  let statusColor = colorClass;
  if (label === 'Calories') {
    if (mode === 'CUT') {
        // Red if over target
        statusColor = current > target ? 'text-red-500' : 'text-emerald-500';
    } else {
        // Bulk: Red/Yellow if under target significantly, Green if hitting it
        statusColor = current < target * 0.9 ? 'text-amber-500' : 'text-emerald-500';
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${statusColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white">{Math.round(current)}</span>
          <span className="text-[10px] text-slate-400">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-slate-400">{label}</span>
      <span className="text-[10px] text-slate-600">of {target}{unit}</span>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ settings, todayLog, onAddFood }) => {
  const calories = todayLog?.totalCalories || 0;
  const protein = todayLog?.totalProtein || 0;
  const fat = todayLog?.totalFat || 0;
  
  const remainingCals = settings.targetCalories - calories;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Hero Stats */}
      <div className="bg-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-slate-400 text-sm font-medium mb-1">Calories Remaining</h2>
            <div className={`text-4xl font-bold tracking-tight ${remainingCals < 0 ? 'text-red-400' : 'text-white'}`}>
              {Math.abs(Math.round(remainingCals))}
              <span className="text-lg text-slate-500 font-normal ml-1">
                 {remainingCals < 0 ? 'over' : 'kcal'}
              </span>
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded-xl">
             {settings.mode === 'BULK' ? <TrendingUp className="text-emerald-400" /> : <TrendingDown className="text-emerald-400" />}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="w-full bg-slate-900 rounded-full h-3 mb-2 overflow-hidden">
           <div 
             className={`h-full rounded-full ${settings.mode === 'CUT' && calories > settings.targetCalories ? 'bg-red-500' : 'bg-emerald-500'}`} 
             style={{ width: `${Math.min((calories / settings.targetCalories) * 100, 100)}%` }}
           ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
            <span>0</span>
            <span>Target: {settings.targetCalories}</span>
        </div>
      </div>

      {/* Macro Rings */}
      <div className="grid grid-cols-3 gap-2">
        <ProgressRing 
          current={calories} 
          target={settings.targetCalories} 
          label="Calories" 
          colorClass="text-emerald-500" 
          unit=""
          mode={settings.mode}
        />
        <ProgressRing 
          current={protein} 
          target={settings.targetProtein} 
          label="Protein" 
          colorClass="text-blue-500" 
          mode={settings.mode}
        />
        <ProgressRing 
          current={fat} 
          target={settings.targetFat} 
          label="Fat" 
          colorClass="text-purple-500" 
          mode={settings.mode}
        />
      </div>

      {/* Recent Entries */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Today's Meals</h3>
            <button onClick={onAddFood} className="text-xs text-emerald-400 font-medium flex items-center gap-1 hover:text-emerald-300">
                <Plus size={14} /> Add Manual
            </button>
        </div>
        
        {!todayLog?.items.length ? (
            <div className="text-center py-8 border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                <p className="text-slate-500 text-sm">No meals logged yet.</p>
                <p className="text-slate-600 text-xs mt-1">Tap the + button to start.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {todayLog.items.slice().reverse().map((item, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-xl p-4 flex justify-between items-center border border-slate-700/50">
                        <div>
                            <p className="font-medium text-slate-200">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.calories} kcal</p>
                        </div>
                        <div className="flex gap-3 text-xs">
                             <div className="text-center">
                                <span className="block text-blue-400 font-bold">{item.protein}g</span>
                                <span className="text-slate-600">P</span>
                             </div>
                             <div className="text-center">
                                <span className="block text-purple-400 font-bold">{item.fat}g</span>
                                <span className="text-slate-600">F</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};