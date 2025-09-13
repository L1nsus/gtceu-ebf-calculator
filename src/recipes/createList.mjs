/**
 * Use this file in minecraft/gtceu/dumped/gtceu/recipes/electric_blast_furnace
 * to convert a recipe dump into a single JSON file
 */
import { readFileSync, globSync, writeFileSync } from "node:fs";

const OUT_FILENAME = "recipes.json";

function filenameToRecipeName(filename) {
  let name = filename.match(/(.*)\.json$/)[1];
  if (name.startsWith("blast_")) name = name.substring(6);
  return name;
}

const files = globSync("./*.json").filter((f) => f !== OUT_FILENAME);

const recipes = [];

for (const filename of files) {
  const data = JSON.parse(readFileSync(filename));

  recipes.push({
    name: filenameToRecipeName(filename),
    eut: data.tickInputs.eu[0].content,
    duration: data.duration / 20,
    temperature: data.data.ebf_temp,
  });
}

recipes.sort(({ name: aName }, { name: bName }) => aName - bName);

writeFileSync(OUT_FILENAME, JSON.stringify(recipes));
