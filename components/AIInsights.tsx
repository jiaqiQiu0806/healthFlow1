import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { analyzeHealthData } from '../services/geminiService';
import { Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface AIInsightsProps {
  records: HealthRecord[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ records }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setIsOpen(true);
    try {
      const result = await analyzeHealthData(records);
      setInsight(result);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !insight) {
    return (
      <button 
        onClick={handleAnalyze}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between group mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm sm:text-base">AI 健康周报</h3>
            <p className="text-xs text-purple-100">点击生成本周健康分析</p>
          </div>
        </div>
        {loading && <RefreshCw className="w-5 h-5 animate-spin" />}
      </button>
    );
  }

  return (
    <div className="w-full bg-white border border-purple-100 p-4 rounded-xl shadow-sm mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
      
      <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-2 text-purple-700 font-semibold">
           <Sparkles className="w-5 h-5" />
           <h3>AI 分析建议</h3>
         </div>
         <button 
           onClick={handleAnalyze} 
           disabled={loading}
           className="p-1 hover:bg-purple-50 rounded-full text-purple-400"
         >
           <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
         </button>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed min-h-[80px]">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 animate-pulse">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            正在分析您的健康数据...
          </div>
        ) : (
          <p>{insight}</p>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
         <p className="text-xs text-gray-400 text-center">AI 建议仅供参考，不作为医疗诊断依据。</p>
      </div>
    </div>
  );
};

export default AIInsights;