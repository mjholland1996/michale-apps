/**
 * Script to fetch recipe summaries from Gousto's API
 *
 * Usage:
 *   node scripts/fetch-recipes.js [--limit N] [--force]
 *
 * Options:
 *   --limit N    Only fetch N recipes (for testing)
 *   --force      Force refresh even if cache exists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = 'https://production-api.gousto.co.uk/cmsreadbroker/v1';
const DATA_DIR = path.join(__dirname, '..', 'data');
const INDEX_FILE = path.join(DATA_DIR, 'recipes-index.json');

// Rate limiting: delay between requests (ms)
const DELAY_BETWEEN_REQUESTS = 500;

// Protein detection patterns (order matters - more specific first)
const PROTEIN_PATTERNS = [
  { pattern: /\b(chick'?n|chicken)\b/i, label: 'Chicken' },
  { pattern: /\b(beef|steak|sirloin|rump|brisket)\b/i, label: 'Beef' },
  { pattern: /\b(pork|bacon|ham|sausage|chorizo|pancetta)\b/i, label: 'Pork' },
  { pattern: /\b(lamb)\b/i, label: 'Lamb' },
  { pattern: /\b(duck)\b/i, label: 'Duck' },
  { pattern: /\b(turkey|pavita)\b/i, label: 'Turkey' },
  { pattern: /\b(salmon|cod|tuna|fish|basa|hake|pollock|sea bass|seabass|trout|mackerel|sardine)\b/i, label: 'Fish' },
  { pattern: /\b(prawn|shrimp|scallop|mussel|clam|crab|lobster|seafood)\b/i, label: 'Seafood' },
  { pattern: /\b(paneer|tofu|halloumi|tempeh)\b/i, label: 'Vegetarian' },
  { pattern: /\b(plant.?based|meat.?free|vegan|veggie|vegetarian)\b/i, label: 'Vegetarian' },
];

// Carb detection patterns
const CARB_PATTERNS = [
  { pattern: /\b(rice|risotto|pilaf|biryani)\b/i, label: 'Rice' },
  { pattern: /\b(pasta|spaghetti|penne|tagliatelle|linguine|fettuccine|fusilli|rigatoni|orzo|macaroni)\b/i, label: 'Pasta' },
  { pattern: /\b(lasagne|lasagna|cannelloni)\b/i, label: 'Pasta' },
  { pattern: /\b(gnocchi)\b/i, label: 'Gnocchi' },
  { pattern: /\b(noodle|ramen|udon|lo mein|chow mein|pad thai)\b/i, label: 'Noodles' },
  { pattern: /\b(potato|chips|fries|mash|wedges|roasties|gratin)\b/i, label: 'Potato' },
  { pattern: /\b(bread|naan|flatbread|pitta|pita|wrap|tortilla|bun|ciabatta|focaccia|brioche|baguette)\b/i, label: 'Bread' },
  { pattern: /\b(couscous)\b/i, label: 'Couscous' },
  { pattern: /\b(quinoa)\b/i, label: 'Quinoa' },
];

/**
 * Extract proteins from recipe title
 */
function extractProteins(title) {
  const proteins = new Set();
  for (const { pattern, label } of PROTEIN_PATTERNS) {
    if (pattern.test(title)) {
      proteins.add(label);
    }
  }
  return Array.from(proteins);
}

/**
 * Extract carbs from recipe title
 */
function extractCarbs(title) {
  const carbs = new Set();
  for (const { pattern, label } of CARB_PATTERNS) {
    if (pattern.test(title)) {
      carbs.add(label);
    }
  }
  return Array.from(carbs);
}

function sleep(ms) {
  execSync(`sleep ${ms / 1000}`);
}

function fetchJsonSync(url, retries = 5) {
  const cmd = `curl -s "${url}" -H "User-Agent: Mozilla/5.0" -H "Accept: application/json"`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });

    try {
      return JSON.parse(result);
    } catch {
      console.log(`Attempt ${attempt}/${retries} failed (got HTML/error response), waiting ${attempt * 2}s...`);
      if (attempt < retries) {
        sleep(attempt * 2000);
      }
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

function extractSlug(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

function fetchAllRecipeSummaries(limit) {
  const recipes = [];
  const seenSlugs = new Set();
  let offset = 0;
  const pageSize = 20;
  let totalCount = Infinity;

  console.log('Fetching recipe summaries...');

  while (offset < totalCount && (!limit || recipes.length < limit)) {
    const url = `${API_BASE}/recipes?category=recipes&limit=${pageSize}&offset=${offset}`;
    console.log(`Fetching page ${Math.floor(offset / pageSize) + 1}... (${recipes.length} recipes so far)`);

    try {
      const json = fetchJsonSync(url);

      totalCount = json.data?.count ?? totalCount;
      const entries = json.data?.entries ?? [];

      for (const recipe of entries) {
        if (limit && recipes.length >= limit) break;

        const slug = extractSlug(recipe.url);

        // Skip duplicates (API sometimes returns the same recipe twice)
        if (seenSlugs.has(slug)) continue;
        seenSlugs.add(slug);

        // Find the best image (around 700px wide)
        const image = recipe.media?.images
          ?.sort((a, b) => Math.abs(a.width - 700) - Math.abs(b.width - 700))[0]
          ?.image ?? '';

        // Extract proteins and carbs from title
        const proteins = extractProteins(recipe.title);
        const carbs = extractCarbs(recipe.title);

        recipes.push({
          uid: recipe.uid,
          title: recipe.title,
          slug,
          prepTimes: {
            for2: recipe.prep_times?.for_2 ?? 0,
            for4: recipe.prep_times?.for_4 ?? 0,
          },
          image,
          proteins,
          carbs,
        });
      }

      offset += pageSize;
      sleep(DELAY_BETWEEN_REQUESTS);
    } catch (error) {
      console.error(`Error fetching page at offset ${offset}:`, error.message);
      break;
    }
  }

  console.log(`Fetched ${recipes.length} recipe summaries`);
  return recipes;
}

function main() {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;
  const force = args.includes('--force');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Fetch summaries
  let recipes;
  if (fs.existsSync(INDEX_FILE) && !force) {
    console.log('Loading existing recipes from cache...');
    console.log('Use --force to refresh from API');
    recipes = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    if (limit && recipes.length > limit) {
      recipes = recipes.slice(0, limit);
    }
    console.log(`Loaded ${recipes.length} recipes from cache`);
  } else {
    recipes = fetchAllRecipeSummaries(limit);
    fs.writeFileSync(INDEX_FILE, JSON.stringify(recipes, null, 2));
    console.log(`Saved ${recipes.length} recipes to ${INDEX_FILE}`);
  }

  // Print stats
  const proteinStats = {};
  const carbStats = {};
  for (const recipe of recipes) {
    for (const p of recipe.proteins || []) {
      proteinStats[p] = (proteinStats[p] || 0) + 1;
    }
    for (const c of recipe.carbs || []) {
      carbStats[c] = (carbStats[c] || 0) + 1;
    }
  }
  console.log('\nProtein distribution:', proteinStats);
  console.log('Carb distribution:', carbStats);

  console.log('\nDone!');
}

main();
