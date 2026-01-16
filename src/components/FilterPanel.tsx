'use client';

import { useState } from 'react';

export interface Filters {
  proteins: string[];
  carbs: string[];
  time: string | null;
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

const PROTEIN_OPTIONS = [
  { id: 'beef', label: 'Beef' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'pork', label: 'Pork' },
  { id: 'lamb', label: 'Lamb' },
  { id: 'duck', label: 'Duck' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'vegetarian', label: 'Vegetarian' },
];

const CARB_OPTIONS = [
  { id: 'pasta', label: 'Pasta' },
  { id: 'potato', label: 'Potato' },
  { id: 'rice', label: 'Rice' },
  { id: 'bread', label: 'Bread' },
  { id: 'grains', label: 'Grains' },
  { id: 'noodles', label: 'Noodles' },
];

const TIME_OPTIONS = [
  { id: 'quick', label: '≤25 min' },
  { id: 'medium', label: '25-45 min' },
  { id: 'long', label: '>45 min' },
];

export function FilterPanel({ filters, onChange, recipeCounts }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleProtein = (id: string) => {
    const newProteins = filters.proteins.includes(id)
      ? filters.proteins.filter(p => p !== id)
      : [...filters.proteins, id];
    onChange({ ...filters, proteins: newProteins });
  };

  const toggleCarb = (id: string) => {
    const newCarbs = filters.carbs.includes(id)
      ? filters.carbs.filter(c => c !== id)
      : [...filters.carbs, id];
    onChange({ ...filters, carbs: newCarbs });
  };

  const setTime = (id: string | null) => {
    onChange({ ...filters, time: filters.time === id ? null : id });
  };

  const clearAll = () => {
    onChange({ proteins: [], carbs: [], time: null });
  };

  const hasFilters = filters.proteins.length > 0 || filters.carbs.length > 0 || filters.time !== null;
  const activeFilterCount = filters.proteins.length + filters.carbs.length + (filters.time ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-emerald-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
            >
              Clear all
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Protein filter */}
          <div className="mt-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Protein</h3>
            <div className="flex flex-wrap gap-2">
              {PROTEIN_OPTIONS.map(option => {
                const count = recipeCounts.proteins[option.id] ?? 0;
                const isSelected = filters.proteins.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleProtein(option.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className={`ml-1 ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carb filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Carbs</h3>
            <div className="flex flex-wrap gap-2">
              {CARB_OPTIONS.map(option => {
                const count = recipeCounts.carbs[option.id] ?? 0;
                const isSelected = filters.carbs.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleCarb(option.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className={`ml-1 ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Prep Time</h3>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map(option => {
                const count = recipeCounts.time[option.id] ?? 0;
                const isSelected = filters.time === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setTime(option.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className={`ml-1 ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
