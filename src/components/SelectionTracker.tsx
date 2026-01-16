'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMealPlan } from '@/context/MealPlanContext';

export function SelectionTracker() {
  const { selectedRecipes, clearSelection } = useMealPlan();

  if (selectedRecipes.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected recipes thumbnails */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-700 shrink-0">
              {selectedRecipes.length}/5 selected
            </span>
            <div className="flex gap-2 overflow-x-auto">
              {selectedRecipes.map((recipe) => (
                <div
                  key={recipe.slug}
                  className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100"
                  title={recipe.title}
                >
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 5 - selectedRecipes.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
            <Link
              href="/review"
              className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Review & Save
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
