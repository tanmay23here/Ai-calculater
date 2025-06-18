import React, { useState, useRef, useEffect } from 'react';

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
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const gradientRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#ff0000', '#ffaa00', '#ffff00', '#aa7700', '#88aa00', '#00aa00',
    '#aa00aa', '#0000aa', '#0088aa', '#00aaaa', '#88aa88', '#000000',
    '#888888', '#aaaaaa', '#ffffff'
  ];

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Handle gradient area click/drag
  const handleGradientInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;
    
    const rect = gradientRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSaturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newLightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    
    setSaturation(newSaturation);
    setLightness(newLightness);
    
    const newColor = hslToHex(hue, newSaturation, newLightness);
    onColorChange(newColor);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleGradientInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleGradientInteraction(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle hue slider change
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    const newColor = hslToHex(newHue, saturation, lightness);
    onColorChange(newColor);
  };

  // Handle brightness slider change
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLightness = parseInt(e.target.value);
    setLightness(newLightness);
    const newColor = hslToHex(hue, saturation, newLightness);
    onColorChange(newColor);
  };

  return (
    <>
      {/* Left side icons */}
      <div className="fixed left-4 top-32 flex flex-col gap-4 z-20">
        {/* Color wheel icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-conic border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
        
        {/* Brush/Eraser toggle - Top */}
        <button
          onClick={onToggleEraser}
          className={`w-12 h-12 rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
            isEraser
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-yellow-400 hover:bg-yellow-500'
          }`}
        >
          {isEraser ? (
            // Eraser icon
            <div className="w-6 h-4 bg-white rounded-sm relative">
              <div className="absolute top-0 left-1 w-4 h-1 bg-gray-400 rounded-sm"></div>
            </div>
          ) : (
            // Brush icon
            <div className="w-6 h-6 bg-white rounded-full relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gray-600 rounded-b"></div>
            </div>
          )}
        </button>
        
        {/* Size adjustment */}
        <div className="w-12 h-16 bg-blue-400 rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-xs font-bold">
          <div className="text-[10px]">SIZE</div>
          <div className="text-sm">{brushSize}</div>
        </div>
        
        {/* AI/robot icon */}
        <div className="w-12 h-12 bg-cyan-400 rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-cyan-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Color picker panel */}
      <div className="fixed left-20 top-32 bg-white rounded-lg shadow-lg p-4 z-20" style={{ width: '200px' }}>
        {/* Large gradient area */}
        <div className="mb-3">
          <div 
            ref={gradientRef}
            className="w-full h-32 rounded border border-gray-200 relative cursor-crosshair"
            style={{
              background: `linear-gradient(to bottom, 
                hsl(${hue}, 100%, 50%) 0%, 
                hsl(${hue}, 100%, 50%) 0%, 
                transparent 100%), 
                linear-gradient(to right, 
                white 0%, 
                hsl(${hue}, 100%, 50%) 100%),
                linear-gradient(to bottom, 
                transparent 0%, 
                black 100%)`
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-400 pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          </div>
        </div>

        {/* Horizontal gradient bars */}
        <div className="mb-3 space-y-1">
          {/* Hue slider */}
          <div className="relative">
            <div className="w-full h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 rounded"></div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer"
            />
          </div>
          
          {/* Brightness slider */}
          <div className="relative">
            <div 
              className="w-full h-4 rounded"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hue}, ${saturation}%, 0%) 0%, 
                  hsl(${hue}, ${saturation}%, 50%) 50%, 
                  hsl(${hue}, ${saturation}%, 100%) 100%)`
              }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={handleBrightnessChange}
              className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Color swatches grid */}
        <div className="grid grid-cols-6 gap-1 mb-4">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                selectedColor === color ? 'border-2 border-gray-800 ring-2 ring-blue-300' : 'border border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>

        {/* Brush size slider */}
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Current color display */}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded border-2 border-gray-300"
            style={{ backgroundColor: selectedColor }}
          ></div>
          <div className="text-xs text-gray-600 font-mono">
            {selectedColor.toUpperCase()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;