"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const cards = Array.from({ length: 7 });

export default function DeckPage() {
  const [shuffling, setShuffling] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const router = useRouter();
  const shuffleDeck = () => {
    setShuffling(true);

    setTimeout(() => {
      setShuffling(false);
      setShuffled(true);
    }, 1400);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="mb-4 text-sm text-purple-200/50">
            your cards are waiting...
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl">
            {shuffled ? "pick your cards." : "let's shuffle."}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/40">
            {shuffled
              ? "Don't overthink it. Pick whatever card you're drawn to."
              : "Take a breath. Think about your question. Then shuffle."}
          </p>
        </motion.div>

        {/* Deck */}

        <div className="relative mt-14 flex h-[280px] w-full items-center justify-center">
          {cards.map((_, index) => {
            const middle = (cards.length - 1) / 2;
            const offset = index - middle;

            return (
              <motion.div
                key={index}
                animate={
                  shuffling
                    ? {
                        x: offset * 90,
                        y: index % 2 === 0 ? -70 : 70,
                        rotate: offset * 12,
                      }
                    : {
                        x: offset * 7,
                        y: Math.abs(offset) * 2,
                        rotate: offset * 2,
                      }
                }
                transition={{
                  duration: 0.7,
                  delay: shuffling ? index * 0.04 : 0,
                  ease: "easeInOut",
                }}
                className="absolute"
                style={{ zIndex: index }}
              >
                <div className="relative h-56 w-36 rounded-2xl border border-purple-200/20 bg-[#241a31] p-2 shadow-2xl">
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-purple-200/20 bg-[#17111f]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-purple-200/20">
                      <span className="text-3xl text-purple-200/70">
                        ✦
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action */}

        {!shuffled ? (
          <motion.button
            type="button"
            onClick={shuffleDeck}
            disabled={shuffling}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-[#f8f1e7] px-8 py-4 text-sm font-medium text-[#17111f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {shuffling ? "shuffling..." : "shuffle the deck ✦"}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="mb-5 text-sm text-white/40">
              okay. trust your gut.
            </p>

            <motion.button
  type="button"
  onClick={() => router.push("/reading/pick")}
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  className="rounded-full border border-white/15 px-7 py-3 text-sm transition hover:bg-white/5"
>
  I'm ready →
</motion.button>
          </motion.div>
        )}

        <p className="mt-12 text-xs text-white/20">
          ✦ there are no wrong cards ✦
        </p>
      </div>
    </main>
  );
}