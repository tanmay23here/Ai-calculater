import React from 'react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  onReset: () => void;
  onCalculate: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onReset, onCalculate }) => {
  return (
    <div className="fixed top-4 right-4 flex gap-3 z-20">
      <Button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
      >
        Reset
      </Button>
      <Button
        onClick={onCalculate}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
      >
        Calculate
      </Button>
    </div>
  );
};

export default Toolbar;