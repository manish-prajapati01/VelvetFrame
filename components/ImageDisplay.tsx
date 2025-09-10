import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
}

const ImageCard: React.FC<{ title: string; imageUrl: string | null; isOriginal?: boolean }> = ({ title, imageUrl, isOriginal = false }) => {
    
    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'cinematic-transformation.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="flex flex-col gap-4">
            <h3 className={`text-2xl font-bold text-center ${isOriginal ? 'text-gray-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500'}`}>{title}</h3>
            <div className="bg-gray-800/50 rounded-2xl p-2 shadow-lg aspect-square relative">
                {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-contain rounded-lg" />}
                {!isOriginal && imageUrl && (
                    <button
                        onClick={handleDownload}
                        aria-label="Download cinematic image"
                        className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <DownloadIcon />
                    </button>
                )}
            </div>
        </div>
    );
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <ImageCard title="Original" imageUrl={originalImage} isOriginal />
      <ImageCard title="Cinematic" imageUrl={generatedImage} />
    </div>
  );
};