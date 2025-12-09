import { HealthRecord } from '../types';

const STORAGE_KEY = 'healthflow_records_v1';

export const getRecords = (): Record<string, HealthRecord> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load records", e);
    return {};
  }
};

export const getRecordByDate = (dateStr: string): HealthRecord | null => {
  const records = getRecords();
  return records[dateStr] || null;
};

export const saveRecord = (record: HealthRecord): void => {
  const records = getRecords();
  records[record.id] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getAllRecordsArray = (): HealthRecord[] => {
  const records = getRecords();
  return Object.values(records).sort((a, b) => b.id.localeCompare(a.id));
};