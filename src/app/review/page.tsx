'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMealPlan } from '@/context/MealPlanContext';

function getDefaultPlanName(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `Week of ${now.toLocaleDateString('en-GB', options)}`;
}

export default function ReviewPage() {
  const router = useRouter();
  const { selectedRecipes, servingSize, savePlan, clearSelection } = useMealPlan();
  const [planName, setPlanName] = useState(getDefaultPlanName());

  const handleSave = () => {
    if (selectedRecipes.length === 0) return;
    savePlan(planName.trim() || getDefaultPlanName());
    router.push('/current');
  };

  const handleSkip = () => {
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Review & Save</h1>
          <p className="text-gray-600 mt-1">
            {selectedRecipes.length} recipes for {servingSize} people
          </p>
        </div>
      </header>

      {/* Recipe list */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4 mb-8">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Save this meal plan</h2>
          <div className="mb-4">
            <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">
              Plan name
            </label>
            <input
              type="text"
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g., Week of Jan 13"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <p className="text-sm text-gray-500">
            Saving lets you access this plan later from your saved plans.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={clearSelection}
            className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip Saving
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </main>
    </div>
  );
}
