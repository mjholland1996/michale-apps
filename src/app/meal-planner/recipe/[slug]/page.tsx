import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IngredientsPanel } from '@/components/IngredientsPanel';
import { fetchRecipeDetail } from '@/lib/gousto-api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await fetchRecipeDetail(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/meal-planner/current" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            &larr; Back to meal plan
          </Link>
          <a
            href={`https://www.gousto.co.uk/cookbook/${recipe.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            View on Gousto
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-gray-200">
        {recipe.images.main ? (
          <Image
            src={recipe.images.main}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">{recipe.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-white/90">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recipe.prepTimes.for2} min
              </span>
              {recipe.cuisine && (
                <span className="px-2 py-1 bg-white/20 rounded text-sm">{recipe.cuisine}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <IngredientsPanel
              ingredients={recipe.ingredients}
              portionSizes={recipe.portionSizes}
              availableServings={recipe.availableServings}
              basics={recipe.basics}
              nutrition={recipe.nutrition}
            />
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>

            {recipe.instructions.length > 0 ? (
              <ol className="space-y-6">
                {recipe.instructions.map((instruction) => (
                  <li key={instruction.step} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {instruction.imageUrl && (
                      <div className="relative aspect-video bg-gray-100">
                        <Image
                          src={instruction.imageUrl}
                          alt={`Step ${instruction.step}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full font-semibold text-sm mb-2">
                        {instruction.step}
                      </span>
                      <div
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_.text-purple]:text-purple-600 [&_.text-purple]:font-medium [&_.text-danger]:text-red-600 [&_.text-danger]:font-medium"
                        dangerouslySetInnerHTML={{ __html: instruction.text }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 bg-white rounded-xl shadow-sm p-6">
                No instructions available for this recipe.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
