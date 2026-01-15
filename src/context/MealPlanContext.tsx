'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RecipeSummary } from '@/types/recipe';

const MAX_SELECTIONS = 5;
const STORAGE_KEY = 'gousto-meal-plan';

const DEFAULT_SERVING_SIZE = 2;

interface MealPlanState {
  selectedRecipes: RecipeSummary[];
  servingSize: number;
}

interface MealPlanContextType {
  selectedRecipes: RecipeSummary[];
  servingSize: number;
  setServingSize: (size: number) => void;
  isSelected: (slug: string) => boolean;
  toggleRecipe: (recipe: RecipeSummary) => void;
  canSelectMore: boolean;
  clearSelection: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MealPlanState>({
    selectedRecipes: [],
    servingSize: DEFAULT_SERVING_SIZE,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle migration from old format with confirmedRecipes
        const recipes = parsed.selectedRecipes ?? parsed.confirmedRecipes ?? [];
        setState({
          selectedRecipes: recipes,
          servingSize: parsed.servingSize ?? DEFAULT_SERVING_SIZE,
        });
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

  const clearSelection = () => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [],
    }));
  };

  const setServingSize = (size: number) => {
    setState(prev => ({
      ...prev,
      servingSize: size,
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
        servingSize: state.servingSize,
        setServingSize,
        isSelected,
        toggleRecipe,
        canSelectMore,
        clearSelection,
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
