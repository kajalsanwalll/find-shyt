

import {
  interpretations as baseInterpretations,
  categoryInterpretations as baseCategoryInterpretations,
  overallMessages as baseOverallMessages,
} from "./interpretations";

type Position = "Past" | "Present" | "Future";
type Category = "love" | "career" | "friendship" | "life" | "specific" | "random";
type Context = Position | Category;

const POSITIONS: Position[] = ["Past", "Present", "Future"];
const CATEGORIES: Category[] = ["love", "career", "friendship", "life", "specific", "random"];

/* ------------------------------------------------------------------ */
/* The 10 Major Arcana missing from the original file (handwritten)    */
/* ------------------------------------------------------------------ */

const extraMajor: Record<string, Record<Context, string>> = {
  "The Hierophant": {
    Past: "You were shaped by traditions, rules, or expectations, and you're still sorting out which ones are truly yours.",
    Present: "You may be leaning on something tried and true, or questioning it. Either is okay. Learn from people who've walked this road, then keep what fits you.",
    Future: "A teacher, a community, or a shared way of doing things may offer you steadier footing than you expect.",
    love: "Commitment and shared values matter here. You deserve someone who wants the same kind of future you do, not just the same kind of evening.",
    career: "Guidance from a mentor or a proven path could help. Learn the rules well enough to know which ones you actually want to keep.",
    friendship: "Old rituals and shared history are holding something together. Honor the traditions that make you feel like you belong.",
    life: "You're deciding which inherited beliefs still fit the person you've become. You're allowed to keep some and release others.",
    specific: "There may be a tried-and-true answer here. Ask someone you trust before you try to reinvent everything.",
    random: "Ask the person who's done this before. Sometimes the shortcut is just a good teacher.",
  },
  "Wheel of Fortune": {
    Past: "Something shifted, maybe unexpectedly, and it changed your direction more than you realized at the time.",
    Present: "Things are in motion, and not all of it is yours to steer. Hold on loosely and trust the turn.",
    Future: "A change of luck may be on its way. What feels stuck now isn't going to stay that way.",
    love: "Timing is doing a lot of work here. Don't read one turn of the wheel as the whole story of your love life.",
    career: "A change in circumstance, an opening, or a lucky break may be close. Be ready to say yes when it shows up.",
    friendship: "Friendships move through seasons. One that has drifted may come back around, and another may be only for this chapter.",
    life: "You're in a season of change. It's okay that you can't control all of it.",
    specific: "This situation isn't fixed. Give it time to turn before you decide how it ends.",
    random: "The universe is shuffling things around. Let it.",
  },
  Justice: {
    Past: "A decision or consequence from before is still teaching you about fairness, toward others and toward yourself.",
    Present: "Be honest with yourself about what's fair. Look at the whole picture, including your own part in it.",
    Future: "Things are moving toward balance. What you've put in, in good faith, will be reflected back.",
    love: "Love should feel fair. Look for honesty and equal effort on both sides, and offer the same in return.",
    career: "Clear agreements and honest effort matter right now. Make sure what you give and what you receive are in balance.",
    friendship: "Check whether the care in a friendship goes both ways. Gentle honesty beats quiet resentment.",
    life: "You're being asked to live in line with your values. Choices that match them will feel lighter.",
    specific: "The truth matters more than the comfortable version. Look at the facts, then decide with a clear heart.",
    random: "Be fair to everyone, and to yourself too.",
  },
  "The Hanged Man": {
    Past: "You paused, or were forced to pause, and the stillness showed you something you'd missed while rushing.",
    Present: "You're in a waiting place. It isn't wasted time. A new angle is forming even if you can't see it yet.",
    Future: "A pause is coming that will change how you see things. Let go of the urge to force the next step.",
    love: "Stop pushing for an answer. Seeing the situation from the other side might change what you want from it.",
    career: "Progress looks stalled, but a pause could help you rethink the whole approach. Don't decide just to feel like you're moving.",
    friendship: "Try seeing the friendship from their side for a moment. Understanding may do more than being right.",
    life: "You're between chapters. Letting go of the need to know what's next is the work right now.",
    specific: "Step back and look at this from a different angle. The answer may arrive once you stop gripping it.",
    random: "Hang upside down for a bit. Different view, same wonderful you.",
  },
  Death: {
    Past: "Something ended, and even if it hurt, it cleared space you're only now able to see.",
    Present: "A chapter is closing. Grieve what's passing, and let yourself notice what's already making room.",
    Future: "An ending is coming that is really a doorway. What falls away was ready to go. (This card is about change, never literal endings.)",
    love: "Something in your love life is ready to transform or end. Let it be honest, even when it's tender.",
    career: "An old role, routine, or identity may be finished. It's okay to outgrow it.",
    friendship: "A friendship may be changing shape or ending. Let it be what it was without turning it into a verdict on you.",
    life: "You're shedding an older version of yourself. It's okay to miss her while you become someone new.",
    specific: "Something needs to end for this to move forward, and part of you already knows what.",
    random: "Endings are just beginnings in different clothes. Be kind to yourself while you change.",
  },
  Temperance: {
    Past: "You found a way to blend things that seemed opposed, and it made you steadier.",
    Present: "Go slowly and find the middle. Balance matters more than speed right now.",
    Future: "A gentler rhythm is coming, and things will start to feel like they fit together.",
    love: "Patience and give-and-take are what make love last. Find a pace you can both breathe in.",
    career: "A steady blend of effort and rest will beat sprinting. Sustainable is better than impressive.",
    friendship: "This is easy, balanced friendship energy. Not every bond needs intensity to be real.",
    life: "You're finding your balance. Small adjustments count for more than dramatic overhauls.",
    specific: "A middle path may serve you better than either extreme. Mix, adjust, taste, repeat.",
    random: "Drink some water. Take a walk. Everything in moderation, including worrying.",
  },
  "The Devil": {
    Past: "You may have been held by something, a habit, a person, or a belief, that felt harder to leave than it really was.",
    Present: "Notice what feels like a chain. Often the lock is looser than it seems, and you're allowed to loosen it.",
    Future: "You're moving toward freedom from something that has had a grip on you. Awareness is already the first step.",
    love: "Watch for attachments that tie you down instead of lifting you up. Wanting someone and being good for each other aren't always the same thing.",
    career: "Check what you're staying for: security, pride, or fear. You have more choices than the pressure suggests.",
    friendship: "Be honest about any dynamic that feels draining or controlling. You can love someone and still step back.",
    life: "A habit or story may be keeping you smaller than you are. Looking at it gently is the start of change.",
    specific: "Something here has a hold on you. Name it kindly, then ask whether you still choose it.",
    random: "That thing you keep doing even though it doesn't help? Be gentle with yourself and try something else.",
  },
  "The Tower": {
    Past: "Something fell apart, suddenly or painfully, and you've been rebuilding on truer ground ever since.",
    Present: "Something that wasn't stable is shaking. It's frightening, but it's also making room for something honest.",
    Future: "A surprising shift may come. It could rattle you, but what's left standing will be real.",
    love: "A truth may come out or a pattern may break. It hurts, and it's also an opening toward something real.",
    career: "A sudden change to your plans may feel scary. Something sturdier can be built from here.",
    friendship: "A moment of honesty may shake things up. What survives it will be stronger.",
    life: "A big shift is clearing out what was built on shaky ground. You're going to be okay.",
    specific: "The foundation of this situation might need rebuilding. Don't cling to what's already falling.",
    random: "Plot twist, but a useful one. Breathe.",
  },
  Judgement: {
    Past: "You looked back and saw yourself more clearly, and that honest reckoning changed you.",
    Present: "You're being called toward a deeper honesty and self-forgiveness. It's okay to answer the call.",
    Future: "A turning point is coming, a moment of clarity where you recognize what you're meant to do next.",
    love: "Forgive what needs forgiving, including yourself. You're ready to love in a more honest way.",
    career: "A calling may be getting louder. Listen to what you actually want to do with your time.",
    friendship: "A friendship may get a second chance, or a quiet apology may be overdue. Mercy goes both ways.",
    life: "You're waking up to what matters. Let old regrets go. You've already learned from them.",
    specific: "This is a moment of clarity. Listen to the part of you that's been saying the same thing for a while.",
    random: "Time to forgive yourself for that thing. Yes, that one.",
  },
  "The World": {
    Past: "You finished something meaningful, and you've carried what you learned from it ever since.",
    Present: "You're near completion, or already there. Take a moment to feel what you've done before reaching for what's next.",
    Future: "A cycle is coming to a satisfying close. Wholeness is closer than it feels.",
    love: "There's a sense of completeness here, in a relationship or within yourself. You're not missing a piece.",
    career: "A project, season, or goal may reach a satisfying finish. Celebrate it before starting the next one.",
    friendship: "A feeling of belonging is available to you. You're part of something bigger than your worries.",
    life: "You've come a long way. You're allowed to pause and feel it.",
    specific: "This is heading toward a good ending. Let it finish well.",
    random: "You did the thing. Take a bow.",
  },
};

/* ------------------------------------------------------------------ */
/* Minor Arcana: 14 ranks x 4 suits = 56 cards                         */
/* Each reading blends a rank (the stage of the story) with a suit     */
/* (the part of life it touches), so every card reads differently.     */
/* ------------------------------------------------------------------ */

type RankLines = { name: string; Past: string; Present: string; Future: string; general: string };

const ranks: RankLines[] = [
  {
    name: "Ace",
    Past: "A new beginning arrived in some form, a small spark that quietly changed what came next.",
    Present: "A fresh start is being offered. You don't need to see the whole path to accept it.",
    Future: "A new beginning is on its way, and it may be smaller and gentler than you expect.",
    general: "A fresh start is within reach, and the first small step is enough.",
  },
  {
    name: "Two",
    Past: "You once stood between two choices, and weighing them taught you what mattered.",
    Present: "You're balancing two things. It's okay to take your time before choosing.",
    Future: "A choice is coming, and it asks you to find your balance first.",
    general: "Two sides are pulling at you. Balance comes from listening to both, then choosing.",
  },
  {
    name: "Three",
    Past: "You grew through connection or collaboration, and the people around you shaped the outcome.",
    Present: "Things are beginning to take shape. Share them with people who'll help them grow.",
    Future: "Growth through community or teamwork is ahead. You won't have to do it all alone.",
    general: "Early growth is showing. Welcome help, and let what's forming keep forming.",
  },
  {
    name: "Four",
    Past: "You found stability, or clung to it, and it gave you a place to rest, for better or worse.",
    Present: "You need steadiness and rest. Pausing isn't the same as falling behind.",
    Future: "A stable, restful stretch is coming. Let yourself settle into it.",
    general: "A pause for stability is wise right now. Just check that rest hasn't quietly turned into stuckness.",
  },
  {
    name: "Five",
    Past: "A conflict or setback tested you, and you came out knowing more about what you value.",
    Present: "There's friction in the air. Not every disagreement needs a winner.",
    Future: "Some tension may come up. Handled with honesty, it can clear the air.",
    general: "Friction and competing needs are present. Pick your battles gently.",
  },
  {
    name: "Six",
    Past: "A time of ease, kindness, or moving on helped you heal.",
    Present: "Things are easing. Accept help and kindness, and let yourself drift toward calmer waters.",
    Future: "A gentler stretch is coming, with generosity or healing on the way.",
    general: "Harmony and healing are available to you. Give and receive freely.",
  },
  {
    name: "Seven",
    Past: "You held your ground, or doubted yourself, and either way you learned what you're made of.",
    Present: "Your patience and persistence are being tested. Hang in there and trust the work you've already done.",
    Future: "A test of your commitment lies ahead, and you'll likely meet it better than you expect.",
    general: "This asks for perseverance and a clear look at what's worth your energy.",
  },
  {
    name: "Eight",
    Past: "You moved quickly, or worked hard, and the effort built something that lasted.",
    Present: "Things are moving fast, or you're deep in the work. Keep steady and give it your full attention.",
    Future: "Momentum is coming. Practice and effort are going to pay off.",
    general: "Steady effort and movement are the theme. Keep going and let your skill grow.",
  },
  {
    name: "Nine",
    Past: "You were close to the finish, and you kept going when it would have been easier not to.",
    Present: "You're nearly there, and probably tired. Hold on a little longer and take care of yourself.",
    Future: "You'll be closer to the end than you realize. Your resilience will carry you.",
    general: "You've come a long way and you're almost through. Rest, then keep your ground.",
  },
  {
    name: "Ten",
    Past: "Something reached its natural completion, and carrying it for so long was heavy.",
    Present: "A chapter is ending, or a weight feels heavy. You're allowed to set some of it down.",
    Future: "A cycle will close soon, and what follows is lighter.",
    general: "This is a culmination, with both the weight and the relief of finishing. You don't have to carry everything forward.",
  },
  {
    name: "Page",
    Past: "You were open and curious once, and a message or opportunity shaped what you're doing now.",
    Present: "Stay curious and willing to learn. A message or a new idea may be on its way.",
    Future: "News or a fresh opportunity is coming. Meet it with curiosity.",
    general: "Approach this like a beginner. Questions will serve you better than certainty.",
  },
  {
    name: "Knight",
    Past: "You chased something with real energy, and that drive got you somewhere.",
    Present: "You're in pursuit and moving fast. Keep your heart in it, but watch your pace.",
    Future: "Energy and movement are on their way. Aim them carefully.",
    general: "This is action and momentum. Go after what matters, but don't rush past what's right in front of you.",
  },
  {
    name: "Queen",
    Past: "Someone nurturing, perhaps you, held things together with care and know-how.",
    Present: "Lead with warmth and self-trust. You know more than you think.",
    Future: "You'll grow into a confident, caring role. Trust your own quiet expertise.",
    general: "This is compassion with confidence. Take care of what matters, and of yourself.",
  },
  {
    name: "King",
    Past: "You, or someone near you, led with steadiness, and it shaped how things turned out.",
    Present: "Step into your own authority. Be calm, clear, and decisive.",
    Future: "You're growing toward mastery and steadiness, and a leadership moment may come.",
    general: "Mature, steady command is called for. Decide with care, then stand by it.",
  },
];

const suitLens: Record<string, Record<Context, string>> = {
  Wands: {
    Past: "Passion and creative drive were part of how it played out.",
    Present: "Follow your enthusiasm. It's pointing the right way.",
    Future: "It's likely to arrive with a burst of energy and inspiration.",
    love: "In love, it brings spark, warmth, and the courage to show how you feel.",
    career: "At work, it points to passion projects, creative drive, and the courage to try.",
    friendship: "Among friends, it's laughter, adventure, and shared enthusiasm.",
    life: "In your life more broadly, it's asking what lights you up.",
    specific: "For your question, trust the part of you that feels excited.",
    random: "Also, you're a little fired up. Go do something you're excited about.",
  },
  Cups: {
    Past: "It was an emotional story, tied closely to your heart and your relationships.",
    Present: "Your feelings matter here. Let them be information, not noise.",
    Future: "It will come through feelings and connection.",
    love: "In love, it speaks of tenderness, intuition, and being open-hearted.",
    career: "At work, it's about fulfillment. Does this feel meaningful to you?",
    friendship: "Among friends, it's emotional closeness and being truly seen.",
    life: "In your life more broadly, it's asking how your heart is really doing.",
    specific: "For your question, check in with how you feel, not just what makes sense.",
    random: "Your heart has opinions today. Listen to it kindly.",
  },
  Swords: {
    Past: "Words, thoughts, and hard truths were at the center of it.",
    Present: "Be honest and clear in your words, and notice the stories your mind is telling.",
    Future: "It will arrive through clarity, a conversation, or a decision.",
    love: "In love, it asks for honest communication and kind clarity.",
    career: "At work, it points to clear thinking, honest communication, and a decision to make.",
    friendship: "Among friends, it's about saying the true thing gently.",
    life: "In your life more broadly, it asks you to separate thoughts from facts.",
    specific: "For your question, separate what you actually know from what you fear.",
    random: "Your brain is loud right now. You don't have to believe all of it.",
  },
  Pentacles: {
    Past: "It showed up in practical ways: work, money, home, or your body.",
    Present: "Tend to the practical things: your health, your home, your steady habits.",
    Future: "It will take shape in tangible ways, slowly and solidly.",
    love: "In love, it speaks of showing up, being reliable, and building something real.",
    career: "At work, it points to steady effort, skill-building, and security.",
    friendship: "Among friends, it's loyalty and the quiet care of simply showing up.",
    life: "In your life more broadly, it's asking about stability, your body, and your daily rhythms.",
    specific: "For your question, look at the practical side: what's realistic and sustainable?",
    random: "Eat something nice and rest your body. That counts as progress.",
  },
};

const minorPositions: Record<string, Record<string, string>> = {};
const minorCategories: Record<Category, Record<string, string>> = {
  love: {}, career: {}, friendship: {}, life: {}, specific: {}, random: {},
};

for (const suit of Object.keys(suitLens)) {
  for (const rank of ranks) {
    const name = `${rank.name} of ${suit}`;
    minorPositions[name] = {};
    for (const p of POSITIONS) {
      minorPositions[name][p] = `${rank[p]} ${suitLens[suit][p]}`;
    }
    for (const c of CATEGORIES) {
      minorCategories[c][name] = `${rank.general} ${suitLens[suit][c]}`;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Merged exports (same shape as lib/interpretations.ts)               */
/* ------------------------------------------------------------------ */

const extraMajorPositions: Record<string, Record<string, string>> = {};
const extraMajorCategories: Record<Category, Record<string, string>> = {
  love: {}, career: {}, friendship: {}, life: {}, specific: {}, random: {},
};
for (const [name, lines] of Object.entries(extraMajor)) {
  extraMajorPositions[name] = {};
  for (const p of POSITIONS) extraMajorPositions[name][p] = lines[p];
  for (const c of CATEGORIES) extraMajorCategories[c][name] = lines[c];
}

export const interpretations: Record<string, Record<string, string>> = {
  ...baseInterpretations,
  ...extraMajorPositions,
  ...minorPositions,
};

export const categoryInterpretations: Record<string, Record<string, string>> = Object.fromEntries(
  CATEGORIES.map((c) => [
    c,
    {
      ...baseCategoryInterpretations[c],
      ...extraMajorCategories[c],
      ...minorCategories[c],
    },
  ])
);

const extraOverall: Record<Category, string[]> = {
  love: [
    "However this feels right now, you deserve love that's gentle and steady. Let yourself ask for what you need.",
    "The cards are inviting you to love yourself with the same patience you'd offer someone you care about.",
    "Notice who makes you feel at ease. That feeling is a better compass than any grand gesture.",
  ],
  career: [
    "Your path doesn't have to look like anyone else's. Small, honest steps are still real progress.",
    "You're allowed to want work that feels meaningful, and to take your time finding it.",
    "Rest is part of the work. You'll make better choices when you aren't running on empty.",
  ],
  friendship: [
    "Reach out to someone you've been thinking about. A small message can mean more than you'd guess.",
    "The right people make room for all your versions: the tired one, the silly one, the one still figuring things out.",
    "Friendship takes tending, and so do you. Give yourself the same care you give them.",
  ],
  life: [
    "You're doing better than you give yourself credit for. Look back at how far you've come.",
    "This chapter doesn't need a title yet. It's okay to live in the not-knowing for a while.",
    "Be patient with yourself. Growth is quiet most of the time.",
  ],
  specific: [
    "Whatever you decide, let it come from calm rather than panic. The answer tends to show up in the quiet.",
    "You already hold more of the answer than you think. The cards are just helping you hear it.",
    "There's no wrong move here that can't be gently corrected. Take a breath and trust yourself.",
  ],
  random: [
    "Take what resonated and let the rest go. You're doing just fine.",
    "Something small and kind toward yourself today will go further than any big answer.",
    "You came here with a question, and that curiosity is already a good sign.",
  ],
};

export const overallMessages: Record<string, string[]> = Object.fromEntries(
  CATEGORIES.map((c) => [c, [...(baseOverallMessages[c] ?? []), ...extraOverall[c]]])
);

/* ------------------------------------------------------------------ */
/* Handy helpers                                                       */
/* ------------------------------------------------------------------ */

/** All 78 card names (22 Major + 56 Minor). Use this to build your deck. */
export const allCardNames: string[] = Object.keys(interpretations);

export const minorArcanaNames: string[] = Object.keys(minorPositions);

/** Pick a random overall message for a category. */
export function pickOverallMessage(category: string): string {
  const list = overallMessages[category] ?? overallMessages.random;
  return list[Math.floor(Math.random() * list.length)];
}