import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import DayModal from './components/DayModal';
import AIInsights from './components/AIInsights';
import { InstallPrompt } from './components/InstallPrompt';
import { HealthRecord } from './types';
import { getRecords, saveRecord, getAllRecordsArray } from './services/storage';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<Record<string, HealthRecord>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedRecords = getRecords();
    setRecords(loadedRecords);
  }, []);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    const today = new Date().toISOString().split('T')[0];
    handleSelectDate(today);
  };

  const handleSaveRecord = (record: HealthRecord) => {
    saveRecord(record);
    setRecords(prev => ({ ...prev, [record.id]: record }));
    setIsModalOpen(false);
  };

  const recordsArray = getAllRecordsArray();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden sm:border-x sm:border-gray-200">
      
      {/* iOS Installation Prompt */}
      <InstallPrompt />

      {/* Header */}
      <header className="bg-white px-6 py-5 shadow-sm z-10 sticky top-0 pt-safe-top">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">HealthFlow</h1>
        <p className="text-sm text-gray-400">您的每日健康伴侣</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
        {/* Calendar */}
        <CalendarView records={records} onSelectDate={handleSelectDate} />

        {/* AI Section */}
        <AIInsights records={recordsArray} />

        {/* Recent List (Optional Overview) */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">最近记录</h3>
          {recordsArray.slice(0, 5).map(r => (
             <div 
               key={r.id} 
               onClick={() => handleSelectDate(r.id)}
               className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-primary/20 transition-all cursor-pointer flex justify-between items-center"
             >
               <div>
                 <div className="font-bold text-gray-800">{r.id}</div>
                 <div className="text-xs text-gray-500 mt-1 flex gap-2">
                   {r.sleepHours > 0 && <span>🛌 {r.sleepHours}h</span>}
                   {r.pain.level > 0 && <span className="text-orange-500">⚡ 疼痛 {r.pain.level}</span>}
                   {r.exercise && <span className="text-green-600">🏃 {r.exercise.substring(0, 10)}...</span>}
                 </div>
               </div>
               <div className="text-gray-300">
                  <Plus className="w-5 h-5 rotate-45" />
               </div>
             </div>
          ))}
          {recordsArray.length === 0 && (
             <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
               还没有记录，点击下方 "+" 开始吧
             </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) for Today */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 pb-safe-bottom">
        <button 
          onClick={handleAddNew}
          className="bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-orange-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modal */}
      <DayModal 
        isOpen={isModalOpen}
        dateStr={selectedDate}
        existingRecord={selectedDate ? records[selectedDate] : null}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
      />

    </div>
  );
};

export default App;