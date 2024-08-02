export interface RecipeIngredients {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  name?: string;
}
