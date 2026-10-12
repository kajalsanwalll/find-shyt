
export type TarotCard = {
  name: string;
  meaning: string;
  symbol: string;
  icon: string;
  arcana: "Major" | "Minor";
  suit?: "Cups" | "Wands" | "Swords" | "Pentacles";
};

const majorArcana: TarotCard[] = [
  ["The Fool", "new beginnings and taking a leap", "0", "✦"],
  ["The Magician", "confidence and making things happen", "I", "✧"],
  ["The High Priestess", "intuition and inner wisdom", "II", "☾"],
  ["The Empress", "growth, creativity and abundance", "III", "❀"],
  ["The Emperor", "structure, stability and boundaries", "IV", "♜"],
  ["The Hierophant", "tradition, learning and shared beliefs", "V", "⚝"],
  ["The Lovers", "connection, choices and alignment", "VI", "♡"],
  ["The Chariot", "determination and forward movement", "VII", "✧"],
  ["Strength", "courage, patience and inner strength", "VIII", "∞"],
  ["The Hermit", "reflection and finding your own answers", "IX", "☼"],
  ["Wheel of Fortune", "change, cycles and unexpected turns", "X", "☸"],
  ["Justice", "fairness, accountability and truth", "XI", "⚖"],
  ["The Hanged Man", "surrender and seeing things differently", "XII", "♧"],
  ["Death", "endings, transformation and renewal", "XIII", "☠"],
  ["Temperance", "balance, patience and moderation", "XIV", "⚗"],
  ["The Devil", "attachments, temptation and unhealthy patterns", "XV", "♆"],
  ["The Tower", "sudden change and challenging old foundations", "XVI", "ϟ"],
  ["The Star", "hope, healing and renewal", "XVII", "★"],
  ["The Moon", "uncertainty, emotions and the unknown", "XVIII", "☾"],
  ["The Sun", "joy, clarity and confidence", "XIX", "☀"],
  ["Judgement", "reflection, awakening and a fresh perspective", "XX", "♧"],
  ["The World", "completion, achievement and wholeness", "XXI", "◎"],
].map(([name, meaning, symbol, icon]) => ({
  name,
  meaning,
  symbol,
  icon,
  arcana: "Major" as const,
}));

const suitData = {
  Cups: {
    icon: "♡",
    theme: "emotions, relationships and intuition",
  },
  Wands: {
    icon: "🔥",
    theme: "passion, creativity and ambition",
  },
  Swords: {
    icon: "⚔",
    theme: "thoughts, communication and challenges",
  },
  Pentacles: {
    icon: "✧",
    theme: "money, work and practical matters",
  },
};

const ranks = [
  { name: "Ace", symbol: "A", meaning: "a new beginning" },
  { name: "Two", symbol: "II", meaning: "balance and decisions" },
  { name: "Three", symbol: "III", meaning: "growth and collaboration" },
  { name: "Four", symbol: "IV", meaning: "stability and structure" },
  { name: "Five", symbol: "V", meaning: "conflict and change" },
  { name: "Six", symbol: "VI", meaning: "harmony and progress" },
  { name: "Seven", symbol: "VII", meaning: "reflection and persistence" },
  { name: "Eight", symbol: "VIII", meaning: "movement and dedication" },
  { name: "Nine", symbol: "IX", meaning: "independence and culmination" },
  { name: "Ten", symbol: "X", meaning: "completion and transition" },
  { name: "Page", symbol: "P", meaning: "curiosity and discovery" },
  { name: "Knight", symbol: "N", meaning: "action and pursuit" },
  { name: "Queen", symbol: "Q", meaning: "maturity and inner mastery" },
  { name: "King", symbol: "K", meaning: "leadership and responsibility" },
];

const minorArcana: TarotCard[] = Object.entries(suitData).flatMap(
  ([suit, details]) =>
    ranks.map((rank) => ({
      name: `${rank.name} of ${suit}`,
      meaning: `${rank.meaning}; ${details.theme}`,
      symbol: rank.symbol,
      icon: details.icon,
      arcana: "Minor" as const,
      suit: suit as TarotCard["suit"],
    }))
);

export const tarotCards: TarotCard[] = [
  ...majorArcana,
  ...minorArcana,
];
