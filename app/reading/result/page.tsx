"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const tarotCards = [
  {
    name: "The Fool",
    meaning: "new beginnings, taking a leap, trusting the journey",
    symbol: "0",
  },
  {
    name: "The Magician",
    meaning: "confidence, potential, making things happen",
    symbol: "I",
  },
  {
    name: "The High Priestess",
    meaning: "intuition, mystery, trusting your inner voice",
    symbol: "II",
  },
  {
    name: "The Empress",
    meaning: "growth, creativity, abundance, softness",
    symbol: "III",
  },
  {
    name: "The Emperor",
    meaning: "structure, stability, taking control",
    symbol: "IV",
  },
  {
    name: "The Lovers",
    meaning: "connection, choices, alignment",
    symbol: "VI",
  },
  {
    name: "The Chariot",
    meaning: "determination, movement, taking the reins",
    symbol: "VII",
  },
  {
    name: "Strength",
    meaning: "inner strength, patience, courage",
    symbol: "VIII",
  },
  {
    name: "The Hermit",
    meaning: "reflection, solitude, finding your own answer",
    symbol: "IX",
  },
  {
    name: "The Star",
    meaning: "hope, healing, optimism, renewal",
    symbol: "XVII",
  },
  {
    name: "The Moon",
    meaning: "uncertainty, emotions, things not being fully clear",
    symbol: "XVIII",
  },
  {
    name: "The Sun",
    meaning: "joy, clarity, confidence, good energy",
    symbol: "XIX",
  },
];

const interpretations: Record<string, Record<string, string>> = {
  "The Fool": {
    Past: "You may have recently left something familiar behind, even if you weren't completely sure where you were going.",
    Present:
      "You're being nudged toward something new. You don't need the entire plan figured out before taking the first step.",
    Future:
      "Something unfamiliar may be opening up for you. The interesting part is that you probably won't know exactly where it leads yet.",
  },

  "The Magician": {
    Past: "You've already had more ability and resources than you gave yourself credit for.",
    Present:
      "You have more control over this situation than you think. Stop waiting for the perfect moment and work with what you already have.",
    Future:
      "You're moving toward a phase where your own skills and decisions matter more than outside validation.",
  },

  "The High Priestess": {
    Past: "There may have been things you sensed but didn't fully acknowledge at the time.",
    Present:
      "Not everything needs an immediate answer. Your intuition may be noticing something your logical brain hasn't caught up with yet.",
    Future:
      "Something may become clearer once you stop forcing an answer and give yourself some space.",
  },

  "The Empress": {
    Past: "You've been growing more than you realize, even if the progress felt slow.",
    Present:
      "This is a softer chapter. Give yourself permission to enjoy things, create things, and actually receive good energy instead of constantly chasing the next goal.",
    Future:
      "Something you've been nurturing has room to grow. Don't underestimate what consistency and patience can create.",
  },

  "The Emperor": {
    Past: "A situation may have taught you that structure and boundaries matter more than you thought.",
    Present:
      "You may need to take control instead of waiting for someone else to make the decision for you.",
    Future:
      "Things could become more stable once you create clearer boundaries and decide what you actually want.",
  },

  "The Lovers": {
    Past: "A relationship or important choice may still be influencing how you're approaching this situation.",
    Present:
      "This is less about choosing what looks perfect and more about choosing what actually feels aligned with you.",
    Future:
      "A meaningful connection or important choice may become more significant than it currently seems.",
  },

  "The Chariot": {
    Past: "You've already pushed through something that required more determination than people around you probably realized.",
    Present:
      "You're in a take-the-wheel moment. Pick a direction and stop letting every little distraction change your course.",
    Future:
      "Momentum is building. Once you commit to a direction, things may start moving much faster.",
  },

  Strength: {
    Past: "You've learned that being strong doesn't always mean being loud or fighting harder.",
    Present:
      "Patience is actually your power right now. You don't need to force this situation.",
    Future:
      "You'll probably handle what's coming better than you currently think you will.",
  },

  "The Hermit": {
    Past: "You've spent time figuring things out on your own, and that solitude taught you something important.",
    Present:
      "You might need less outside advice and a little more time listening to yourself.",
    Future:
      "A period of reflection may help you understand what you actually want before your next big move.",
  },

  "The Star": {
    Past: "Something may have disappointed you, but it didn't completely take away your hope.",
    Present:
      "There is still something worth believing in here. Give yourself permission to be optimistic again.",
    Future:
      "This points toward a lighter chapter where things may start feeling more hopeful and clear.",
  },

  "The Moon": {
    Past: "There may have been confusion, mixed signals, or emotions that made a situation harder to understand.",
    Present:
      "Not everything is clear right now, and that's okay. Don't make a permanent decision based on temporary uncertainty.",
    Future:
      "Something hidden or unclear may eventually come to light. Give it time before assuming the worst.",
  },

  "The Sun": {
    Past: "You've already experienced a moment when things felt simpler, happier, or more certain.",
    Present:
      "Honestly? This is good energy. Let yourself enjoy what's going right instead of immediately looking for what could go wrong.",
    Future:
      "Clarity and confidence are heading your way. Something may turn out better than you currently expect.",
  },
};

const categoryInterpretations: Record<
  string,
  Record<string, string>
> = {
  love: {
    "The Fool":
      "There's fresh energy around your love life. If you've been waiting for a sign to stop overthinking and let yourself experience something new, this might be it.",
    "The Magician":
      "You have more influence over your love life than you think. Communication, confidence, and actually expressing what you want could change the situation.",
    "The High Priestess":
      "Something about this connection may not be fully spoken out loud. Pay attention to your intuition, especially if someone's actions feel different from their words.",
    "The Empress":
      "This is soft, attractive energy. You deserve a connection where affection doesn't feel like something you have to earn.",
    "The Emperor":
      "Boundaries matter here. Don't confuse someone being emotionally unavailable with them being mysterious.",
    "The Lovers":
      "Okay... this one is VERY on theme. 👀 There's a meaningful choice or connection here, but alignment matters more than simply wanting someone.",
    "The Chariot":
      "Someone needs to make a move. Waiting forever for the other person to figure it out probably isn't helping.",
    Strength:
      "Don't chase. Don't force. Let someone's consistency tell you more than their occasional bursts of attention.",
    "The Hermit":
      "You may need some distance from the situation to understand what you actually want from this person.",
    "The Star":
      "There's hopeful energy here. Even if something hasn't worked out yet, your love life isn't as doomed as your 2 a.m. thoughts suggest.",
    "The Moon":
      "Mixed signals are probably the headline here. Don't turn uncertainty into a love story just because you want the answer to be yes.",
    "The Sun":
      "This is warm, honest, happy energy. A connection may become clearer once you stop trying to decode every tiny interaction.",
  },

  career: {
    "The Fool":
      "You may be entering a new phase academically or professionally. You don't need to know the entire career path before taking the opportunity in front of you.",
    "The Magician":
      "You already have useful skills. The next step may be less about learning everything and more about actually showing people what you can do.",
    "The High Priestess":
      "You may already know which direction feels right. Don't let everyone else's career advice drown out your own instincts.",
    "The Empress":
      "Your skills are developing. Give yourself time to build something instead of constantly comparing your timeline with everyone else's.",
    "The Emperor":
      "Structure is your friend right now. A clearer plan, stronger routine, or better boundaries could make a bigger difference than another random productivity hack.",
    "The Lovers":
      "A career decision may come down to choosing what actually aligns with you rather than what simply looks impressive on paper.",
    "The Chariot":
      "You're being pushed toward action. Pick a target, commit, and start moving instead of endlessly preparing.",
    Strength:
      "Progress may be slower than you'd like, but consistency is going to matter more than one spectacular burst of effort.",
    "The Hermit":
      "You may need some quiet time to figure out what kind of work you actually enjoy, rather than following the path everyone expects.",
    "The Star":
      "Keep going. Something you've been working toward has genuine potential, even if the result isn't visible yet.",
    "The Moon":
      "Career uncertainty is showing up strongly. Before making a dramatic decision, separate 'I hate this' from 'I don't know where this is going.'",
    "The Sun":
      "This is a great card for confidence and visibility. Your work may finally start getting the recognition you've been hoping for.",
  },

  friendship: {
    "The Fool":
      "A new friendship or a new version of an existing friendship may be entering your life.",
    "The Magician":
      "You have more influence over the friendship dynamic than you think. Sometimes someone just needs you to initiate.",
    "The High Priestess":
      "Trust your gut about people. If something feels off, you don't need a ten-page investigation to take a step back.",
    "The Empress":
      "This is nurturing friendship energy. Look for people who make you feel safe being completely yourself.",
    "The Emperor":
      "Healthy friendships need boundaries too. You don't have to constantly be available to prove that you care.",
    "The Lovers":
      "This connection may be more meaningful than you realize. Choose friendships where the effort goes both ways.",
    "The Chariot":
      "Someone may need to make the first move. If you miss a friend, maybe just text them.",
    Strength:
      "Patience matters here. Not every friendship needs to be fixed immediately.",
    "The Hermit":
      "You may be entering a more independent phase socially. That's not necessarily loneliness.",
    "The Star":
      "There's healing energy around your friendships. A difficult chapter doesn't mean every friendship is doomed.",
    "The Moon":
      "Something about a friendship may feel unclear. Don't assume the worst before you actually know what's going on.",
    "The Sun":
      "This is genuinely lovely friendship energy. Spend time with the people who make ordinary days feel better.",
  },

  life: {
    "The Fool":
      "You're standing near the beginning of something. You don't need certainty before you start.",
    "The Magician":
      "You have more agency than you think. Start using what you already have instead of waiting until you're somehow 'ready.'",
    "The High Priestess":
      "Slow down. Your inner voice may be quieter than the outside noise, but that doesn't mean it's wrong.",
    "The Empress":
      "You're in a growth era. Let yourself become someone new without feeling guilty for outgrowing an older version of yourself.",
    "The Emperor":
      "A little structure could bring a lot of peace. Decide what actually matters and build around that.",
    "The Lovers":
      "A major theme right now is alignment: are your choices actually matching the person you're becoming?",
    "The Chariot":
      "You've got momentum. Pick a direction and stop letting every tiny setback convince you that you've chosen wrong.",
    Strength:
      "You don't have to have everything together. Quiet resilience counts too.",
    "The Hermit":
      "You may need a little solitude to hear your own thoughts again.",
    "The Star":
      "This is a reminder that things can get better without becoming perfect.",
    "The Moon":
      "You're probably in an uncertain chapter. That's uncomfortable, but uncertainty isn't automatically a bad sign.",
    "The Sun":
      "Something is becoming clearer. Let yourself enjoy this chapter instead of immediately worrying about the next one.",
  },

  specific: {
    "The Fool":
      "Whatever you're asking about, there seems to be an invitation to stop treating uncertainty as a reason not to begin.",
    "The Magician":
      "You may already have one of the answers you're looking for. The question is whether you're actually willing to act on it.",
    "The High Priestess":
      "There's something here that deserves a little more listening and a little less forcing.",
    "The Empress":
      "Whatever this situation is, growth seems more likely when you approach it with patience instead of pressure.",
    "The Emperor":
      "This situation may benefit from clearer boundaries, expectations, or decisions.",
    "The Lovers":
      "The heart of this situation may be a choice: what actually aligns with what you want?",
    "The Chariot":
      "Something needs movement. Staying stuck and thinking about it for another three weeks probably isn't the answer.",
    Strength:
      "You may be stronger in this situation than you currently feel.",
    "The Hermit":
      "You probably need your own answer here rather than another person's opinion.",
    "The Star":
      "Don't dismiss hope just because the situation hasn't worked out yet.",
    "The Moon":
      "There's not enough information yet to see the whole picture. Give yourself permission not to know.",
    "The Sun":
      "Clarity is coming into this situation. Look for what feels simple and honest rather than unnecessarily complicated.",
  },

  random: {
    "The Fool":
      "Plot twist: you're probably being asked to try something you've been putting off.",
    "The Magician":
      "You have more power over your current situation than you've been giving yourself credit for.",
    "The High Priestess":
      "Your intuition has entered the chat. Maybe listen to it.",
    "The Empress":
      "More softness. More creativity. Less treating your life like a productivity competition.",
    "The Emperor":
      "Get your life together... but like, gently.",
    "The Lovers":
      "A choice is coming. Choose the thing that actually feels like you.",
    "The Chariot":
      "Pick a direction and MOVE. You can course-correct later.",
    Strength:
      "You don't need to prove anything today. Quiet strength is still strength.",
    "The Hermit":
      "Maybe disappear from the group chat for a minute and figure out what you actually think.",
    "The Star":
      "Things aren't as hopeless as your brain is making them seem.",
    "The Moon":
      "You don't have all the information yet. And that's okay.",
    "The Sun":
      "Honestly? Something good is probably worth letting yourself enjoy.",
  },
};

const positions = [
  {
    name: "Past",
    intro: "something from your past may still be shaping this",
  },
  {
    name: "Present",
    intro: "this feels connected to where you are right now",
  },
  {
    name: "Future",
    intro: "this points toward the energy you're moving into",
  },
];

export default function ResultPage() {
  const [reading, setReading] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("reading");

    if (stored) {
      setReading(JSON.parse(stored));
    }
  }, []);

  if (!reading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#100c18] text-[#f8f1e7]">
        <p className="text-white/50">
          your cards are hiding from us... 👀
        </p>
      </main>
    );
  }

  const selectedCards = reading.selectedCards || [];

  return (
    <main className="min-h-screen bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="mb-4 text-sm text-purple-200/50">
            okay... let's see 👀
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl">
            your reading.
          </h1>

          {reading.question && (
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/50">
              "{reading.question}"
            </p>
          )}
        </motion.div>

        {/* CARDS */}
        <div className="mt-16 space-y-8">
          {selectedCards.map(
            (cardIndex: number, index: number) => {
              const card = tarotCards[cardIndex];
              const position = positions[index];

              if (!card || !position) return null;

              return (
                <motion.div
                  key={`${card.name}-${index}`}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="rounded-3xl border border-purple-200/10 bg-white/[0.03] p-6 sm:p-8"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                    {/* CARD */}
                    <div className="flex h-40 w-28 shrink-0 flex-col items-center justify-between rounded-2xl border border-purple-200/20 bg-[#e9dfd1] p-4 text-[#241a31]">
                      <span className="text-xs opacity-50">
                        {card.symbol}
                      </span>

                      <span className="text-4xl">
                        ✦
                      </span>

                      <span className="text-center font-serif text-xs">
                        {card.name}
                      </span>
                    </div>

                    {/* READING */}
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-purple-200/50">
                        {position.name}
                      </p>

                      <h2 className="mt-2 font-serif text-3xl">
                        {card.name}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-white/50">
                        {position.intro}.
                      </p>

                      <p className="mt-4 text-sm leading-7 text-purple-100/80">
  {categoryInterpretations[reading.category]?.[card.name] ||
    interpretations[card.name]?.[position.name]}
</p>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {/* ENDING */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="font-serif text-2xl">
            take what resonates. ✨
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
            The cards aren't here to decide your life for you.
            They're just giving you something to think about.
          </p>

          <p className="mt-8 text-xs text-white/25">
            for reflection, fun & a little ✨delusion✨
          </p>
        </motion.div>

      </div>
    </main>
  );
}