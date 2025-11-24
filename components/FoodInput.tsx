import React, { useState } from 'react';
import { analyzeFoodText } from '../services/geminiService';
import { Mic, Send, Loader2, ArrowLeft } from 'lucide-react';

interface FoodInputProps {
  onSave: (items: any[], totals: { calories: number; protein: number; fat: number }) => void;
  onCancel: () => void;
}

export const FoodInput: React.FC<FoodInputProps> = ({ onSave, onCancel }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeFoodText(input);
      onSave(result.items, {
        calories: result.total_calories,
        protein: result.total_protein,
        fat: result.total_fat
      });
    } catch (err) {
      setError("Could not analyze food. Please check your API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Log Meal</h2>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <label className="text-sm text-slate-400">
          What did you eat?
        </label>
        
        <div className="relative">
            <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 2 eggs, toast with avocado, and a black coffee..."
            className="w-full h-40 bg-slate-800 rounded-2xl p-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            disabled={isLoading}
            />
             {/* Decorative Mic Icon - Functional on mobile keyboards mostly */}
            <div className="absolute bottom-4 right-4 text-slate-500">
                <Mic size={20} />
            </div>
        </div>

        {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
            </div>
        )}

        <div className="mt-auto">
             <button
                onClick={() => handleSubmit()}
                disabled={isLoading || !input.trim()}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" /> Analyzing...
                    </>
                ) : (
                    <>
                        Calculate Macros <Send size={18} />
                    </>
                )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
                Powered by Gemini AI. Estimations may vary.
            </p>
        </div>
      </div>
    </div>
  );
};