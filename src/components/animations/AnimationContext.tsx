import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface AnimationContextType {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  animationSpeed: 'slow' | 'normal' | 'fast';
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  getAnimationDuration: (baseMs: number) => number;
}

// Create the context with default values
const AnimationContext = createContext<AnimationContextType>({
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
  animationSpeed: 'normal',
  setAnimationSpeed: () => {},
  getAnimationDuration: (baseMs) => baseMs,
});

// Custom hook to use the animation context
export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
  children: ReactNode;
}

// Provider component
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tarot-animations-enabled');
    return saved !== null ? saved === 'true' : true; // Default to true
  });

  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>(() => {
    const saved = localStorage.getItem('tarot-animation-speed');
    return (saved as 'slow' | 'normal' | 'fast') || 'normal'; // Default to normal
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tarot-animations-enabled', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('tarot-animation-speed', animationSpeed);
  }, [animationSpeed]);

  // Helper function to get adjusted animation duration based on speed setting
  const getAnimationDuration = (baseMs: number): number => {
    if (!animationsEnabled) return 0;
    
    switch (animationSpeed) {
      case 'slow': return baseMs * 1.5;
      case 'fast': return baseMs * 0.6;
      case 'normal':
      default: return baseMs;
    }
  };

  const value = {
    animationsEnabled,
    setAnimationsEnabled,
    animationSpeed,
    setAnimationSpeed,
    getAnimationDuration,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};