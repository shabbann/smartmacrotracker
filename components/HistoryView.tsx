import React from 'react';
import { DayLog, UserSettings } from '../types';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface HistoryViewProps {
  logs: Record<string, DayLog>;
  settings: UserSettings;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs, settings }) => {
  const sortedDates = Object.keys(logs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getStatus = (log: DayLog) => {
    const { totalCalories } = log;
    // Use stored values for historical accuracy, fallback to current settings for old data
    const mode = log.mode || settings.mode;
    const targetCalories = log.targetCalories || settings.targetCalories;
    
    if (mode === 'CUT') {
        // Cut Mode: Good if under target (with 10% buffer for slight overage)
        return totalCalories <= targetCalories * 1.1 ? 'good' : 'bad';
    } else {
        // Bulk Mode: Good if over target (with 10% buffer for slight underage)
        return totalCalories >= targetCalories * 0.9 ? 'good' : 'bad';
    }
  };

  const chartData = sortedDates.slice(0, 7).reverse().map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      cals: logs[date].totalCalories
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold mb-4">History</h2>

      {/* Weekly Trend Chart */}
      {sortedDates.length > 0 && (
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 h-48">
             <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase">Last 7 Entries</h3>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="cals" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
      )}

      {/* List View */}
      <div className="space-y-3">
        {sortedDates.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
                <Calendar className="mx-auto mb-2 opacity-20" size={48} />
                No history yet.
            </div>
        ) : (
            sortedDates.map(date => {
                const log = logs[date];
                const status = getStatus(log);
                const isGood = status === 'good';
                const logMode = log.mode || settings.mode;

                return (
                    <div key={date} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between border-l-4 border-slate-700 overflow-hidden relative">
                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                         
                         <div className="flex-1 pl-2">
                             <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-200">
                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </h3>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                    logMode === 'BULK' 
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}>
                                    {logMode}
                                </span>
                             </div>
                             <div className="flex items-center gap-1 text-xs text-slate-500">
                                {isGood ? 
                                    <CheckCircle size={14} className="text-emerald-500" /> : 
                                    <XCircle size={14} className="text-red-500" />
                                }
                                <span>{log.items.length} meals</span>
                             </div>
                         </div>

                         <div className="text-right">
                             <span className={`block font-bold text-lg ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                                {Math.round(log.totalCalories)}
                             </span>
                             <span className="text-[10px] text-slate-500">
                                / {log.targetCalories || settings.targetCalories} kcal
                             </span>
                         </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};