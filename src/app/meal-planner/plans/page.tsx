'use client';

import Link from 'next/link';
import { useMealPlan } from '@/context/MealPlanContext';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SavedPlansPage() {
  const { savedPlans, loadPlan, deletePlan, currentPlanId } = useMealPlan();

  const handleLoad = (id: string) => {
    loadPlan(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/meal-planner/current" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            &larr; Back to current plan
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Saved Meal Plans</h1>
          <p className="text-gray-600 mt-1">
            {savedPlans.length} {savedPlans.length === 1 ? 'plan' : 'plans'} saved
          </p>
        </div>
      </header>

      {/* Plans list */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {savedPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved plans yet</h2>
            <p className="text-gray-600 mb-6">
              Create a meal plan and save it to access it later.
            </p>
            <Link
              href="/meal-planner"
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPlans.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-xl shadow-sm p-4 ${
                    isCurrent ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        {isCurrent && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Saved {formatDate(plan.savedAt)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{plan.recipes.length} recipes</span>
                        <span>{plan.servingSize} servings</span>
                      </div>
                      {/* Recipe titles preview */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {plan.recipes.slice(0, 3).map((recipe) => (
                          <span
                            key={recipe.slug}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {recipe.title.length > 25
                              ? recipe.title.substring(0, 25) + '...'
                              : recipe.title}
                          </span>
                        ))}
                        {plan.recipes.length > 3 && (
                          <span className="text-gray-500 text-xs py-1">
                            +{plan.recipes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {!isCurrent && (
                        <button
                          onClick={() => handleLoad(plan.id)}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Load
                        </button>
                      )}
                      {isCurrent && (
                        <Link
                          href="/meal-planner/current"
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          View
                        </Link>
                      )}
                      <button
                        onClick={(e) => handleDelete(plan.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete plan"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick actions */}
        {savedPlans.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/meal-planner"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Create a new meal plan &rarr;
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
