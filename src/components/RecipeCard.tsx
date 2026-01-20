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
        </div>
      </div>
    </button>
  );
}
