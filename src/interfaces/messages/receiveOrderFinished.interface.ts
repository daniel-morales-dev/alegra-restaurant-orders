import { Recipes } from "../domain/recipes.model";
import { RecipeIngredients } from "../domain/recipeIngredients.model";

export interface IReceiveOrderFinished {
  keyRedis: string;
  uuid: string;
  status: string;
  recipe: IRecipesWithIngredientsNameOptional;
}

export interface IUpdateOrder extends IReceiveOrderFinished {
  recipe: Recipes;
}

export interface IRecipeIngredientsWithOptionalName extends RecipeIngredients {
  name?: string;
}

export interface IRecipesWithIngredientsNameOptional extends Recipes {
  recipeIngredients: IRecipeIngredientsWithOptionalName[];
}
