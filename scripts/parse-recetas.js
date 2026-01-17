/**
 * Script to parse Spanish recipes from raw_recetas.txt
 * Outputs recetas-index.json and individual recipe JSON files
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INPUT_FILE = path.join(DATA_DIR, 'raw_recetas.txt');
const OUTPUT_INDEX = path.join(DATA_DIR, 'recetas-index.json');
const OUTPUT_DIR = path.join(DATA_DIR, 'recetas');

/**
 * Generate URL-friendly slug from title
 */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim hyphens
}

/**
 * Check if a line is an index entry (has · followed by page number)
 */
function isIndexEntry(line) {
  return /·\s*\d+\s*$/.test(line);
}

/**
 * Check if a line is a recipe title (mostly uppercase, not an index entry)
 * Recipe titles are in ALL CAPS and may have XE "..." markers
 */
function isRecipeTitle(line) {
  // Strip XE "..." markers first
  const cleaned = line.replace(/\s*XE\s*"[^"]*"\s*/g, '').trim();

  if (cleaned.length < 3) return false;
  if (isIndexEntry(line)) return false;

  // Check if mostly uppercase (allowing for accented chars, spaces, parens, etc.)
  const letters = cleaned.replace(/[^A-ZÁÉÍÓÚÑÜ a-záéíóúñü]/g, '');
  const upperCount = (letters.match(/[A-ZÁÉÍÓÚÑÜ]/g) || []).length;
  const lowerCount = (letters.match(/[a-záéíóúñü]/g) || []).length;

  // Title should be predominantly uppercase (at least 70%)
  return upperCount > 0 && upperCount / (upperCount + lowerCount) >= 0.7;
}

/**
 * Clean a recipe title by removing XE markers and extra whitespace
 */
function cleanTitle(title) {
  return title
    .replace(/\s*XE\s*"[^"]*"\s*/g, '') // Remove XE "..." markers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Parse the raw recipes file
 */
function parseRecipes() {
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  const lines = content.split('\n');

  const recipes = [];
  let currentRecipe = null;
  let inIndex = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines at the start
    if (!trimmed && !currentRecipe) continue;

    // Detect end of index section
    // Index entries have · followed by page numbers
    if (inIndex) {
      if (isIndexEntry(trimmed)) {
        continue; // Skip index entries
      }
      // Single letter lines in index (A, B, C, etc.)
      if (/^[A-Z]$/.test(trimmed)) {
        continue;
      }
      // Skip the INDEX header line
      if (trimmed.startsWith('INDEX')) {
        continue;
      }
      // If we hit a recipe title, we're out of the index
      if (isRecipeTitle(trimmed)) {
        inIndex = false;
      } else {
        continue;
      }
    }

    // Check if this is a new recipe title
    if (isRecipeTitle(trimmed)) {
      // Save previous recipe
      if (currentRecipe && currentRecipe.content.trim()) {
        recipes.push(currentRecipe);
      }

      const title = cleanTitle(trimmed);
      currentRecipe = {
        title,
        slug: slugify(title),
        content: ''
      };
    } else if (currentRecipe) {
      // Add line to current recipe content
      currentRecipe.content += line + '\n';
    }
  }

  // Don't forget the last recipe
  if (currentRecipe && currentRecipe.content.trim()) {
    recipes.push(currentRecipe);
  }

  return recipes;
}

/**
 * Main function
 */
function main() {
  console.log('Parsing recipes from:', INPUT_FILE);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const recipes = parseRecipes();
  console.log(`Found ${recipes.length} recipes`);

  // Create index
  const index = recipes.map(r => ({
    title: r.title,
    slug: r.slug
  }));

  // Sort index alphabetically
  index.sort((a, b) => a.title.localeCompare(b.title, 'es'));

  fs.writeFileSync(OUTPUT_INDEX, JSON.stringify(index, null, 2));
  console.log('Wrote index to:', OUTPUT_INDEX);

  // Write individual recipe files
  for (const recipe of recipes) {
    const filePath = path.join(OUTPUT_DIR, `${recipe.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify({
      title: recipe.title,
      slug: recipe.slug,
      content: recipe.content.trim()
    }, null, 2));
  }
  console.log(`Wrote ${recipes.length} recipe files to:`, OUTPUT_DIR);

  // Print some stats
  console.log('\nSample recipes:');
  recipes.slice(0, 5).forEach(r => {
    console.log(`  - ${r.title} (${r.slug})`);
  });
}

main();
