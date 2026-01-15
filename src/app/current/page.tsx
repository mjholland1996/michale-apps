'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMealPlan } from '@/context/MealPlanContext';

export default function CurrentMealsPage() {
  const { confirmedRecipes, startNewSelection } = useMealPlan();

  if (confirmedRecipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No meal plan yet</h1>
          <p className="text-gray-600 mb-6">Select and confirm recipes to create your meal plan.</p>
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Meal Plan</h1>
            <p className="text-gray-600 mt-1">{confirmedRecipes.length} meals for this week</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/shopping-list"
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Shopping List
            </Link>
            <button
              onClick={startNewSelection}
              className="px-4 py-2 text-emerald-600 font-medium border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <Link href="/">Choose New Meals</Link>
            </button>
          </div>
        </div>
      </header>

      {/* Meals grid */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {confirmedRecipes.map((recipe, index) => (
            <Link
              key={recipe.slug}
              href={`/recipe/${recipe.slug}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
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
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Meal {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.prepTimes.for2} min
                  </span>
                </div>
                <p className="mt-3 text-emerald-600 text-sm font-medium">
                  View recipe &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
