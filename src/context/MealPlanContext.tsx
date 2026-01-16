'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RecipeSummary } from '@/types/recipe';

const MAX_SELECTIONS = 5;
const STORAGE_KEY = 'gousto-meal-plan';

const DEFAULT_SERVING_SIZE = 2;

export interface SavedPlan {
  id: string;
  name: string;
  savedAt: string;
  recipes: RecipeSummary[];
  servingSize: number;
}

interface MealPlanState {
  selectedRecipes: RecipeSummary[];
  servingSize: number;
  currentPlanId: string | null;
  currentPlanName: string | null;
  savedPlans: SavedPlan[];
}

interface MealPlanContextType {
  selectedRecipes: RecipeSummary[];
  servingSize: number;
  currentPlanId: string | null;
  currentPlanName: string | null;
  savedPlans: SavedPlan[];
  setServingSize: (size: number) => void;
  isSelected: (slug: string) => boolean;
  toggleRecipe: (recipe: RecipeSummary) => void;
  canSelectMore: boolean;
  clearSelection: () => void;
  savePlan: (name: string) => string;
  loadPlan: (id: string) => void;
  deletePlan: (id: string) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MealPlanState>({
    selectedRecipes: [],
    servingSize: DEFAULT_SERVING_SIZE,
    currentPlanId: null,
    currentPlanName: null,
    savedPlans: [],
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle migration from old format
        const recipes = parsed.selectedRecipes ?? parsed.confirmedRecipes ?? [];
        setState({
          selectedRecipes: recipes,
          servingSize: parsed.servingSize ?? DEFAULT_SERVING_SIZE,
          currentPlanId: parsed.currentPlanId ?? null,
          currentPlanName: parsed.currentPlanName ?? null,
          savedPlans: parsed.savedPlans ?? [],
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
          // Clear current plan association when modifying
          currentPlanId: null,
          currentPlanName: null,
        };
      }
      if (prev.selectedRecipes.length >= MAX_SELECTIONS) {
        return prev;
      }
      return {
        ...prev,
        selectedRecipes: [...prev.selectedRecipes, recipe],
        currentPlanId: null,
        currentPlanName: null,
      };
    });
  };

  const clearSelection = () => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [],
      currentPlanId: null,
      currentPlanName: null,
    }));
  };

  const setServingSize = (size: number) => {
    setState(prev => ({
      ...prev,
      servingSize: size,
    }));
  };

  const savePlan = (name: string): string => {
    const id = generateId();
    const newPlan: SavedPlan = {
      id,
      name,
      savedAt: new Date().toISOString(),
      recipes: state.selectedRecipes,
      servingSize: state.servingSize,
    };

    setState(prev => ({
      ...prev,
      currentPlanId: id,
      currentPlanName: name,
      savedPlans: [newPlan, ...prev.savedPlans],
    }));

    return id;
  };

  const loadPlan = (id: string) => {
    const plan = state.savedPlans.find(p => p.id === id);
    if (plan) {
      setState(prev => ({
        ...prev,
        selectedRecipes: plan.recipes,
        servingSize: plan.servingSize,
        currentPlanId: plan.id,
        currentPlanName: plan.name,
      }));
    }
  };

  const deletePlan = (id: string) => {
    setState(prev => ({
      ...prev,
      savedPlans: prev.savedPlans.filter(p => p.id !== id),
      // Clear current plan if it was deleted
      currentPlanId: prev.currentPlanId === id ? null : prev.currentPlanId,
      currentPlanName: prev.currentPlanId === id ? null : prev.currentPlanName,
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
        currentPlanId: state.currentPlanId,
        currentPlanName: state.currentPlanName,
        savedPlans: state.savedPlans,
        setServingSize,
        isSelected,
        toggleRecipe,
        canSelectMore,
        clearSelection,
        savePlan,
        loadPlan,
        deletePlan,
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
