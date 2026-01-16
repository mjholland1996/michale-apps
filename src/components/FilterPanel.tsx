'use client';

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Protein filter */}
      <div className="mb-4">
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
  );
}
