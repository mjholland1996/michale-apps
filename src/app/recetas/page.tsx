'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import recetasIndex from '../../../data/recetas-index.json';

interface RecetaSummary {
  title: string;
  slug: string;
}

export default function RecetasPage() {
  const recetas = recetasIndex as RecetaSummary[];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecetas = useMemo(() => {
    if (!searchQuery.trim()) return recetas;
    return recetas.filter(receta =>
      receta.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [recetas, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
            &larr; Back to home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Recetas Peruanas</h1>
          <p className="text-gray-600 mt-1">{filteredRecetas.length} of {recetas.length} recetas</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Recipe list */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {filteredRecetas.length === 0 ? (
            <p className="px-4 py-8 text-center text-gray-500">No se encontraron recetas</p>
          ) : (
            filteredRecetas.map((receta) => (
              <Link
                key={receta.slug}
                href={`/recetas/${receta.slug}`}
                className="block px-4 py-3 hover:bg-amber-50 transition-colors"
              >
                <span className="text-gray-900 hover:text-amber-700">{receta.title}</span>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
