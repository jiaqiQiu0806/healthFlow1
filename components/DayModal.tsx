import React, { useState, useEffect } from 'react';
import { HealthRecord, DEFAULT_RECORD, MenstruationFlow } from '../types';
import { X, Save, Moon, Coffee, Pill, Flame, Heart, Droplets, Activity, Plus, Trash2 } from 'lucide-react';

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
        setFormData(existingRecord);
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-slate-50 w-full max-w-lg h-[90vh] sm:h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out">
        
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
          
          {/* Diet Section */}
          <section className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-orange-400">🥗</span> 饮食
            </h3>
            <div className="space-y-2">
              <input 
                type="text" placeholder="早餐" 
                className="w-full p-2 bg-gray-50 rounded border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                value={formData.diet.breakfast}
                onChange={(e) => handleDietChange('breakfast', e.target.value)}
              />
              <input 
                type="text" placeholder="午餐" 
                className="w-full p-2 bg-gray-50 rounded border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                value={formData.diet.lunch}
                onChange={(e) => handleDietChange('lunch', e.target.value)}
              />
              <input 
                type="text" placeholder="晚餐" 
                className="w-full p-2 bg-gray-50 rounded border border-gray-100 focus:outline-none focus:border-primary/50 text-sm"
                value={formData.diet.dinner}
                onChange={(e) => handleDietChange('dinner', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600 flex items-center gap-1"><Coffee className="w-4 h-4" /> 含糖饮料</span>
              <div className="flex items-center gap-3">
                 <button 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                  onClick={() => handleChange('sugaryDrinks', Math.max(0, formData.sugaryDrinks - 1))}
                 >-</button>
                 <span className="font-medium w-4 text-center">{formData.sugaryDrinks}</span>
                 <button 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                  onClick={() => handleChange('sugaryDrinks', formData.sugaryDrinks + 1)}
                 >+</button>
              </div>
            </div>
          </section>

          {/* Sleep & Exercise */}
          <section className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Moon className="w-5 h-5 text-indigo-400" /> 睡眠
                </h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-center font-bold text-lg"
                    value={formData.sleepHours}
                    onChange={(e) => handleChange('sleepHours', Number(e.target.value))}
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">小时</span>
                </div>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-green-500" /> 运动
                </h3>
                 <input 
                    type="text" 
                    placeholder="跑步, 瑜伽..." 
                    className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                    value={formData.exercise}
                    onChange={(e) => handleChange('exercise', e.target.value)}
                  />
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

          {/* Pain & Symptoms */}
          <section className="bg-white p-4 rounded-xl shadow-sm space-y-3">
             <h3 className="font-semibold text-gray-700 flex items-center gap-2">
               <Flame className="w-5 h-5 text-orange-500" /> 疼痛 / 不适
             </h3>
             <div>
               <label className="text-xs text-gray-500 mb-1 block">疼痛等级 (0 - 10)</label>
               <input 
                 type="range" min="0" max="10" step="1"
                 className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                 value={formData.pain.level}
                 onChange={(e) => setFormData(prev => ({ ...prev, pain: { ...prev.pain, level: Number(e.target.value) } }))}
               />
               <div className="flex justify-between text-xs text-gray-400 mt-1">
                 <span>无痛</span>
                 <span className="text-orange-600 font-bold text-base">{formData.pain.level}</span>
                 <span>剧痛</span>
               </div>
             </div>
             <input 
                type="text" 
                placeholder="疼痛部位或症状描述..." 
                className="w-full p-2 bg-gray-50 rounded border border-gray-100 text-sm"
                value={formData.pain.location}
                onChange={(e) => setFormData(prev => ({ ...prev, pain: { ...prev.pain, location: e.target.value } }))}
              />
          </section>

          {/* General Notes */}
          <section className="bg-white p-4 rounded-xl shadow-sm">
             <textarea 
               rows={3}
               placeholder="其他备注 (心情, 状态...)"
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