import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { transformImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrimaryImageSelect = useCallback((file: File) => {
    setPrimaryImage(file);
    setGeneratedImage(null);
    if (primaryImagePreview) {
      URL.revokeObjectURL(primaryImagePreview);
    }
    setPrimaryImagePreview(URL.createObjectURL(file));
  }, [primaryImagePreview]);

  const handleTransform = async () => {
    if (!primaryImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const primaryImageBase64 = await fileToBase64(primaryImage);
      const resultBase64 = await transformImage(primaryImageBase64);
      
      if (resultBase64) {
        setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        throw new Error("The AI model did not return an image. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700">
            <div className="flex justify-center">
              <div className="w-full md:w-3/4 lg:w-1/2">
                <ImageUploader 
                  id="primary-image"
                  title="Upload Your Image"
                  description="The photo you want to make cinematic."
                  onImageSelect={handlePrimaryImageSelect}
                  previewUrl={primaryImagePreview}
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleTransform}
                disabled={!primaryImage || isLoading}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              >
                <SparklesIcon />
                {isLoading ? 'Transforming...' : 'Make it Cinematic'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {generatedImage && primaryImagePreview && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Transformation Result</h2>
              <ImageDisplay
                originalImage={primaryImagePreview}
                generatedImage={generatedImage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;