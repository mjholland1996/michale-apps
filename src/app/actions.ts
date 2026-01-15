'use server';

import fs from 'fs';
import path from 'path';
import { RecipeDetail } from '@/types/recipe';

/**
 * Fetch recipe details for multiple recipes by their slugs
 */
export async function getRecipeDetails(slugs: string[]): Promise<RecipeDetail[]> {
  const details: RecipeDetail[] = [];

  for (const slug of slugs) {
    const detailPath = path.join(process.cwd(), 'data', 'details', `${slug}.json`);

    try {
      const content = fs.readFileSync(detailPath, 'utf-8');
      const recipe = JSON.parse(content) as RecipeDetail;
      details.push(recipe);
    } catch {
      // Skip recipes that don't have details
      console.warn(`Could not load details for recipe: ${slug}`);
    }
  }

  return details;
}
