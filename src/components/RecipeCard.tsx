'use client';

import Image from 'next/image';
import { RecipeSummary } from '@/types/recipe';
import { useMealPlan } from '@/context/MealPlanContext';

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isSelected, toggleRecipe, canSelectMore } = useMealPlan();
  const selected = isSelected(recipe.slug);
  const canToggle = selected || canSelectMore;

  return (
    <button
      onClick={() => canToggle && toggleRecipe(recipe)}
      disabled={!canToggle}
      className={`
        relative flex flex-col rounded-xl overflow-hidden bg-white shadow-md
        transition-all duration-200 text-left
        ${selected ? 'ring-4 ring-emerald-500 shadow-lg' : 'hover:shadow-lg'}
        ${!canToggle ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {/* Prep time */}
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{recipe.prepTimes.for2} min</span>
          </div>

          {/* Rating */}
          {recipe.rating.count > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{recipe.rating.average.toFixed(1)}</span>
              <span className="text-gray-400">({recipe.rating.count.toLocaleString()})</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
