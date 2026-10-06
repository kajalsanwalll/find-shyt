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
        <p className="text-white/50">your cards are hiding from us... 👀</p>
      </main>
    );
  }

  const selectedCards = reading.selectedCards || [];

  return (
    <main className="min-h-screen bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto max-w-4xl px-6 py-16">
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

        <div className="mt-16 space-y-8">
          {selectedCards.map((cardIndex: number, index: number) => {
            const card = tarotCards[cardIndex];
            const position = positions[index];

            if (!card) return null;

            return (
              <motion.div
                key={`${card.name}-${index}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="rounded-3xl border border-purple-200/10 bg-white/[0.03] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex h-40 w-28 shrink-0 flex-col items-center justify-between rounded-2xl border border-purple-200/20 bg-[#e9dfd1] p-4 text-[#241a31]">
                    <span className="text-xs opacity-50">
                      {card.symbol}
                    </span>

                    <span className="text-4xl">✦</span>

                    <span className="text-center font-serif text-xs">
                      {card.name}
                    </span>
                  </div>

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
                      This card carries the energy of{" "}
                      <span className="text-purple-200">
                        {card.meaning}
                      </span>
                      . It might be worth asking yourself where this energy
                      is showing up in your life right now.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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