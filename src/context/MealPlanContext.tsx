'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RecipeSummary } from '@/types/recipe';

const MAX_SELECTIONS = 5;
const STORAGE_KEY = 'gousto-meal-plan';

interface MealPlanState {
  selectedRecipes: RecipeSummary[];
  confirmedRecipes: RecipeSummary[];
}

interface MealPlanContextType {
  selectedRecipes: RecipeSummary[];
  confirmedRecipes: RecipeSummary[];
  isSelected: (slug: string) => boolean;
  toggleRecipe: (recipe: RecipeSummary) => void;
  canSelectMore: boolean;
  confirmSelection: () => void;
  clearSelection: () => void;
  startNewSelection: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MealPlanState>({
    selectedRecipes: [],
    confirmedRecipes: [],
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MealPlanState;
        setState(parsed);
      } catch {
        // Invalid data, ignore
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const isSelected = (slug: string) => {
    return state.selectedRecipes.some(r => r.slug === slug);
  };

  const toggleRecipe = (recipe: RecipeSummary) => {
    setState(prev => {
      const exists = prev.selectedRecipes.some(r => r.slug === recipe.slug);
      if (exists) {
        return {
          ...prev,
          selectedRecipes: prev.selectedRecipes.filter(r => r.slug !== recipe.slug),
        };
      }
      if (prev.selectedRecipes.length >= MAX_SELECTIONS) {
        return prev;
      }
      return {
        ...prev,
        selectedRecipes: [...prev.selectedRecipes, recipe],
      };
    });
  };

  const confirmSelection = () => {
    setState(prev => ({
      ...prev,
      confirmedRecipes: [...prev.selectedRecipes],
      selectedRecipes: [],
    }));
  };

  const clearSelection = () => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [],
    }));
  };

  const startNewSelection = () => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [],
    }));
  };

  const canSelectMore = state.selectedRecipes.length < MAX_SELECTIONS;

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <MealPlanContext.Provider
      value={{
        selectedRecipes: state.selectedRecipes,
        confirmedRecipes: state.confirmedRecipes,
        isSelected,
        toggleRecipe,
        canSelectMore,
        confirmSelection,
        clearSelection,
        startNewSelection,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
