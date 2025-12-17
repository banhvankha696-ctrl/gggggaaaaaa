import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  imageSrc: string | null;
  onImageUpload: (base64: string, mimeType: string) => void;
  onClearImage: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageSrc, onImageUpload, onClearImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageUpload(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageUpload(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!imageSrc ? (
        <div
          onClick={triggerUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer min-h-[300px] group"
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-slate-700 font-semibold text-lg mb-2">Tải ảnh lên hoặc kéo thả vào đây</p>
          <p className="text-slate-400 text-sm">Hỗ trợ JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
          <img
            src={imageSrc}
            alt="Uploaded Preview"
            className="w-full h-auto max-h-[400px] object-contain bg-slate-100"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <button
              onClick={triggerUpload}
              className="bg-white/90 hover:bg-white text-slate-800 px-4 py-2 rounded-lg font-medium mr-2 flex items-center gap-2"
             >
                <ImageIcon size={18} /> Thay ảnh
             </button>
          </div>
          <button
            onClick={onClearImage}
            className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-red-500 p-2 rounded-full shadow-lg transition-all"
            title="Xóa ảnh"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};