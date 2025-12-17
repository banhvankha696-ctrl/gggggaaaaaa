import React, { useState } from 'react';
import { Copy, Check, Sparkles, Wand2 } from 'lucide-react';
import { AppState } from '../types';

interface PromptResultProps {
  prompt: string;
  appState: AppState;
  onGenerate: () => void;
  isDisabled: boolean;
}

export const PromptResult: React.FC<PromptResultProps> = ({ prompt, appState, onGenerate, isDisabled }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Kết quả Prompt
        </h2>
        {prompt && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Đã sao chép" : "Sao chép"}
          </button>
        )}
      </div>

      <div className="flex-grow relative bg-slate-50 rounded-xl border border-slate-100 p-4 min-h-[200px] mb-6 overflow-hidden">
        {appState === AppState.LOADING ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-blue-600 font-medium animate-pulse">Đang phân tích ảnh...</p>
          </div>
        ) : null}

        {prompt ? (
            <textarea
              readOnly
              className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-slate-700 leading-relaxed text-sm md:text-base font-mono"
              value={prompt}
            />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
            Kết quả prompt sẽ hiện thị ở đây sau khi bạn tải ảnh lên và nhấn nút tạo.
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={isDisabled || appState === AppState.LOADING}
        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
          isDisabled || appState === AppState.LOADING
            ? "bg-slate-300 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25"
        }`}
      >
        {appState === AppState.LOADING ? (
          "Đang xử lý..."
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Tạo Prompt Ngay
          </>
        )}
      </button>
    </div>
  );
};