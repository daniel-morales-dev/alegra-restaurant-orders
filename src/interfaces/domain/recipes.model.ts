import { RecipeIngredients } from "./recipeIngredients.model";

export interface Recipes {
  id: number;

  name: string;

  recipeIngredients: RecipeIngredients[];
}
