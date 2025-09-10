import React from 'react';

interface StyleStrengthSliderProps {
  strength: number;
  onStrengthChange: (strength: number) => void;
  disabled?: boolean;
}

export const StyleStrengthSlider: React.FC<StyleStrengthSliderProps> = ({ strength, onStrengthChange, disabled }) => {
  return (
    <div className="mt-6">
      <label htmlFor="style-strength" className="block text-center text-lg font-medium text-gray-300">
        Style Influence
      </label>
      <div className="flex items-center gap-4 mt-2">
        <span className="text-sm text-gray-400">Low</span>
        <input
          id="style-strength"
          type="range"
          min="20"
          max="100"
          step="5"
          value={strength}
          onChange={(e) => onStrengthChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Style influence strength"
        />
        <span className="text-sm text-gray-400">High</span>
      </div>
      <p className="text-center text-sm text-gray-400 mt-1">
        Controls how strongly the reference style is applied. Current: <span className="font-semibold text-purple-400">{strength}%</span>
      </p>
    </div>
  );
};