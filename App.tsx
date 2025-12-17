import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptResult } from './components/PromptResult';
import { generatePromptFromImage } from './services/geminiService';
import { AppState } from './types';
import { ScanEye, AlertCircle, Sparkles, Layers, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [backgroundSuggestion, setBackgroundSuggestion] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (base64: string, type: string) => {
    setImageSrc(base64);
    setMimeType(type);
    setGeneratedPrompt(''); // Reset prompt when new image is uploaded
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setMimeType('');
    setRequirements('');
    setBackgroundSuggestion('');
    setGeneratedPrompt('');
    setErrorMsg(null);
  };

  const handleGenerate = async () => {
    if (!imageSrc || !mimeType) return;

    setAppState(AppState.LOADING);
    setErrorMsg(null);

    try {
      const prompt = await generatePromptFromImage({
        imageBase64: imageSrc,
        imageMimeType: mimeType,
        requirements: requirements,
        backgroundSuggestion: backgroundSuggestion,
      });

      setGeneratedPrompt(prompt);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(error.message || "Đã có lỗi xảy ra khi tạo prompt.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg text-white">
              <ScanEye size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
              PromptCraft AI
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Biến hình ảnh thành <br className="hidden md:block" />
            <span className="text-blue-600">Prompt Chất Lượng Cao</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Tải ảnh lên, thêm gợi ý, và nhận ngay prompt chi tiết được tối ưu hóa cho Midjourney hoặc Stable Diffusion.
          </p>
        </div>

        {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 max-w-5xl mx-auto">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Đã xảy ra lỗi</p>
                <p className="text-sm">{errorMsg}</p>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            {/* Step 1: Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Tải ảnh gốc
              </h3>
              <ImageUploader
                imageSrc={imageSrc}
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
              />
            </div>

            {/* Step 2: Customization */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center gap-2">
                 <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                 Cấu hình Prompt
              </h3>
              
              <div className="space-y-5">
                {/* Requirements Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Palette size={16} className="text-blue-500" />
                    Yêu cầu chung & Phong cách
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="VD: Phong cách Cyberpunk, Tranh sơn dầu, Ánh sáng điện ảnh, Chi tiết sắc nét..."
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none min-h-[80px] resize-none text-slate-700 bg-slate-50 text-sm"
                  />
                </div>

                {/* Background Suggestion Field - NEW */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Layers size={16} className="text-purple-500" />
                    Gợi ý Background (Bối cảnh)
                  </label>
                  <textarea
                     value={backgroundSuggestion}
                     onChange={(e) => setBackgroundSuggestion(e.target.value)}
                     placeholder="VD: Trong một khu rừng phép thuật, Nền trắng studio, Tại quảng trường Time Square..."
                     className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none min-h-[80px] resize-none text-slate-700 bg-slate-50 text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1.5 ml-1">
                    *Để trống nếu muốn giữ nguyên bối cảnh của ảnh gốc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-8rem)]">
             <PromptResult
                prompt={generatedPrompt}
                appState={appState}
                onGenerate={handleGenerate}
                isDisabled={!imageSrc}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;