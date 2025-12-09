
import React, { useState, useEffect } from 'react';
import { HealthRecord, DEFAULT_RECORD, MenstruationFlow, EXERCISE_TYPES, MoodValue, MOOD_TAGS, PainEntry, DietRecord } from '../types';
import { X, Save, Moon, Coffee, Pill, Flame, Heart, Droplets, Activity, Plus, Trash2, Smile, CloudRain, Sun } from 'lucide-react';

interface DayModalProps {
  isOpen: boolean;
  dateStr: string | null;
  existingRecord: HealthRecord | null;
  onClose: () => void;
  onSave: (record: HealthRecord) => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, dateStr, existingRecord, onClose, onSave }) => {
  const [formData, setFormData] = useState<HealthRecord>(DEFAULT_RECORD);
  const [newMed, setNewMed] = useState('');

  useEffect(() => {
    if (isOpen && dateStr) {
      if (existingRecord) {
        // Ensure backward compatibility if types changed for existing records
        setFormData({
            ...DEFAULT_RECORD,
            ...existingRecord,
            // Fallbacks for structure changes if needed
            sleep: existingRecord.sleep || DEFAULT_RECORD.sleep,
            exercise: existingRecord.exercise || DEFAULT_RECORD.exercise,
            pain: Array.isArray(existingRecord.pain) ? existingRecord.pain : [],
            mood: existingRecord.mood || DEFAULT_RECORD.mood
        });
      } else {
        setFormData({ ...DEFAULT_RECORD, id: dateStr, date: dateStr });
      }
    }
  }, [isOpen, dateStr, existingRecord]);

  if (!isOpen || !dateStr) return null;

  const handleChange = <K extends keyof HealthRecord>(field: K, value: HealthRecord[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDietChange = (meal: keyof HealthRecord['diet'], value: string) => {
    setFormData(prev => ({ ...prev, diet: { ...prev.diet, [meal]: value } }));
  };

  // Medication Logic
  const addMedication = () => {
    if (newMed.trim()) {
      setFormData(prev => ({ ...prev, medications: [...prev.medications, newMed.trim()] }));
      setNewMed('');
    }
  };
  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  // Pain Logic
  const addPainEntry = () => {
    const newEntry: PainEntry = { id: Date.now().toString(), location: '', level: 1 };
    setFormData(prev => ({ ...prev, pain: [...prev.pain, newEntry] }));
  };
  const updatePainEntry = (index: number, field: keyof PainEntry, value: any) => {
    const newPain = [...formData.pain];
    newPain[index] = { ...newPain[index], [field]: value };
    setFormData(prev => ({ ...prev, pain: newPain }));
  };
  const removePainEntry = (index: number) => {
    setFormData(prev => ({ ...prev, pain: prev.pain.filter((_, i) => i !== index) }));
  };

  // Mood Logic
  const toggleMoodTag = (tag: string) => {
    const currentTags = formData.mood.tags;
    if (currentTags.includes(tag)) {
      setFormData(prev => ({ ...prev, mood: { ...prev.mood, tags: currentTags.filter(t => t !== tag) } }));
    } else {
      setFormData(prev => ({ ...prev, mood: { ...prev.mood, tags: [...currentTags, tag] } }));
    }
  };

  // Mood color helper
  const getMoodColor = (val: number) => {
    if (val <= 2) return 'bg-blue-100 text-blue-600';
    if (val === 3) return 'bg-gray-100 text-gray-600';
    return 'bg-orange-100 text-orange-600';
  };
  
  const getMoodIcon = (val: number) => {
      if (val <= 2) return <CloudRain className="w-6 h-6" />;
      if (val === 3) return <Smile className="w-6 h-6" />;
      return <Sun className="w-6 h-6" />;
  };

  const mealTypes: (keyof DietRecord)[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm" onClick={onClose} />

      <div className="bg-slate-50 w-full max-w-lg h-[95vh] sm:h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-2xl sticky top-0 z-10">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">{dateStr} 记录</h2>
          <button 
            onClick={() => onSave(formData)} 
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          
          {/* Mood Section */}
          <section className="bg-white p-4 rounded-xl shadow-sm space-y-3">
             <h3 className="font-semibold text-gray-700 flex items-center gap-2">
               {getMoodIcon(formData.mood.value)} 心情状态
             </h3>
             <div className="px-2">
                <input 
                   type="range" min="1" max="5" step="1"
                   className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                   value={formData.mood.value}
                   onChange={(e) => setFormData(prev => ({ ...prev, mood: { ...prev.mood, value: Number(e.target.value) } }))}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                   <span>非常不快</span>
                   <span>平淡</span>
                   <span>非常愉快</span>
                </div>
             </div>
             <div className="flex flex-wrap gap-2 pt-2">
                {MOOD_TAGS.map(tag => (
                   <button
                     key={tag}
                     onClick={() => toggleMoodTag(tag)}
                     className={`px-3 py-1 text-xs rounded-full border transition-all ${
                        formData.mood.tags.includes(tag) 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                     }`}
                   >
                     {tag}
                   </button>
                ))}
             </div>
          </section>

          {/* Diet Section */}
          <section className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-orange-400">🥗</span> 饮食
            </h3>
            <div className="space-y-2">
              {mealTypes.map((meal) => (
                  <input 
                    key={meal}
                    type="text" 
                    placeholder={meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : meal === 'dinner' ? '晚餐' : '加餐/零食'}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                    value={formData.diet[meal]}
                    onChange={(e) => handleDietChange(meal, e.target.value)}
                  />
              ))}
            </div>
            <div className="pt-2 border-t border-gray-50">
               <div className="flex items-center gap-2 mb-1">
                 <Coffee className="w-4 h-4 text-amber-700" /> 
                 <span className="text-sm text-gray-600">含糖饮料</span>
               </div>
               <input 
                 type="text" 
                 placeholder="例：一杯奶茶，半瓶可乐..." 
                 className="w-full p-2 bg-gray-50 rounded border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                 value={formData.sugaryDrinks}
                 onChange={(e) => handleChange('sugaryDrinks', e.target.value)}
               />
            </div>
          </section>

          {/* Sleep & Exercise */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Sleep */}
             <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-400" /> 睡眠
                </h3>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">入睡</label>
                     <input 
                       type="time" 
                       className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                       value={formData.sleep.bedtime}
                       onChange={(e) => setFormData(prev => ({ ...prev, sleep: { ...prev.sleep, bedtime: e.target.value } }))}
                     />
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">起床</label>
                     <input 
                       type="time" 
                       className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                       value={formData.sleep.wakeTime}
                       onChange={(e) => setFormData(prev => ({ ...prev, sleep: { ...prev.sleep, wakeTime: e.target.value } }))}
                     />
                   </div>
                </div>
             </div>

             {/* Exercise */}
             <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" /> 运动
                </h3>
                <select 
                   className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                   value={formData.exercise.type}
                   onChange={(e) => setFormData(prev => ({ ...prev, exercise: { ...prev.exercise, type: e.target.value } }))}
                >
                   {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {formData.exercise.type !== '无' && (
                  <div className="flex items-center gap-2">
                    <input 
                       type="number" 
                       placeholder="时长"
                       className="flex-1 p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                       value={formData.exercise.duration || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, exercise: { ...prev.exercise, duration: Number(e.target.value) } }))}
                    />
                    <span className="text-sm text-gray-500">分钟</span>
                  </div>
                )}
             </div>
          </section>

          {/* Pain & Symptoms */}
          <section className="bg-white p-4 rounded-xl shadow-sm space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" /> 疼痛 / 不适
                </h3>
                <button onClick={addPainEntry} className="text-xs text-primary flex items-center gap-1 font-medium px-2 py-1 bg-primary/10 rounded-full">
                  <Plus className="w-3 h-3" /> 添加
                </button>
             </div>
             
             {formData.pain.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-2">无身体不适</div>
             ) : (
                <div className="space-y-3">
                   {formData.pain.map((p, idx) => (
                      <div key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div className="flex justify-between items-start mb-2">
                            <input 
                               type="text" 
                               placeholder="部位/症状 (如: 头痛)"
                               className="bg-transparent font-medium text-sm w-full focus:outline-none placeholder-gray-400"
                               value={p.location}
                               onChange={(e) => updatePainEntry(idx, 'location', e.target.value)}
                            />
                            <button onClick={() => removePainEntry(idx)} className="text-gray-400 hover:text-red-500 ml-2">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">程度</span>
                            <input 
                              type="range" min="1" max="10" 
                              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                              value={p.level}
                              onChange={(e) => updatePainEntry(idx, 'level', Number(e.target.value))}
                            />
                            <span className="text-xs font-bold text-red-600 w-4 text-center">{p.level}</span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </section>

           {/* Women's Health & Intimacy */}
           <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-pink-400">🌸</span> 生理 & 亲密关系
            </h3>
            
            <div className="flex items-center justify-between">
               <span className="text-sm text-gray-600 flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> 性生活</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.sexualActivity}
                    onChange={(e) => handleChange('sexualActivity', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
            </div>

            <div className="space-y-2">
               <span className="text-sm text-gray-600 flex items-center gap-2"><Droplets className="w-4 h-4 text-pink-500" /> 月经流量</span>
               <div className="grid grid-cols-4 gap-2">
                  {Object.values(MenstruationFlow).map((flow) => (
                    <button
                      key={flow}
                      onClick={() => handleChange('menstruation', flow)}
                      className={`text-xs py-2 rounded-lg border transition-all ${
                        formData.menstruation === flow 
                        ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold' 
                        : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {flow === 'None' ? '无' : flow === 'Light' ? '少量' : flow === 'Medium' ? '中等' : '大量'}
                    </button>
                  ))}
               </div>
            </div>
          </section>

          {/* Medications */}
          <section className="bg-white p-4 rounded-xl shadow-sm">
             <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
               <Pill className="w-5 h-5 text-red-400" /> 药品 / 补剂
             </h3>
             <div className="flex gap-2 mb-3">
               <input 
                 type="text" 
                 placeholder="添加药物名称..." 
                 className="flex-1 p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                 value={newMed}
                 onChange={(e) => setNewMed(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addMedication()}
               />
               <button onClick={addMedication} className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                 <Plus className="w-5 h-5 text-gray-600" />
               </button>
             </div>
             <div className="flex flex-wrap gap-2">
               {formData.medications.map((med, idx) => (
                 <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                   {med}
                   <button onClick={() => removeMedication(idx)}><X className="w-3 h-3" /></button>
                 </span>
               ))}
               {formData.medications.length === 0 && <span className="text-sm text-gray-400 italic">无记录</span>}
             </div>
          </section>

          {/* General Notes */}
          <section className="bg-white p-4 rounded-xl shadow-sm">
             <textarea 
               rows={3}
               placeholder="其他备注..."
               className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm resize-none focus:outline-none focus:border-primary/50"
               value={formData.notes}
               onChange={(e) => handleChange('notes', e.target.value)}
             ></textarea>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DayModal;
