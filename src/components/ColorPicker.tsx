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
  const [showColorPicker, setShowColorPicker] = useState(false);
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

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Update HSL when selectedColor changes
  useEffect(() => {
    if (selectedColor) {
      const [h, s, l] = hexToHsl(selectedColor);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  }, [selectedColor]);

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
        {/* Color wheel icon - clickable */}
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-12 h-12 rounded-full bg-gradient-conic border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div 
            className="w-6 h-6 rounded-full border-2 border-white"
            style={{ backgroundColor: selectedColor }}
          ></div>
        </button>
        
        {/* Brush/Eraser toggle */}
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

      {/* Color picker panel - only show when showColorPicker is true */}
      {showColorPicker && (
        <div className="fixed left-20 top-32 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-30" style={{ width: '280px' }}>
          {/* Close button */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Color Picker</h3>
            <button
              onClick={() => setShowColorPicker(false)}
              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-sm"
            >
              ×
            </button>
          </div>

          {/* Large gradient area */}
          <div className="mb-4">
            <div 
              ref={gradientRef}
              className="w-full h-40 rounded-lg border border-gray-300 relative cursor-crosshair shadow-inner"
              style={{
                background: `
                  linear-gradient(to top, #000 0%, transparent 100%),
                  linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)
                `
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className="absolute w-4 h-4 bg-white rounded-full border-2 border-gray-800 shadow-lg pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
          </div>

          {/* Hue and brightness sliders */}
          <div className="mb-4 space-y-3">
            {/* Hue slider */}
            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">Hue</label>
              <div className="relative h-6 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg shadow-inner">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={handleHueChange}
                  className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800 shadow-lg pointer-events-none"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Brightness slider */}
            <div className="relative">
              <label className="block text-xs text-gray-600 mb-1">Brightness</label>
              <div 
                className="relative h-6 rounded-lg shadow-inner"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%) 0%, 
                    hsl(${hue}, ${saturation}%, 50%) 50%, 
                    hsl(${hue}, ${saturation}%, 100%) 100%)`
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightness}
                  onChange={handleBrightnessChange}
                  className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800 shadow-lg pointer-events-none"
                  style={{
                    left: `${lightness}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Color swatches grid */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-2">Quick Colors</label>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 shadow-sm ${
                    selectedColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Brush size slider */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-2">
              Brush Size: {brushSize}px
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Current color display */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <div>
                <div className="text-xs text-gray-500">Current Color</div>
                <div className="text-sm font-mono text-gray-800">
                  {selectedColor.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ColorPicker;