'use client';

import { useState, useMemo } from 'react';
import { RecipeGrid } from '@/components/RecipeGrid';
import { SelectionTracker } from '@/components/SelectionTracker';
import { ServingSizeSelector } from '@/components/ServingSizeSelector';
import { FilterPanel, Filters } from '@/components/FilterPanel';
import { RecipeSummary } from '@/types/recipe';
import recipesData from '../../data/recipes-index.json';

function getTimeCategory(prepTime: number): string {
  if (prepTime <= 25) return 'quick';
  if (prepTime <= 45) return 'medium';
  return 'long';
}

export default function BrowsePage() {
  const [filters, setFilters] = useState<Filters>({
    proteins: [],
    carbs: [],
    time: null,
  });

  // Only show recipes that have complete detail data
  const allRecipes = useMemo(
    () => (recipesData as RecipeSummary[]).filter(r => r.hasDetails),
    []
  );

  // Filter recipes based on current filters
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => {
      // Protein filter (OR logic - match any selected protein)
      if (filters.proteins.length > 0) {
        const recipeProteins = recipe.proteins ?? [];
        if (!filters.proteins.some(p => recipeProteins.includes(p))) {
          return false;
        }
      }

      // Carb filter (OR logic - match any selected carb)
      if (filters.carbs.length > 0) {
        const recipeCarbs = recipe.carbs ?? [];
        if (!filters.carbs.some(c => recipeCarbs.includes(c))) {
          return false;
        }
      }

      // Time filter
      if (filters.time) {
        const timeCategory = getTimeCategory(recipe.prepTimes.for2);
        if (timeCategory !== filters.time) {
          return false;
        }
      }

      return true;
    });
  }, [allRecipes, filters]);

  // Compute counts for filter badges (based on all recipes, not filtered)
  const recipeCounts = useMemo(() => {
    const proteins: Record<string, number> = {};
    const carbs: Record<string, number> = {};
    const time: Record<string, number> = {};

    for (const recipe of allRecipes) {
      // Count proteins
      for (const p of recipe.proteins ?? []) {
        proteins[p] = (proteins[p] ?? 0) + 1;
      }

      // Count carbs
      for (const c of recipe.carbs ?? []) {
        carbs[c] = (carbs[c] ?? 0) + 1;
      }

      // Count time categories
      const timeCategory = getTimeCategory(recipe.prepTimes.for2);
      time[timeCategory] = (time[timeCategory] ?? 0) + 1;
    }

    return { proteins, carbs, time };
  }, [allRecipes]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Choose Your Meals</h1>
              <p className="text-gray-600 mt-1">Select up to 5 recipes for your weekly meal plan</p>
            </div>
            <ServingSizeSelector />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          recipeCounts={recipeCounts}
        />

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredRecipes.length} of {allRecipes.length} recipes
        </p>

        <RecipeGrid recipes={filteredRecipes} />
      </main>

      {/* Selection tracker */}
      <SelectionTracker />
    </div>
  );
}
