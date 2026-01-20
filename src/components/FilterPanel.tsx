'use client';

import { useState } from 'react';

export interface Filters {
  proteins: string[];
  carbs: string[];
  time: 'quick' | 'medium' | 'long' | null;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  recipeCounts: {
    proteins: Record<string, number>;
    carbs: Record<string, number>;
    time: Record<string, number>;
  };
}

const PROTEIN_ORDER = ['Chicken', 'Beef', 'Pork', 'Lamb', 'Duck', 'Turkey', 'Fish', 'Seafood', 'Vegetarian'];
const CARB_ORDER = ['Rice', 'Pasta', 'Potato', 'Noodles', 'Bread', 'Gnocchi', 'Couscous', 'Quinoa'];

export function FilterPanel({ filters, onChange, recipeCounts }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleProtein = (protein: string) => {
    const newProteins = filters.proteins.includes(protein)
      ? filters.proteins.filter(p => p !== protein)
      : [...filters.proteins, protein];
    onChange({ ...filters, proteins: newProteins });
  };

  const toggleCarb = (carb: string) => {
    const newCarbs = filters.carbs.includes(carb)
      ? filters.carbs.filter(c => c !== carb)
      : [...filters.carbs, carb];
    onChange({ ...filters, carbs: newCarbs });
  };

  const toggleTime = (time: 'quick' | 'medium' | 'long') => {
    onChange({ ...filters, time: filters.time === time ? null : time });
  };

  const clearFilters = () => {
    onChange({ proteins: [], carbs: [], time: null });
  };

  const activeFilterCount = filters.proteins.length + filters.carbs.length + (filters.time ? 1 : 0);

  // Sort proteins and carbs by predefined order, filtering to only those with recipes
  const availableProteins = PROTEIN_ORDER.filter(p => recipeCounts.proteins[p] > 0);
  const availableCarbs = CARB_ORDER.filter(c => recipeCounts.carbs[c] > 0);

  return (
    <div className="mb-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter content */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Protein filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Protein</h3>
            <div className="flex flex-wrap gap-2">
              {availableProteins.map(protein => (
                <button
                  key={protein}
                  onClick={() => toggleProtein(protein)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.proteins.includes(protein)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {protein} ({recipeCounts.proteins[protein]})
                </button>
              ))}
            </div>
          </div>

          {/* Carb filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Carbs</h3>
            <div className="flex flex-wrap gap-2">
              {availableCarbs.map(carb => (
                <button
                  key={carb}
                  onClick={() => toggleCarb(carb)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.carbs.includes(carb)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {carb} ({recipeCounts.carbs[carb]})
                </button>
              ))}
            </div>
          </div>

          {/* Time filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Prep Time</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleTime('quick')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.time === 'quick'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Quick (&le;25 min) ({recipeCounts.time.quick || 0})
              </button>
              <button
                onClick={() => toggleTime('medium')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.time === 'medium'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Medium (25-45 min) ({recipeCounts.time.medium || 0})
              </button>
              <button
                onClick={() => toggleTime('long')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.time === 'long'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Long (&gt;45 min) ({recipeCounts.time.long || 0})
              </button>
            </div>
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
