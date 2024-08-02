import { Recipes } from "../domain/recipes.model";

export interface IReceiveOrderFinished {
  keyRedis: string;
  uuid: string;
  status: string;
}

export interface IUpdateOrder extends IReceiveOrderFinished {
  recipe: Recipes;
}
