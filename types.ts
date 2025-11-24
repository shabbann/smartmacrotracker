export type Mode = 'BULK' | 'CUT';
export type ViewMode = 'dashboard' | 'history' | 'settings' | 'add';

export interface UserSettings {
  targetCalories: number;
  targetProtein: number;
  targetFat: number;
  mode: Mode;
  name: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
}

export interface DayLog {
  date: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  mode?: Mode; // Snapshot of the mode for that day
  targetCalories?: number; // Snapshot of the target for that day
}

export interface AppState {
  view: ViewMode;
  settings: UserSettings;
  logs: Record<string, DayLog>;
}

export const DEFAULT_SETTINGS: UserSettings = {
  targetCalories: 2500,
  targetProtein: 150,
  targetFat: 70,
  mode: 'CUT',
  name: 'User',
};