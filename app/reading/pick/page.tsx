"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PickPage() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const router = useRouter();
  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) return;

    if (selectedCards.length >= 3) return;

    setSelectedCards((current) => [...current, index]);
  };

  const positions = ["Past", "Present", "Future"];

  return (
    <main className="min-h-screen overflow-hidden bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-16">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="mb-4 text-sm text-purple-200/50">
            trust your first instinct.
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl">
            Pick 3 cards.
          </h1>

          <p className="mt-5 text-sm text-white/40">
            Don't overthink it. Just pick the ones you're drawn to.
          </p>
        </motion.div>

        {/* Progress */}

        <div className="mt-8 flex items-center gap-3">
          {[0, 1, 2].map((number) => (
            <div
              key={number}
              className={`h-1.5 w-10 rounded-full transition-all duration-500 ${
                number < selectedCards.length
                  ? "bg-purple-200"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Cards */}

        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
          {tarotCards.map((card, index) => {
            const selectedIndex = selectedCards.indexOf(index);
            const isSelected = selectedIndex !== -1;

            return (
              <motion.button
                key={card.name}
                type="button"
                onClick={() => handleCardClick(index)}
                disabled={selectedCards.length >= 3 && !isSelected}
                whileHover={!isSelected ? { y: -10 } : {}}
                whileTap={!isSelected ? { scale: 0.96 } : {}}
                className="relative h-44 w-28 sm:h-60 sm:w-40"
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{
                    rotateY: isSelected ? 180 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* CARD BACK */}

                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-2xl border border-purple-200/20 bg-[#241a31] p-2 shadow-xl"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-xl border border-purple-200/15 bg-[#17111f]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-200/20 sm:h-24 sm:w-24">
                        <span className="text-2xl text-purple-200/70 sm:text-4xl">
                          ✦
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CARD FRONT */}

                  <div
                    className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-purple-200/30 bg-[#e9dfd1] p-3 text-[#241a31] shadow-xl sm:p-5"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span className="text-xs opacity-50">
                      {card.symbol}
                    </span>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#241a31]/30 sm:h-24 sm:w-24">
                      <span className="font-serif text-2xl sm:text-4xl">
                        ✦
                      </span>
                    </div>

                    <span className="font-serif text-xs font-medium sm:text-sm">
                      {card.name}
                    </span>
                  </div>
                </motion.div>

                {/* Position */}

                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-purple-200/70"
                  >
                    {positions[selectedIndex]}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Completion */}

        {selectedCards.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <p className="font-serif text-2xl">
              okay... interesting. 👀
            </p>

            <p className="mt-2 text-sm text-white/40">
              Let's see what the cards have to say.
            </p>

            <motion.button
  type="button"
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  onClick={() => {
    const reading = JSON.parse(
      sessionStorage.getItem("reading") || "{}"
    );

    sessionStorage.setItem(
      "reading",
      JSON.stringify({
        ...reading,
        selectedCards,
      })
    );

    router.push("/reading/result");
  }}
  className="mt-6 rounded-full bg-[#f8f1e7] px-8 py-4 text-sm font-medium text-[#17111f]"
>
  reveal my reading ✨
</motion.button>
          </motion.div>
        )}
      </div>
    </main>
  );
}