"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { tarotCards } from "@/lib/tarot";

export default function PickPage() {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [deck, setDeck] = useState(tarotCards);
  const [deckLoaded, setDeckLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedDeck = sessionStorage.getItem("shuffledDeck");

    if (savedDeck) {
      try {
        const parsedDeck = JSON.parse(savedDeck);

        if (
          Array.isArray(parsedDeck) &&
          parsedDeck.length === tarotCards.length
        ) {
          setDeck(parsedDeck);
        }
      } catch {
        console.error("Could not load the shuffled tarot deck.");
      }
    }

    setDeckLoaded(true);
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) return;
    if (selectedCards.length >= 3) return;

    setSelectedCards((current) => [...current, index]);
  };

  const positions = ["Past", "Present", "Future"];

  const revealReading = () => {
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
  };

  if (!deckLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#100c18] text-[#f8f1e7]">
        <p className="text-sm text-purple-200/60">
          preparing your cards... ✦
        </p>
      </main>
    );
  }

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

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/40">
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

        <p className="mt-3 text-xs text-white/30">
          {selectedCards.length} of 3 cards selected
        </p>

        {/* Shuffled Tarot Cards */}

        <div className="mt-14 grid grid-cols-3 gap-x-3 gap-y-12 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-14 md:grid-cols-5 lg:grid-cols-6">
          {deck.map((card, index) => {
            const selectedIndex = selectedCards.indexOf(index);
            const isSelected = selectedIndex !== -1;

            return (
              <motion.button
                key={card.name}
                type="button"
                aria-label={
                  isSelected
                    ? `${card.name}, selected as ${positions[selectedIndex]}`
                    : `Select a tarot card, card ${index + 1}`
                }
                aria-pressed={isSelected}
                onClick={() => handleCardClick(index)}
                disabled={selectedCards.length >= 3 && !isSelected}
                whileHover={!isSelected ? { y: -8 } : {}}
                whileTap={!isSelected ? { scale: 0.96 } : {}}
                className="relative h-44 w-28 disabled:cursor-default disabled:opacity-60 sm:h-56 sm:w-36"
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
                    className="absolute inset-0 rounded-2xl border border-purple-200/20 bg-[#241a31] p-2 shadow-xl"
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
                    className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-purple-200/30 bg-[#e9dfd1] p-3 text-[#241a31] shadow-xl sm:p-4"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span className="text-xs opacity-50">
                      {card.symbol}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#241a31]/30 sm:h-20 sm:w-20">
                      <span className="font-serif text-2xl sm:text-4xl">
                        {card.icon}
                      </span>
                    </div>

                    <span className="font-serif text-center text-[11px] font-medium leading-tight sm:text-sm">
                      {card.name}
                    </span>
                  </div>
                </motion.div>

                {/* Position */}

                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-purple-200/70"
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
              onClick={revealReading}
              className="mt-6 rounded-full bg-[#f8f1e7] px-8 py-4 text-sm font-medium text-[#17111f]"
            >
              reveal my reading ✨
            </motion.button>
          </motion.div>
        )}

        <p className="mt-16 text-xs text-white/20">
          ✦ there are no wrong cards ✦
        </p>
      </div>
    </main>
  );
}
