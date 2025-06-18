import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  isEraser: boolean;
  onToggleEraser: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isEraser,
  onToggleEraser
}) => {
  const colors = [
    '#ff0000', '#ffaa00', '#ffff00', '#aa7700', '#88aa00', '#00aa00',
    '#aa00aa', '#0000aa', '#0088aa', '#00aaaa', '#88aa88', '#000000',
    '#888888', '#aaaaaa', '#ffffff'
  ];

  return (
    <>
      {/* Left side icons */}
      <div className="fixed left-4 top-32 flex flex-col gap-4 z-20">
        {/* Color wheel icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-conic border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
        
        {/* Menu/hamburger icon */}
        <div className="w-12 h-12 bg-yellow-400 rounded-lg shadow-lg flex items-center justify-center">
          <div className="flex flex-col gap-1">
            <div className="w-6 h-1 bg-white rounded"></div>
            <div className="w-6 h-1 bg-white rounded"></div>
            <div className="w-6 h-1 bg-white rounded"></div>
          </div>
        </div>
        
        {/* AI/robot icon */}
        <div className="w-12 h-12 bg-cyan-400 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-cyan-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Color picker panel */}
      <div className="fixed left-20 top-32 bg-white rounded-lg shadow-lg p-4 z-20" style={{ width: '200px' }}>
        {/* Large gradient area */}
        <div className="mb-3">
          <div className="w-full h-32 bg-gradient-to-br from-yellow-300 via-orange-400 to-black rounded border border-gray-200 relative">
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full border border-gray-400"></div>
          </div>
        </div>

        {/* Horizontal gradient bars */}
        <div className="mb-3 space-y-1">
          <div className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 rounded"></div>
          <div className="w-full h-4 bg-gradient-to-r from-yellow-200 to-yellow-600 rounded"></div>
        </div>

        {/* Color swatches grid */}
        <div className="grid grid-cols-6 gap-1">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded border ${
                selectedColor === color ? 'border-2 border-gray-800' : 'border border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>

        {/* Brush size slider */}
        <div className="mt-4">
          <label className="block text-xs text-gray-600 mb-1">
            Size: {brushSize}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Eraser toggle */}
        <button
          onClick={onToggleEraser}
          className={`w-full mt-3 py-2 px-3 rounded text-sm font-medium transition-colors ${
            isEraser
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isEraser ? 'Eraser' : 'Brush'}
        </button>
      </div>
    </>
  );
};

export default ColorPicker;