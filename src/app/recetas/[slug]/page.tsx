import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

interface Receta {
  title: string;
  slug: string;
  content: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getReceta(slug: string): Promise<Receta | null> {
  const filePath = path.join(process.cwd(), 'data', 'recetas', `${slug}.json`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Receta;
  } catch {
    return null;
  }
}

export default async function RecetaPage({ params }: PageProps) {
  const { slug } = await params;
  const receta = await getReceta(slug);

  if (!receta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/recetas" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
            &larr; Volver a recetas
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{receta.title}</h1>
          <div className="prose prose-gray max-w-none">
            {receta.content.split('\n').map((line, index) => (
              <p key={index} className={line.trim() === '' ? 'h-4' : 'text-gray-700'}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
