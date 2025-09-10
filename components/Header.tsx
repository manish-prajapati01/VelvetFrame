
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        VelvetFrame
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        Upload a photo and watch AI transform it into a movie-quality masterpiece, preserving identity while adding dramatic flair.
      </p>
    </header>
  );
};
