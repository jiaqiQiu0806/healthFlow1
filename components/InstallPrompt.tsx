import React, { useState, useEffect } from 'react';
import { Share, SquarePlus, X } from 'lucide-react';

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Check if running in standalone mode (already installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone;
    
    // Show prompt only on iOS browsers, NOT in standalone app
    if (isIOS && !isStandalone) {
      // Delay slightly to not annoy user immediately
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 animate-slide-up pb-8 sm:pb-5">
      <div className="flex justify-between items-start mb-3">
         <div>
           <h3 className="font-bold text-gray-800 text-lg">安装 HealthFlow</h3>
           <p className="text-sm text-gray-500">添加到主屏幕以获得最佳体验</p>
         </div>
         <button onClick={() => setShowPrompt(false)} className="p-1 bg-gray-100 rounded-full text-gray-500">
           <X className="w-5 h-5" />
         </button>
      </div>
      
      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="bg-white p-2 rounded shadow-sm text-blue-500"><Share className="w-5 h-5" /></span>
          <span>1. 点击浏览器底部的 <b>分享</b> 按钮</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
           <span className="bg-white p-2 rounded shadow-sm text-gray-600"><SquarePlus className="w-5 h-5" /></span>
           <span>2. 选择 <b>添加到主屏幕</b></span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">安装后，App 将全屏运行且无需重复登录</p>
      </div>
    </div>
  );
};