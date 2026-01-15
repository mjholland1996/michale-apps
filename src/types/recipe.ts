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
  ingredients: Array<{
    name: string;
    quantity: string;
    imageUrl?: string;
  }>;
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
