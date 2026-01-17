import Link from 'next/link';
import recetasIndex from '../../../data/recetas-index.json';

interface RecetaSummary {
  title: string;
  slug: string;
}

export default function RecetasPage() {
  const recetas = recetasIndex as RecetaSummary[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
            &larr; Back to home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Recetas Peruanas</h1>
          <p className="text-gray-600 mt-1">{recetas.length} recetas de familia</p>
        </div>
      </header>

      {/* Recipe list */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {recetas.map((receta) => (
            <Link
              key={receta.slug}
              href={`/recetas/${receta.slug}`}
              className="block px-4 py-3 hover:bg-amber-50 transition-colors"
            >
              <span className="text-gray-900 hover:text-amber-700">{receta.title}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
