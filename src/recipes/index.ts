import { type IRecipe } from "@/Recipe";
import rawRecipes from "./recipes.json" with { type: "json" };

export interface RecipeDropdownItem extends IRecipe {
  name: string;
}

export const neutralRecipe: RecipeDropdownItem = {
  name: "[Custom Preset]",
  duration: 0,
  eut: 0,
  temperature: 0,
};

export const recipes: RecipeDropdownItem[] = [neutralRecipe, ...rawRecipes];
