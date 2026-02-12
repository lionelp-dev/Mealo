import { useState } from 'react';

export function useMealPlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return {
    isGenerating,
    setIsGenerating,
    isOpen,
    setIsOpen,
  };
}