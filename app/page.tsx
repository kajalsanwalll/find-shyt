"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Gloock, Instrument_Sans } from "next/font/google";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/*
  Palette — a Marseille-deck print: flat inks on bone, thick outlines.
  ink    #17152b   bone   #f2e8cf   cobalt #2b4bb0
  ochre  #eaae2c   vermilion #d2442e   sage #7fae93
*/

/* ---------- data ---------- */

type Arcana = {
  numeral: string;
  name: string;
  meaning: string;
  field: string; // illustration background
  art: ReactNode;
};

const INK = "#17152b";

const deck: Arcana[] = [
  {
    numeral: "XVIII",
    name: "The Moon",
    meaning: "Not everything is clear yet, and that's okay. Listen to your gut, and let the morning light help you decide.",
    field: "#2b4bb0",
    art: (
      <>
        <path d="M60 18a34 34 0 1 0 22 60A27 27 0 0 1 60 18z" fill="#f2e8cf" stroke={INK} strokeWidth="3" />
        <path d="M18 112h84v8H18z" fill="#17152b" />
        <path d="M28 112V92h14v20M78 112V92h14v20" fill="#d2442e" stroke={INK} strokeWidth="3" />
      </>
    ),
  },
  {
    numeral: "XVII",
    name: "The Star",
    meaning: "Hope is finding its way back to you, softly. Rest, fill your cup, and let yourself believe it can get better.",
    field: "#eaae2c",
    art: (
      <>
        <path d="M60 14l9 26 27 3-21 18 7 27-22-15-22 15 7-27-21-18 27-3z" fill="#f2e8cf" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="22" cy="100" r="5" fill={INK} />
        <circle cx="98" cy="96" r="5" fill={INK} />
        <circle cx="60" cy="112" r="5" fill="#d2442e" stroke={INK} strokeWidth="2" />
      </>
    ),
  },
  {
    numeral: "XIX",
    name: "The Sun",
    meaning: "Warmth, joy, something good you've earned. You're allowed to say yes to it without apologizing.",
    field: "#d2442e",
    art: (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M60 10l5 16h-10z" fill="#eaae2c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" transform={`rotate(${i * 30} 60 62)`} />
        ))}
        <circle cx="60" cy="62" r="26" fill="#f2e8cf" stroke={INK} strokeWidth="3" />
        <circle cx="52" cy="58" r="3" fill={INK} />
        <circle cx="68" cy="58" r="3" fill={INK} />
        <path d="M50 70q10 8 20 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    numeral: "IX",
    name: "The Hermit",
    meaning: "It's okay to step away from the noise for a while. What you're looking for is already quietly there inside you.",
    field: "#7fae93",
    art: (
      <>
        <path d="M60 20l32 86H28z" fill="#2b4bb0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="60" cy="52" r="9" fill="#f2e8cf" stroke={INK} strokeWidth="3" />
        <path d="M88 60v36" stroke={INK} strokeWidth="3" />
        <rect x="80" y="40" width="16" height="22" rx="3" fill="#eaae2c" stroke={INK} strokeWidth="3" />
      </>
    ),
  },
  {
    numeral: "VI",
    name: "The Lovers",
    meaning: "A choice that comes from the heart. Be tender and honest with yourself about what you truly want.",
    field: "#eaae2c",
    art: (
      <>
        <circle cx="46" cy="62" r="30" fill="#d2442e" stroke={INK} strokeWidth="3" />
        <circle cx="74" cy="62" r="30" fill="#2b4bb0" fillOpacity="0.9" stroke={INK} strokeWidth="3" />
        <path d="M60 36a30 30 0 0 1 0 52a30 30 0 0 1 0-52z" fill="#f2e8cf" stroke={INK} strokeWidth="3" />
      </>
    ),
  },
  {
    numeral: "X",
    name: "Wheel of Fortune",
    meaning: "Things are turning. Loosen your grip a little. This time, the change is coming to help you.",
    field: "#d2442e",
    art: (
      <>
        <circle cx="60" cy="62" r="40" fill="#f2e8cf" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="60" y1="62" x2="60" y2="22" stroke={INK} strokeWidth="3" transform={`rotate(${i * 45} 60 62)`} />
        ))}
        <circle cx="60" cy="62" r="12" fill="#eaae2c" stroke={INK} strokeWidth="3" />
        <circle cx="60" cy="62" r="26" fill="none" stroke={INK} strokeWidth="3" />
      </>
    ),
  },
];

const spreads = [
  {
    id: "one",
    name: "One card",
    when: "A small, quiet nudge for today.",
    cells: [[1, 1]],
  },
  {
    id: "three",
    name: "Three cards",
    when: "Where you've been, where you are, and where you might be headed.",
    cells: [[0, 1], [1, 1], [2, 1]],
  },
  {
    id: "cross",
    name: "The crossroads",
    when: "Five cards, for when your heart is pulling in two directions.",
    cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  },
];

/* ---------- card ---------- */

function CardFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 rounded-[14px] border-[3px] border-[#17152b] bg-[#f2e8cf] p-2 [backface-visibility:hidden]"
    >
      <div className="flex h-full flex-col rounded-lg border-2 border-[#17152b]">{children}</div>
    </div>
  );
}

function CardBack() {
  return (
    <CardFrame>
      <div className="relative m-1.5 flex-1 overflow-hidden rounded bg-[#17152b]">
        <svg viewBox="0 0 100 150" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="100" height="150" fill="#17152b" />
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx="50" cy="75" r={10 + i * 13} fill="none" stroke={i % 2 ? "#eaae2c" : "#d2442e"} strokeWidth="2" />
          ))}
          <path d="M50 20l7 55-7 55-7-55z" fill="#f2e8cf" />
          <path d="M10 75l40-7 40 7-40 7z" fill="#2b4bb0" />
          <circle cx="50" cy="75" r="6" fill="#eaae2c" stroke="#17152b" strokeWidth="2" />
        </svg>
      </div>
    </CardFrame>
  );
}

function CardFace({ card }: { card: Arcana }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <CardFrame>
        <p className="py-1 text-center font-[family-name:var(--font-display)] text-sm tracking-widest text-[#17152b] sm:text-base">
          {card.numeral}
        </p>
        <div className="mx-1.5 flex-1 overflow-hidden rounded border-2 border-[#17152b]" style={{ background: card.field }}>
          <svg viewBox="0 0 120 130" className="h-full w-full" aria-hidden>
            {card.art}
          </svg>
        </div>
        <p className="py-1.5 text-center font-[family-name:var(--font-display)] text-base text-[#17152b] sm:text-xl">
          {card.name}
        </p>
      </CardFrame>
    </div>
  );
}

/* ---------- the draw (the one memorable thing) ---------- */

function Draw() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const pick = () => {
    let n = Math.floor(Math.random() * deck.length);
    if (n === idx) n = (n + 1) % deck.length;
    return n;
  };

  const draw = () => {
    if (timer.current) clearTimeout(timer.current);
    if (!flipped) {
      setIdx(pick());
      setFlipped(true);
      return;
    }
    setFlipped(false);
    timer.current = setTimeout(() => {
      setIdx(pick());
      setFlipped(true);
    }, reduce ? 0 : 480);
  };

  const card = deck[idx];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[330px] w-[220px] sm:h-[420px] sm:w-[280px]" style={{ perspective: 1200 }}>
        {/* the rest of the deck, offset behind */}
        {[2, 1].map((n) => (
          <div
            key={n}
            aria-hidden
            className="absolute inset-0 rounded-[14px] border-[3px] border-[#17152b] bg-[#f2e8cf]"
            style={{ transform: `translate(${n * 9}px, ${n * 9}px)` }}
          />
        ))}
        <motion.button
          type="button"
          onClick={draw}
          aria-label={flipped ? `You drew ${card.name}. Draw again.` : "Draw a card"}
          className="absolute inset-0 cursor-pointer rounded-[14px] shadow-[8px_8px_0_#17152b] outline-none focus-visible:ring-4 focus-visible:ring-[#eaae2c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b4bb0]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 14 }}
        >
          <CardBack />
          <CardFace card={card} />
        </motion.button>
      </div>

      <div className="min-h-[96px] w-full max-w-xs text-center" aria-live="polite">
        {flipped ? (
          <p className="text-base leading-6 text-[#f2e8cf]">
            <span className="font-[family-name:var(--font-display)] text-xl">{card.name}.</span>{" "}
            {card.meaning}
          </p>
        ) : (
          <p className="text-base leading-6 text-[#f2e8cf]/80">
            Hold what's on your heart for a moment, then tap the deck.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- spreads ---------- */

function SpreadDiagram({ cells }: { cells: number[][] }) {
  return (
    <div className="grid h-24 w-24 grid-cols-3 grid-rows-3 gap-1.5" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const x = i % 3;
        const y = Math.floor(i / 3);
        const on = cells.some(([cx, cy]) => cx === x && cy === y);
        return (
          <span
            key={i}
            className={on ? "rounded-[3px] border-2 border-[#17152b] bg-[#d2442e]" : ""}
          />
        );
      })}
    </div>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#2b4bb0] font-[family-name:var(--font-body)] text-[#f2e8cf]`}
      style={{
        backgroundImage: "radial-gradient(rgba(242,232,207,0.16) 1.5px, transparent 1.5px)",
        backgroundSize: "34px 34px",
      }}
    >
      {/* hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-6xl leading-[0.95] sm:text-7xl lg:text-[6.5rem]">
            Pull a card to feel free.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-7 text-[#f2e8cf]/85">
            Think of something that&apos;s been sitting on your heart. Turn over a card and notice
            what it stirs in you. There&apos;s no right answer here, only what feels true.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/reading"
              className="rounded-full border-[3px] border-[#17152b] bg-[#eaae2c] px-8 py-4 text-base font-semibold text-[#17152b] shadow-[5px_5px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f2e8cf] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Sit down with the cards
            </Link>
            <span className="text-sm text-[#f2e8cf]/70">Take all the time you need.</span>
          </div>
        </div>

        <Draw />
      </section>

      {/* spreads */}
      <section className="border-y-[3px] border-[#17152b] bg-[#f2e8cf] text-[#17152b]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-lg font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
            How much do you want to hear today?
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {spreads.map((s, i) => (
              <Link
                key={s.id}
                href={`/reading?spread=${s.id}`}
                className="flex items-center gap-6 rounded-2xl border-[3px] border-[#17152b] p-6 shadow-[6px_6px_0_#17152b] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#17152b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b4bb0]"
                style={{ background: ["#eaae2c", "#7fae93", "#f2e8cf"][i] }}
              >
                <SpreadDiagram cells={s.cells} />
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl">{s.name}</h3>
                  <p className="mt-2 text-sm leading-6">{s.when}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* how it reads */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:items-start">
        <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          I dont know if it'll resonate or not but it'll definitely feed your soul and delusions, hehe!
        </h2>
        <div className="space-y-5 text-lg leading-8 text-[#f2e8cf]/90">
          <p>
            I am not a professional tarot reader and i dont claim that i have put any 
            energies in my cards here that would definitely sit right with your situation.
          </p>
          <p>
            But what's the harm in checking it out?
          </p>
        </div>
      </section>

      {/* closing */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border-[3px] border-[#17152b] bg-[#d2442e] p-8 shadow-[8px_8px_0_#17152b] sm:flex-row sm:items-center sm:p-12">
          <p className="max-w-md font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-4xl">
            Lesgo?
          </p>
          <Link
            href="/reading"
            className="shrink-0 rounded-full border-[3px] border-[#17152b] bg-[#f2e8cf] px-8 py-4 text-base font-semibold text-[#17152b] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#eaae2c]"
          >
            Pull a card
          </Link>
        </div>
      </section>

      <footer className="border-t-[3px] border-[#17152b] bg-[#17152b] px-6 py-6 text-center text-xs leading-5 text-[#f2e8cf]/70">
        Made with care, for quiet moments. Keep what rings true, and leave the rest.
      </footer>
    </main>
  );
}