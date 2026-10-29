// One step of a recipe. Durations are in minutes.
export type Step = {
  name: string;
  detail: string;
  then: string;
  min: number;
  target: number;
  max: number;
};

// The last row of a recipe: when it's done, which the schedule counts back from.
export type Finish = {
  name: string;
  detail: string;
};

export type Recipe = {
  name: string;
  steps: Step[];
  finish: Finish;
};

export const BIGA: Recipe = {
  name: "Biga",
  steps: [
    {
      name: "Mix the biga",
      detail: "800 g flour, 544 g water at 80°F, 3/16 tsp yeast.",
      then: "Ferments",
      min: 12 * 60,
      target: 14 * 60,
      max: 14 * 60,
    },
    {
      name: "Mix the final dough",
      detail: "200 g flour, 206 g water at 105°F, 22 g salt, 2 g yeast.",
      then: "Bulk ferments",
      min: 2.5 * 60,
      target: 3.5 * 60,
      max: 3.5 * 60,
    },
    {
      name: "Form the loaves",
      detail: "",
      then: "Proofs",
      min: 45,
      target: 45,
      max: 60,
    },
    {
      name: "Into the oven",
      detail: "Covered, at 475°F.",
      then: "Bakes",
      min: 30,
      target: 30,
      max: 30,
    },
    {
      name: "Uncover",
      detail: "30 min is Ken Forkish done.",
      then: "Bakes",
      min: 10,
      target: 15,
      max: 15,
    },
  ],
  finish: {
    name: "Out of the oven",
    detail: "Cool on racks.",
  },
};
