'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMealPlan } from '@/context/MealPlanContext';

export default function ReviewPage() {
  const router = useRouter();
  const { selectedRecipes, confirmSelection, clearSelection } = useMealPlan();

  const handleConfirm = () => {
    confirmSelection();
    router.push('/current');
  };

  if (selectedRecipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No recipes selected</h1>
          <p className="text-gray-600 mb-6">Go back and select some recipes first.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            &larr; Back to browsing
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Review Your Selection</h1>
          <p className="text-gray-600 mt-1">Confirm these {selectedRecipes.length} recipes for your meal plan</p>
        </div>
      </header>

      {/* Recipe list */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {selectedRecipes.map((recipe, index) => (
            <div
              key={recipe.slug}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex"
            >
              {/* Image */}
              <div className="relative w-32 h-32 shrink-0 bg-gray-100">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-center">
                <span className="text-sm text-emerald-600 font-medium">Meal {index + 1}</span>
                <h3 className="font-semibold text-gray-900 mt-1">{recipe.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.prepTimes.for2} min
                  </span>
                  {recipe.rating.count > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {recipe.rating.average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={clearSelection}
            className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </main>
    </div>
  );
}
