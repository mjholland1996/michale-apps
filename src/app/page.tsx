import { RecipeGrid } from '@/components/RecipeGrid';
import { SelectionTracker } from '@/components/SelectionTracker';
import { ServingSizeSelector } from '@/components/ServingSizeSelector';
import { RecipeSummary } from '@/types/recipe';
import recipesData from '../../data/recipes-index.json';

export default function BrowsePage() {
  // Only show recipes that have complete detail data (portion sizes, ingredients, etc.)
  const recipes = (recipesData as RecipeSummary[]).filter(r => r.hasDetails);

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
        <RecipeGrid recipes={recipes} />
      </main>

      {/* Selection tracker */}
      <SelectionTracker />
    </div>
  );
}
