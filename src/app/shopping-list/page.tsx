'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMealPlan } from '@/context/MealPlanContext';
import { getRecipeDetails } from '@/app/actions';
import { combineIngredients, formatQuantity, CombinedIngredient } from '@/lib/quantities';
import { RecipeDetail } from '@/types/recipe';

export default function ShoppingListPage() {
  const { confirmedRecipes, servingSize } = useMealPlan();
  const [ingredients, setIngredients] = useState<CombinedIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetail[]>([]);

  useEffect(() => {
    async function loadIngredients() {
      if (confirmedRecipes.length === 0) {
        setIngredients([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch recipe details
      const slugs = confirmedRecipes.map(r => r.slug);
      const details = await getRecipeDetails(slugs);
      setRecipeDetails(details);

      // Process ingredients for each recipe
      const ingredientLists = details.map(recipe => {
        // Find the portion size entry for the selected serving size
        const portionEntry = recipe.portionSizes?.find(ps => ps.portions === servingSize)
          ?? recipe.portionSizes?.find(ps => ps.portions === 2); // fallback to 2

        const portionIngredients = portionEntry?.ingredients ?? [];
        const quantityMap = new Map(portionIngredients.map(pi => [pi.id, pi.quantity]));
        const ingredientIds = portionIngredients.map(pi => pi.id);

        // Filter and map ingredients
        const filteredIngredients = recipe.ingredients
          .filter(ing => ingredientIds.length === 0 || ingredientIds.includes(ing.id))
          .map(ing => ({
            id: ing.id,
            name: ing.name,
            label: ing.label,
            imageUrl: ing.imageUrl,
            quantity: quantityMap.get(ing.id) ?? 1,
          }));

        return {
          recipeTitle: recipe.title,
          ingredients: filteredIngredients,
        };
      });

      // Combine ingredients across recipes
      const combined = combineIngredients(ingredientLists);
      setIngredients(combined);
      setLoading(false);
    }

    loadIngredients();
  }, [confirmedRecipes, servingSize]);

  if (confirmedRecipes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              &larr; Choose meals
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Meals Selected</h1>
            <p className="text-gray-600 mb-6">
              Confirm your meal selection to generate a shopping list.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Choose Meals
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/current" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            &larr; Back to meal plan
          </Link>
          <span className="text-sm text-gray-500">
            {servingSize} servings
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-gray-600 mt-1">
            Combined ingredients for {confirmedRecipes.length} recipe{confirmedRecipes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Recipe summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Recipes included:</h2>
          <div className="flex flex-wrap gap-2">
            {recipeDetails.map(recipe => (
              <Link
                key={recipe.slug}
                href={`/recipe/${recipe.slug}`}
                className="text-sm text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full"
              >
                {recipe.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Loading shopping list...</p>
          </div>
        ) : (
          /* Ingredient list */
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {ingredients.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No ingredients found.</p>
            ) : (
              ingredients.map((ingredient, index) => (
                <div key={`${ingredient.name}-${index}`} className="p-4 flex items-center gap-4">
                  {/* Image */}
                  {ingredient.imageUrl && (
                    <div className="relative w-12 h-12 rounded bg-gray-100 shrink-0">
                      <Image
                        src={ingredient.imageUrl}
                        alt={ingredient.displayName}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                  )}

                  {/* Name and quantity */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{ingredient.displayName}</p>
                    {ingredient.recipeCount > 1 && (
                      <p className="text-sm text-gray-500">
                        From {ingredient.recipeCount} recipes
                      </p>
                    )}
                  </div>

                  {/* Total quantity */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-emerald-600 text-lg">
                      {formatQuantity(ingredient.totalAmount, ingredient.unit)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Basics reminder */}
        {recipeDetails.length > 0 && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-medium text-amber-800 mb-2">Don&apos;t forget the basics!</h3>
            <p className="text-sm text-amber-700">
              {(() => {
                const allBasics = new Set<string>();
                recipeDetails.forEach(r => r.basics?.forEach(b => allBasics.add(b)));
                return Array.from(allBasics).join(', ') || 'Check individual recipes for pantry staples';
              })()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
