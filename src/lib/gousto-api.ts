import { RecipeDetail } from '@/types/recipe';

const API_BASE = 'https://production-api.gousto.co.uk/cmsreadbroker/v1';

interface GoustoImage {
  image: string;
  width: number;
  type?: string;
}

interface GoustoIngredient {
  gousto_uuid?: string;
  uid?: string;
  name?: string;
  label?: string;
  title?: string;
  media?: {
    images?: Array<{ image: string }>;
  };
}

interface GoustoPortionSize {
  portions: number;
  is_offered: boolean;
  ingredients_skus?: Array<{
    id: string;
    quantities?: { in_box?: number };
  }>;
}

interface GoustoInstruction {
  order: number;
  instruction: string;
  media?: {
    images?: Array<{ image: string }>;
  };
}

interface GoustoRecipeEntry {
  uid: string;
  title: string;
  url: string;
  seo_description?: string;
  prep_times?: { for_2?: number; for_4?: number };
  recipe_cuisine?: string;
  recipe_diet_type?: string;
  media?: { images?: GoustoImage[] };
  ingredients?: GoustoIngredient[];
  portion_sizes?: GoustoPortionSize[];
  cooking_instructions?: GoustoInstruction[];
  nutritional_information?: {
    per_portion?: {
      energy_kcal?: number;
      protein_grams?: number;
      carbs_grams?: number;
      fat_grams?: number;
    };
  };
  basics?: Array<{ title?: string; label?: string }>;
}

function extractSlug(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

function findBestImage(images: GoustoImage[] | undefined, type?: 'mood' | 'main'): string {
  if (!images) return '';

  const filtered = type === 'mood'
    ? images.filter(img => img.type === 'mood')
    : images.filter(img => img.type !== 'mood');

  if (filtered.length === 0) return '';

  // Sort by closest to 700px width
  const sorted = [...filtered].sort((a, b) =>
    Math.abs(a.width - 700) - Math.abs(b.width - 700)
  );

  return sorted[0]?.image ?? '';
}

export async function fetchRecipeDetail(slug: string): Promise<RecipeDetail | null> {
  const url = `${API_BASE}/recipe/${slug}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const entry: GoustoRecipeEntry | undefined = data.data?.entry;

    if (!entry) {
      return null;
    }

    // Process portion sizes
    const portionSizes = (entry.portion_sizes ?? [])
      .filter(ps => ps.is_offered)
      .map(ps => ({
        portions: ps.portions,
        ingredients: (ps.ingredients_skus ?? []).map(sku => ({
          id: sku.id,
          quantity: sku.quantities?.in_box ?? 1,
        })),
      }));

    // Get available serving sizes
    const availableServings = portionSizes
      .map(ps => ps.portions)
      .sort((a, b) => a - b);

    // Process ingredients
    const ingredients = (entry.ingredients ?? []).map(ing => ({
      id: ing.gousto_uuid ?? ing.uid ?? '',
      name: ing.name ?? '',
      label: ing.label ?? ing.title ?? '',
      imageUrl: ing.media?.images?.[0]?.image,
    }));

    // Process instructions
    const instructions = (entry.cooking_instructions ?? [])
      .sort((a, b) => a.order - b.order)
      .map((inst, index) => ({
        step: index + 1,
        text: inst.instruction,
        imageUrl: inst.media?.images?.[0]?.image,
      }));

    return {
      uid: entry.uid,
      title: entry.title,
      slug: extractSlug(entry.url),
      description: entry.seo_description ?? '',
      prepTimes: {
        for2: entry.prep_times?.for_2 ?? 0,
        for4: entry.prep_times?.for_4 ?? 0,
      },
      images: {
        main: findBestImage(entry.media?.images, 'main'),
        mood: findBestImage(entry.media?.images, 'mood') || undefined,
      },
      cuisine: entry.recipe_cuisine ?? '',
      dietType: entry.recipe_diet_type ?? '',
      ingredients,
      portionSizes,
      availableServings,
      instructions,
      nutrition: {
        perServing: {
          calories: entry.nutritional_information?.per_portion?.energy_kcal ?? 0,
          protein: entry.nutritional_information?.per_portion?.protein_grams ?? 0,
          carbs: entry.nutritional_information?.per_portion?.carbs_grams ?? 0,
          fat: entry.nutritional_information?.per_portion?.fat_grams ?? 0,
        },
      },
      basics: (entry.basics ?? []).map(b => b.title ?? b.label ?? ''),
    };
  } catch (error) {
    console.error(`Error fetching recipe ${slug}:`, error);
    return null;
  }
}
