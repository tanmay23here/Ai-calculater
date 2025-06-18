import React from 'react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  onReset: () => void;
  onCalculate: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onReset, onCalculate }) => {
  return (
    <div className="fixed top-4 right-4 z-20 flex gap-3">
      {/* Reset Button */}
      <Button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
        style={{ minWidth: '100px', height: '50px' }}
      >
        Reset
      </Button>
      
      {/* Calculate Button */}
      <Button
        onClick={onCalculate}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 text-lg"
        style={{ minWidth: '120px', height: '50px' }}
      >
        Calculate
      </Button>
    </div>
  );
};

export default Toolbar;