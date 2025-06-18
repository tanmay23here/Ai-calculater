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
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80',
    '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
    '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#000000', '#404040', '#808080', '#c0c0c0', '#ffffff'
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 z-20">
      {/* Color Wheel Icon */}
      <div className="mb-4 flex justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Gradient Bar */}
      <div className="mb-4">
        <div className="w-40 h-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-black rounded"></div>
        <div className="w-40 h-4 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-purple-500 rounded mt-1"></div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-6 gap-1 mb-4">
        {colors.map((color, index) => (
          <button
            key={index}
            className={`w-6 h-6 rounded border-2 ${
              selectedColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>

      {/* Brush Size Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brush Size: {brushSize}px
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

      {/* Eraser Toggle */}
      <button
        onClick={onToggleEraser}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isEraser
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isEraser ? 'Eraser ON' : 'Brush'}
      </button>
    </div>
  );
};

export default ColorPicker;