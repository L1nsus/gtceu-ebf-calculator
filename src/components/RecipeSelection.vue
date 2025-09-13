<script setup lang="ts">
import { neutralRecipe, recipes, type RecipeDropdownItem } from "@/recipes";

const recipeSelection = defineModel<RecipeDropdownItem>({
  default: neutralRecipe,
  required: true,
});
</script>

<template>
  <div class="w-min py-2">
    <select class="border-b" v-model="recipeSelection">
      <option
        v-for="recipe in recipes"
        :key="recipe.name"
        :value="recipe"
        v-text="recipe.name"
      />
    </select>
  </div>
</template>
