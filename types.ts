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

export interface PainRecord {
  level: number; // 0-10
  location: string;
}

export interface HealthRecord {
  id: string; // YYYY-MM-DD as ID
  date: string; // ISO String for safety
  diet: DietRecord;
  sleepHours: number;
  sugaryDrinks: number; // count
  medications: string[]; // List of med names
  exercise: string; // Description or duration
  sexualActivity: boolean;
  menstruation: MenstruationFlow;
  pain: PainRecord;
  notes: string;
}

export const DEFAULT_RECORD: HealthRecord = {
  id: '',
  date: '',
  diet: { breakfast: '', lunch: '', dinner: '', snacks: '' },
  sleepHours: 7,
  sugaryDrinks: 0,
  medications: [],
  exercise: '',
  sexualActivity: false,
  menstruation: MenstruationFlow.None,
  pain: { level: 0, location: '' },
  notes: ''
};