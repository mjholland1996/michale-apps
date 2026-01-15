export interface RecipeSummary {
  uid: string;
  title: string;
  slug: string;
  rating: {
    average: number;
    count: number;
  };
  prepTimes: {
    for2: number;
    for4: number;
  };
  image: string;
  hasDetails?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  label: string;
  imageUrl?: string;
}

export interface PortionIngredient {
  id: string;
  quantity: number;
}

export interface PortionSize {
  portions: number;
  ingredients: PortionIngredient[];
}

export interface RecipeDetail {
  uid: string;
  title: string;
  slug: string;
  description: string;
  rating: {
    average: number;
    count: number;
  };
  prepTimes: {
    for2: number;
    for4: number;
  };
  images: {
    main: string;
    mood?: string;
  };
  cuisine: string;
  dietType?: string;
  ingredients: Ingredient[];
  portionSizes: PortionSize[];
  availableServings: number[];
  instructions: Array<{
    step: number;
    text: string;
    imageUrl?: string;
  }>;
  nutrition: {
    perServing: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  basics: string[];
}
