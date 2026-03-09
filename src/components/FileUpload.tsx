import React, { useState } from 'react';
import { Upload, X, File, Image as ImageIcon, Video } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxImages: number;
  maxVideos: number;
  maxVideoSizeMB: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, maxImages, maxVideos, maxVideoSizeMB }) => {
  const [previews, setPreviews] = useState<{ file: File; url: string; type: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setError(null);

    const images = files.filter(f => f.type.startsWith('image/'));
    const videos = files.filter(f => f.type.startsWith('video/'));

    const currentImages = previews.filter(p => p.type.startsWith('image/')).length;
    const currentVideos = previews.filter(p => p.type.startsWith('video/')).length;

    if (currentImages + images.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    if (currentVideos + videos.length > maxVideos) {
      setError(`Maximum ${maxVideos} videos allowed.`);
      return;
    }

    const oversizedVideo = videos.find(v => v.size > maxVideoSizeMB * 1024 * 1024);
    if (oversizedVideo) {
      setError(`Video "${oversizedVideo.name}" exceeds ${maxVideoSizeMB}MB limit.`);
      return;
    }

    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type
    }));

    setPreviews([...previews, ...newPreviews]);
    onUpload([...previews.map(p => p.file), ...files]);
  };

  const removeFile = (index: number) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    onUpload(newPreviews.map(p => p.file));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-bold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-400">Images (max {maxImages}) & Videos (max {maxVideos}, {maxVideoSizeMB}MB)</p>
          </div>
          <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*,video/*" />
        </label>
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
              {preview.type.startsWith('image/') ? (
                <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => removeFile(idx)}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
