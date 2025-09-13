<script setup lang="ts">
import { computed } from "vue";
import type { CoilType } from "../Coils";
import {
  calculate,
  type CellResult,
  CellResultTypes,
  type CellResultValues,
} from "../ebfLogic";
import type { Recipe } from "@/Recipe";
import type { EBFData } from "@/EBFData";
import {
  decimalFormatter,
  integerFormatter,
  percentageFormatter,
  secondFormatter,
} from "@/fmt";
import { VoltageTier } from "@/VoltageTiers";

const props = defineProps<{
  recipe: Recipe;
  ebf: EBFData;
  coil: CoilType;
}>();

const data = computed<CellResult>(() =>
  calculate(props.recipe, props.ebf, props.coil)
);

const cellColor = computed<string>(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = (data.value as any).values as CellResultValues;
  switch (true) {
    case res.parallels >= 2048:
      return "bg-teal-500";
    case res.parallels >= 1024:
      return "bg-teal-400";
    case res.parallels >= 512:
      return "bg-teal-367";
    case res.parallels >= 256:
      return "bg-teal-333";
    case res.parallels >= 128:
      return "bg-teal-300";
    case res.parallels >= 64:
      return "bg-teal-267";
    case res.parallels >= 32:
      return "bg-teal-233";
    case res.parallels >= 16:
      return "bg-teal-200";
    case res.parallels >= 8:
      return "bg-teal-167";
    case res.parallels >= 4:
      return "bg-teal-133";
    case res.parallels > 1:
      return "bg-teal-100";
    case res.perfectOCs > 8:
      return "bg-amber-400";
    case res.perfectOCs === 8:
      return "bg-amber-300";
    case res.perfectOCs === 7:
      return "bg-amber-267";
    case res.perfectOCs === 6:
      return "bg-amber-233";
    case res.perfectOCs === 5:
      return "bg-amber-200";
    case res.perfectOCs === 4:
      return "bg-amber-167";
    case res.perfectOCs === 3:
      return "bg-amber-133";
    case res.perfectOCs === 2:
      return "bg-amber-100";
    case res.perfectOCs === 1:
      return "bg-amber-50";
    default:
      return "bg-neutral-50";
  }
});
</script>

<template>
  <td v-if="data.type === CellResultTypes.TOO_COLD" class="bg-sky-400">
    Too Cold
  </td>
  <td
    v-else-if="data.type === CellResultTypes.TOO_LOW_ENERGY"
    class="bg-red-400"
  >
    Not enough energy
  </td>
  <td
    v-else-if="data.type === CellResultTypes.OK"
    class="border border-slate-500 box-border"
    :class="cellColor"
  >
    <div v-show="data.values.parallels !== 1">
      Performing {{ integerFormatter(data.values.parallels) }} recipes in
      parallel <br />
    </div>
    <div>
      Effective Duration
      <span v-if="data.values.duration < 20">
        {{ data.values.duration }}t
      </span>
      <span v-else v-text="secondFormatter(data.values.duration / 20)" />
    </div>
    <div v-show="data.values.durationCut !== 1">
      Duration cut by a factor of
      {{ integerFormatter(data.values.durationCut) }} <br />
    </div>
    <div v-show="data.values.coilBonus !== 1">
      Coil Discount {{ percentageFormatter(1 - data.values.coilBonus) }}
    </div>
    <div class="text-xs">
      Overclock Level {{ data.values.ocLevel }}
      <span v-show="data.values.perfectOCs > 0">
        ({{ data.values.perfectOCs }} Perfect)
      </span>
    </div>
    <div class="text-xs">
      Using
      {{
        decimalFormatter(
          data.values.eut /
            VoltageTier.getTierFromEUtWithOCFloor(data.values.eut).eut
        )
      }}
      A {{ VoltageTier.getTierFromEUtWithOCFloor(data.values.eut).name }}
    </div>
  </td>
</template>
