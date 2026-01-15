'use client';

import { useMealPlan } from '@/context/MealPlanContext';

const SERVING_OPTIONS = [2, 3, 4, 5];

export function ServingSizeSelector() {
  const { servingSize, setServingSize } = useMealPlan();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Servings:</span>
      <div className="flex gap-1">
        {SERVING_OPTIONS.map((size) => (
          <button
            key={size}
            onClick={() => setServingSize(size)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              servingSize === size
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
