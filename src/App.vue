<script setup lang="ts">
import { CoilType } from "./Coils";
import { VoltageTier } from "./VoltageTiers";
import DataCell from "./components/DataCell.vue";
import { computed, nextTick, watch } from "vue";
import { Recipe } from "./Recipe";
import { EBFData } from "./EBFData";
import { onBeforeMount } from "vue";
import RecipeSearch from "./components/RecipeSelection.vue";
import { neutralRecipe, recipes, type RecipeDropdownItem } from "./recipes";

const recipeEUt = defineModel<number>("eut", {
  default: 0,
});
const recipeTemp = defineModel<number>("temp", { default: 0 });
const recipeDurationS = defineModel<number>("durationS", { default: 0 });
const recipePreset = defineModel<RecipeDropdownItem>("preset", {
  default: neutralRecipe,
});

onBeforeMount(() => {
  const thisURLParams = new URLSearchParams(window.location.search);
  if (thisURLParams.get("recipe")) {
    const recipe = recipes.find(
      ({ name }) => name === thisURLParams.get("recipe")
    );
    if (recipe) {
      recipePreset.value = recipe;
      return;
    }
  }

  if (
    thisURLParams.get("eut") &&
    !Number.isNaN(Number.parseInt(thisURLParams.get("eut")!, 10))
  )
    recipeEUt.value = Number.parseInt(thisURLParams.get("eut")!, 10);

  if (
    thisURLParams.get("temp") &&
    !Number.isNaN(Number.parseInt(thisURLParams.get("temp")!, 10))
  )
    recipeTemp.value = Number.parseInt(thisURLParams.get("temp")!, 10);

  if (
    thisURLParams.get("duration") &&
    !Number.isNaN(Number.parseFloat(thisURLParams.get("duration")!))
  )
    recipeDurationS.value = Number.parseFloat(thisURLParams.get("duration")!);
});

const recipe = computed(
  () =>
    new Recipe({
      temperature: recipeTemp.value,
      eut: recipeEUt.value,
      duration: recipeDurationS.value * 20,
    })
);

/** Probably rather shitty locking, but I can't be bothered by ArrayBuffer
 * CAS. JS probably won't switch contexts anyways when processing events */
let ignoreChanges = false;
const thenUnlock = () =>
  nextTick(() => {
    ignoreChanges = false;
  });
watch([recipeEUt, recipeDurationS, recipeTemp], (newVal) => {
  if (ignoreChanges) return;
  ignoreChanges = true;
  console.log(newVal);
  recipePreset.value = neutralRecipe;
  thenUnlock();
});

watch(recipePreset, (preset) => {
  if (ignoreChanges) return;
  ignoreChanges = true;
  recipeEUt.value = preset.eut;
  recipeTemp.value = preset.temperature;
  recipeDurationS.value = preset.duration;
  thenUnlock();
});
</script>

<template>
  <div class="w-full flex items-center flex-col">
    <div class="flex justify-center [&_input]:text-right [&_input]:me-0.5">
      <form @submit.prevent class="flex flex-row gap-4 py-4">
        <label>
          Voltage:
          <input
            type="number"
            placeholder="120"
            class="w-[8em]"
            v-model.number="recipeEUt"
          />EU/t
        </label>

        <label>
          Temperature:
          <input
            type="number"
            placeholder="1800"
            class="w-[6em]"
            v-model.number="recipeTemp"
          />K
        </label>

        <label>
          Duration:
          <input
            type="number"
            placeholder="2.5"
            step="0.05"
            class="w-[4em]"
            v-model.number="recipeDurationS"
          />s
        </label>
      </form>
    </div>
    <RecipeSearch v-model="recipePreset" />
  </div>

  <div
    class="overflow-auto max-w-screen max-h-[calc(100vh-2lh-(var(--spacing)*(2*4+2*0.5+2*2+1+4))-1px)] mx-4 [scrollbar-color:var(--color-neutral-500)var(--color-neutral-200)]"
  >
    <table class="tabular-nums relative">
      <tbody class="*:*:px-2 *:*:py-1 *:*:first:sticky *:*:first:left-0">
        <tr
          class="text-center *:text-neutral-50 *:bg-neutral-900 *:sticky *:top-0"
        >
          <td class="absolute z-10 top-o left-0" />
          <td
            v-for="tier in VoltageTier.ALL"
            :key="tier.name"
            v-text="tier.name"
            class="min-w-48"
          />
        </tr>
        <tr v-for="coil in CoilType.ALL" :key="coil.name">
          <td
            class="first:text-neutral-50 first:bg-neutral-900"
            v-text="coil.name"
          />

          <DataCell
            v-for="tier in VoltageTier.ALL"
            :key="tier.name"
            :ebf="new EBFData({ simpleTier: tier })"
            :coil="coil"
            :recipe="recipe"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style></style>
