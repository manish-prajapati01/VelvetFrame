
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onImageSelect, previewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
        <p className="text-sm text-gray-400 -mt-2">{description}</p>
        <label
            htmlFor={id}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
            ${previewUrl ? 'border-purple-500 bg-gray-800' : 'border-gray-600 bg-gray-700/50 hover:border-purple-500 hover:bg-gray-700'}`}
        >
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                    <UploadIcon />
                    <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs">PNG, JPG, or WEBP</p>
                </div>
            )}
            <input
                id={id}
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
        </label>
    </div>
  );
};
