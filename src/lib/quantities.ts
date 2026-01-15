/**
 * Utility functions for parsing and combining ingredient quantities
 */

export interface ParsedQuantity {
  amount: number;
  unit: string;
  originalLabel: string;
}

export interface CombinedIngredient {
  name: string;
  displayName: string;
  quantities: ParsedQuantity[];
  totalAmount: number;
  unit: string;
  imageUrl?: string;
  recipeCount: number;
}

/**
 * Parse quantity from an ingredient label
 * Examples:
 *   "Chicken breast strips (250g)" → { amount: 250, unit: "g" }
 *   "White potato x4" → { amount: 4, unit: "pcs" }
 *   "Curry powder (1tbsp)" → { amount: 1, unit: "tbsp" }
 *   "Red onion" → { amount: 1, unit: "pcs" }
 */
export function parseQuantityFromLabel(label: string): { amount: number; unit: string } {
  // Clean up the label first - remove x0 suffix
  const cleanedLabel = label.replace(/\s*x0$/i, '');

  // Pattern 1: Quantity in parentheses with unit - e.g., "(250g)", "(1tbsp)", "(15ml)"
  const parenMatch = cleanedLabel.match(/\((\d+(?:\.\d+)?)\s*(g|kg|ml|l|tsp|tbsp|pcs?)\)/i);
  if (parenMatch) {
    return { amount: parseFloat(parenMatch[1]), unit: parenMatch[2].toLowerCase() };
  }

  // Pattern 2: Quantity in parentheses without unit - e.g., "(0.5pcs)"
  const parenNumMatch = cleanedLabel.match(/\((\d+(?:\.\d+)?)\s*(?:pcs?)?\)/i);
  if (parenNumMatch) {
    return { amount: parseFloat(parenNumMatch[1]), unit: 'pcs' };
  }

  // Pattern 3: Pack size with x - e.g., "x4", "x 4"
  const xMatch = cleanedLabel.match(/x\s*(\d+)$/i);
  if (xMatch) {
    return { amount: parseInt(xMatch[1]), unit: 'pcs' };
  }

  // Pattern 4: Trailing number without x - e.g., "Red onion x2" already handled, but "2 Red onions"
  const leadingNumMatch = cleanedLabel.match(/^(\d+)\s*x?\s+/i);
  if (leadingNumMatch) {
    return { amount: parseInt(leadingNumMatch[1]), unit: 'pcs' };
  }

  // Default: 1 piece
  return { amount: 1, unit: 'pcs' };
}

/**
 * Extract a clean display name from the ingredient
 * Removes quantities and pack sizes from the name
 */
export function getCleanDisplayName(name: string, label: string): string {
  // Use the name field (lowercase base name) and capitalize it
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalized;
}

/**
 * Check if two units are compatible for combining
 */
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const normalizeUnit = (u: string) => {
    const lower = u.toLowerCase();
    if (lower === 'pc' || lower === 'pcs' || lower === 'piece' || lower === 'pieces') return 'pcs';
    if (lower === 'gram' || lower === 'grams') return 'g';
    if (lower === 'kilogram' || lower === 'kilograms') return 'kg';
    if (lower === 'milliliter' || lower === 'milliliters' || lower === 'millilitre') return 'ml';
    if (lower === 'liter' || lower === 'liters' || lower === 'litre') return 'l';
    return lower;
  };

  return normalizeUnit(unit1) === normalizeUnit(unit2);
}

/**
 * Format a quantity for display
 */
export function formatQuantity(amount: number, unit: string): string {
  // Round to reasonable precision
  const rounded = Math.round(amount * 100) / 100;
  const displayAmount = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);

  if (unit === 'pcs' || unit === 'pc') {
    return rounded === 1 ? '1' : displayAmount;
  }

  return `${displayAmount}${unit}`;
}

/**
 * Combine ingredients from multiple recipes
 */
export function combineIngredients(
  ingredientLists: Array<{
    recipeTitle: string;
    ingredients: Array<{
      id: string;
      name: string;
      label: string;
      imageUrl?: string;
      quantity: number; // from portionSizes
    }>;
  }>
): CombinedIngredient[] {
  // Group by ingredient name
  const grouped = new Map<string, {
    name: string;
    items: Array<{
      label: string;
      imageUrl?: string;
      parsedAmount: number;
      unit: string;
      portionQuantity: number;
      recipeTitle: string;
    }>;
  }>();

  for (const { recipeTitle, ingredients } of ingredientLists) {
    for (const ing of ingredients) {
      const { amount, unit } = parseQuantityFromLabel(ing.label);
      const totalAmount = amount * ing.quantity;

      if (!grouped.has(ing.name)) {
        grouped.set(ing.name, { name: ing.name, items: [] });
      }

      grouped.get(ing.name)!.items.push({
        label: ing.label,
        imageUrl: ing.imageUrl,
        parsedAmount: totalAmount,
        unit,
        portionQuantity: ing.quantity,
        recipeTitle,
      });
    }
  }

  // Combine quantities within each group
  const result: CombinedIngredient[] = [];

  for (const [name, group] of grouped) {
    // Group items by unit
    const byUnit = new Map<string, typeof group.items>();

    for (const item of group.items) {
      const normalizedUnit = item.unit.toLowerCase();
      if (!byUnit.has(normalizedUnit)) {
        byUnit.set(normalizedUnit, []);
      }
      byUnit.get(normalizedUnit)!.push(item);
    }

    // If all items have the same unit, combine them
    if (byUnit.size === 1) {
      const [unit, items] = [...byUnit.entries()][0];
      const totalAmount = items.reduce((sum, item) => sum + item.parsedAmount, 0);
      const recipeCount = new Set(items.map(i => i.recipeTitle)).size;

      result.push({
        name,
        displayName: getCleanDisplayName(name, items[0].label),
        quantities: items.map(item => ({
          amount: item.parsedAmount,
          unit: item.unit,
          originalLabel: item.label,
        })),
        totalAmount,
        unit,
        imageUrl: items[0].imageUrl,
        recipeCount,
      });
    } else {
      // Different units - create separate entries for each unit group
      for (const [unit, items] of byUnit) {
        const totalAmount = items.reduce((sum, item) => sum + item.parsedAmount, 0);
        const recipeCount = new Set(items.map(i => i.recipeTitle)).size;

        result.push({
          name: `${name} (${unit})`,
          displayName: `${getCleanDisplayName(name, items[0].label)} (${unit})`,
          quantities: items.map(item => ({
            amount: item.parsedAmount,
            unit: item.unit,
            originalLabel: item.label,
          })),
          totalAmount,
          unit,
          imageUrl: items[0].imageUrl,
          recipeCount,
        });
      }
    }
  }

  // Sort by display name
  result.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return result;
}
