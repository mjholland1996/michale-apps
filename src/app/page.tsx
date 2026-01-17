import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Michale Apps</h1>
          <p className="text-gray-600 mt-2">A collection of personal web apps</p>
        </div>
      </header>

      {/* Apps grid */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Meal Planner */}
          <Link
            href="/meal-planner"
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Gousto Meal Planner
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Plan weekly meals, generate shopping lists, and save your favourite meal plans.
              </p>
            </div>
          </Link>

          {/* Recetas Peruanas */}
          <Link
            href="/recetas"
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                Recetas Peruanas
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Traditional family recipes in Spanish, passed down through generations.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
