"use client";

// app/reading/result/page.tsx

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Gloock, Instrument_Sans } from "next/font/google";
import { tarotCards } from "@/lib/tarot";
import { spreads, isSpreadId, type Spread } from "@/lib/spreads";
// Move the three data blocks out of this file into lib/interpretations.ts and export them.
import {
  interpretations,
  categoryInterpretations,
  overallMessages,
} from "@/lib/interpretations";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/*
  Palette (shared with the other pages): ink #17152b, bone #f2e8cf, cobalt #2b4bb0,
  ochre #eaae2c, vermilion #d2442e, sage #7fae93
*/

const pageClass = `${display.variable} ${body.variable} min-h-screen bg-[#2b4bb0] font-[family-name:var(--font-body)] text-[#f2e8cf]`;
const dots = {
  backgroundImage: "radial-gradient(rgba(242,232,207,0.16) 1.5px, transparent 1.5px)",
  backgroundSize: "34px 34px",
};

type Time = "Past" | "Present" | "Future";

// Which of the Past / Present / Future interpretations each position borrows from
const timeFor: Record<string, Time> = {
  Past: "Past",
  Present: "Present",
  Future: "Future",
  "Your card": "Present",
  Situation: "Present",
  Challenge: "Present",
  Outcome: "Future",
};

const intros: Record<string, string> = {
  Past: "something from your past may still be shaping this",
  Present: "this feels connected to where you are right now",
  Future: "this points toward the energy you're moving into",
  "Your card": "this is the energy around your question right now",
  Situation: "this is the heart of what's going on",
  Challenge: "this is what may be getting in the way",
  Outcome: "this is where things may be heading",
};

const pills = [
  { bg: "#d2442e", fg: "#f2e8cf" },
  { bg: "#eaae2c", fg: "#17152b" },
  { bg: "#2b4bb0", fg: "#f2e8cf" },
  { bg: "#7fae93", fg: "#17152b" },
  { bg: "#17152b", fg: "#f2e8cf" },
];

const buttonClass =
  "rounded-full border-[3px] border-[#17152b] bg-[#eaae2c] px-8 py-4 text-base font-semibold text-[#17152b] shadow-[5px_5px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f2e8cf] active:translate-x-1 active:translate-y-1 active:shadow-none";

export default function ResultPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [reading, setReading] = useState<any>(null);
  const [deck, setDeck] = useState(tarotCards);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("reading");
      const savedDeck = sessionStorage.getItem("shuffledDeck");

      if (savedDeck) {
        const parsedDeck = JSON.parse(savedDeck);
        if (Array.isArray(parsedDeck) && parsedDeck.length === tarotCards.length) {
          setDeck(parsedDeck);
        }
      }

      if (stored) {
        setReading(JSON.parse(stored));
      }
    } catch {
      console.error("Could not load your tarot reading.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <main className={`${pageClass} flex items-center justify-center`} style={dots}>
        <p className="text-lg text-[#f2e8cf]/85">gathering your cards...</p>
      </main>
    );
  }

  if (!reading) {
    return (
      <main className={`${pageClass} flex flex-col items-center justify-center px-6`} style={dots}>
        <p className="font-[family-name:var(--font-display)] text-3xl">
          your cards are hiding from us.
        </p>
        <Link href="/reading" className={`${buttonClass} mt-8`}>
          Start a new reading
        </Link>
      </main>
    );
  }

  const selectedCards: number[] = Array.isArray(reading.selectedCards)
    ? reading.selectedCards
    : [];

  // Spread saved by the pick page; older sessions fall back to the number of cards picked.
  const spread: Spread = isSpreadId(reading.spread)
    ? spreads[reading.spread]
    : selectedCards.length === 1
    ? spreads.one
    : selectedCards.length === 5
    ? spreads.cross
    : spreads.three;

  const category =
    typeof reading.category === "string" && overallMessages[reading.category]
      ? reading.category
      : "random";

  const messages = overallMessages[category];

  const overallMessage =
    messages[
      selectedCards.reduce(
        (sum, cardIndex) => sum + (Number.isInteger(cardIndex) ? cardIndex : 0),
        0
      ) % messages.length
    ];

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : delay, duration: reduce ? 0 : 0.4 },
  });

  return (
    <main className={pageClass} style={dots}>
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* HEADER */}
        <motion.header {...fade(0)} className="text-center">
          <p className="mb-4 text-lg text-[#f2e8cf]/85">okay... let&apos;s see</p>
          <h1 className="font-[family-name:var(--font-display)] text-6xl sm:text-8xl">
            your reading.
          </h1>
          {reading.question && (
            <p className="mx-auto mt-8 max-w-xl rounded-2xl border-[3px] border-[#17152b] bg-[#f2e8cf] px-6 py-4 text-base leading-7 text-[#17152b] shadow-[5px_5px_0_#17152b]">
              &ldquo;{reading.question}&rdquo;
            </p>
          )}
        </motion.header>

        {/* CARDS */}
        <div className="mt-16 space-y-10">
          {selectedCards.map((cardIndex, index) => {
            // IMPORTANT: Look up the card in the SAME shuffled deck.
            const card = deck[cardIndex];
            const positionName = spread.positions[index];

            if (!card || !positionName) return null;

            const time = timeFor[positionName] ?? "Present";
            const pill = pills[index % pills.length];

            const interpretation =
              categoryInterpretations[category]?.[card.name] ||
              interpretations[card.name]?.[time] ||
              `This card brings up themes of ${card.meaning}. Think about where these themes might be showing up in your life right now.`;

            return (
              <motion.article
                key={`${card.name}-${index}`}
                {...fade(0.15 + index * 0.15)}
                className="rounded-3xl border-[3px] border-[#17152b] bg-[#f2e8cf] p-6 text-[#17152b] shadow-[8px_8px_0_#17152b] sm:p-8"
              >
                <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                  {/* ACTUAL TAROT CARD IMAGE */}
                  <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-xl border-[3px] border-[#17152b] bg-[#e9dfd1] shadow-[5px_5px_0_#17152b] sm:w-44">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="176px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>

                  {/* READING */}
                  <div className="text-center sm:text-left">
                    <span
                      className="inline-block rounded-full border-[3px] border-[#17152b] px-4 py-1 text-sm font-semibold"
                      style={{ background: pill.bg, color: pill.fg }}
                    >
                      {positionName}
                    </span>

                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
                      {card.name}
                    </h2>

                    <p className="mt-2 text-base text-[#17152b]/70">{intros[positionName]}.</p>

                    <p className="mt-5 text-lg leading-8">{interpretation}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* OVERALL ENERGY */}
        <motion.section
          {...fade(0.3 + selectedCards.length * 0.15)}
          className="mt-16 rounded-3xl border-[3px] border-[#17152b] bg-[#eaae2c] p-8 text-center text-[#17152b] shadow-[8px_8px_0_#17152b] sm:p-12"
        >
          <p className="text-base font-medium">overall energy</p>

          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            okay... here&apos;s the thing.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8">{overallMessage}</p>

          <div className="mx-auto mt-8 h-[3px] w-16 bg-[#17152b]" />

          <p className="mt-6 text-sm font-medium">
            {spread.positions.join(" \u00b7 ").toLowerCase()}
          </p>
        </motion.section>

        {/* ENDING */}
        <motion.div {...fade(0.5 + selectedCards.length * 0.15)} className="mt-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl">take what resonates.</p>

          <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-[#f2e8cf]/85">
            The cards aren&apos;t here to decide your life for you. They&apos;re just giving you
            something to think about.
          </p>

          <p className="mt-8 text-sm text-[#f2e8cf]/70">for reflection, fun & a little delusion</p>

          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem("reading");
                sessionStorage.removeItem("shuffledDeck");
              } catch {
                // storage blocked; nothing to clear
              }
              router.push("/reading");
            }}
            className={`${buttonClass} mt-8`}
          >
            Start a new reading
          </button>
        </motion.div>
      </div>
    </main>
  );
}