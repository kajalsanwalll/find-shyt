// lib/spreads.ts

export type SpreadId = "one" | "three" | "cross";

export type Spread = {
  id: SpreadId;
  name: string;
  positions: string[]; // one label per card, in the order they are picked
  heading: string; // pick-page title
  hint: string; // pick-page helper line
};

export const spreads: Record<SpreadId, Spread> = {
  one: {
    id: "one",
    name: "One card",
    positions: ["Your card"],
    heading: "Pick one card.",
    hint: "Go with the one you're drawn to. Tap it again to put it back.",
  },
  three: {
    id: "three",
    name: "Three cards",
    positions: ["Past", "Present", "Future"],
    heading: "Pick three cards.",
    hint: "Don't overthink it. Go with the ones you're drawn to. Tap a picked card to put it back.",
  },
  cross: {
    id: "cross",
    name: "The cross",
    positions: ["Situation", "Challenge", "Past", "Future", "Outcome"],
    heading: "Pick five cards.",
    hint: "Don't overthink it. Go with the ones you're drawn to. Tap a picked card to put it back.",
  },
};

export const DEFAULT_SPREAD: SpreadId = "three";

export function isSpreadId(v: unknown): v is SpreadId {
  return v === "one" || v === "three" || v === "cross";
}