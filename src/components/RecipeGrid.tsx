'use client';

import { useState } from 'react';
import { RecipeSummary } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: RecipeSummary[];
  pageSize?: number;
}

export function RecipeGrid({ recipes, pageSize = 12 }: RecipeGridProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(recipes.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const visibleRecipes = recipes.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.slug}
            recipe={recipe}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {/* First page */}
            {page > 3 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="w-10 h-10 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  1
                </button>
                {page > 4 && <span className="text-gray-400">...</span>}
              </>
            )}

            {/* Page numbers around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p >= page - 2 && p <= page + 2)
              .map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg ${
                    p === page
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}

            {/* Last page */}
            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => setPage(totalPages)}
                  className="w-10 h-10 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Page info */}
      <p className="text-center text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, recipes.length)} of {recipes.length} recipes
      </p>
    </div>
  );
}
