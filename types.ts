
export interface DietRecord {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export enum MenstruationFlow {
  None = 'None',
  Light = 'Light',
  Medium = 'Medium',
  Heavy = 'Heavy',
}

export interface PainEntry {
  id: string; // Unique ID for list rendering
  location: string;
  level: number; // 0-10
}

export interface ExerciseRecord {
  type: string; // 'None', 'Walk', 'Run', 'Badminton', 'Gym', 'Stretch'
  duration: number; // minutes
}

export interface SleepRecord {
  bedtime: string; // "HH:MM"
  wakeTime: string; // "HH:MM"
}

export enum MoodValue {
  VeryUnpleasant = 1,
  Unpleasant = 2,
  Neutral = 3,
  Pleasant = 4,
  VeryPleasant = 5
}

export interface MoodRecord {
  value: MoodValue;
  tags: string[]; // e.g. "Excited", "Anxious", "Tired"
}

export interface HealthRecord {
  id: string; // YYYY-MM-DD as ID
  date: string; // ISO String for safety
  diet: DietRecord;
  sleep: SleepRecord;
  sugaryDrinks: string; // Changed to text input
  medications: string[]; // List of med names
  exercise: ExerciseRecord;
  sexualActivity: boolean;
  menstruation: MenstruationFlow;
  pain: PainEntry[]; // Changed to array
  mood: MoodRecord; // New field
  notes: string;
}

export const EXERCISE_TYPES = [
  '无', '户外散步', '跑步', '羽毛球', '健身', '拉伸'
];

export const MOOD_TAGS = [
  '平静', '开心', '焦虑', '疲惫', '兴奋', '压力大', '难过', '充满活力'
];

export const DEFAULT_RECORD: HealthRecord = {
  id: '',
  date: '',
  diet: { breakfast: '', lunch: '', dinner: '', snacks: '' },
  sleep: { bedtime: '', wakeTime: '' },
  sugaryDrinks: '',
  medications: [],
  exercise: { type: '无', duration: 0 },
  sexualActivity: false,
  menstruation: MenstruationFlow.None,
  pain: [],
  mood: { value: MoodValue.Neutral, tags: [] },
  notes: ''
};
