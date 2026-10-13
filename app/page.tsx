"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Fraunces, DM_Sans } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

/* ---------- data ---------- */

type Kind = "moon" | "star" | "sun" | "eye" | "lovers";

const cards: { name: string; note: string; kind: Kind }[] = [
  { name: "The Moon", note: "what's still hidden", kind: "moon" },
  { name: "The Star", note: "hope, quietly returning", kind: "star" },
  { name: "The Sun", note: "things going right", kind: "sun" },
  { name: "The Hermit", note: "time to look inward", kind: "eye" },
  { name: "The Lovers", note: "a choice of the heart", kind: "lovers" },
];

// Deterministic star field (no Math.random, so no hydration mismatch)
const stars = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 53.3 + (i % 5) * 7) % 100,
  size: i % 7 === 0 ? 3 : 2,
  opacity: 0.2 + (i % 4) * 0.12,
}));

/* ---------- small pieces ---------- */

function Glyph({ kind }: { kind: Kind }) {
  const p = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-14 w-14 sm:h-20 sm:w-20",
  };
  switch (kind) {
    case "moon":
      return (
        <svg {...p}>
          <path d="M30 8a16 16 0 1 0 10 28A13 13 0 0 1 30 8z" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <path d="M24 4l4 14 14 6-14 6-4 14-4-14-14-6 14-6z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p}>
          <circle cx="24" cy="24" r="8" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1="24"
              y1="6"
              x2="24"
              y2="12"
              transform={`rotate(${a} 24 24)`}
            />
          ))}
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M4 24c6-10 14-14 20-14s14 4 20 14c-6 10-14 14-20 14S10 34 4 24z" />
          <circle cx="24" cy="24" r="6" />
        </svg>
      );
    case "lovers":
      return (
        <svg {...p}>
          <circle cx="18" cy="24" r="11" />
          <circle cx="30" cy="24" r="11" />
        </svg>
      );
  }
}

function CardBack() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-[#b9a6e8]/40 bg-gradient-to-b from-[#2b2042] to-[#1a1329] [backface-visibility:hidden]">
      <div className="absolute inset-2 rounded-xl border border-[#b9a6e8]/20" />
      <svg viewBox="0 0 60 60" className="h-16 w-16 text-[#b9a6e8]/70 sm:h-20 sm:w-20" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="30" cy="30" r="26" />
        <circle cx="30" cy="30" r="17" />
        <circle cx="30" cy="30" r="8" />
        <path d="M30 4v52M4 30h52" />
      </svg>
    </div>
  );
}

function CardFace({ name, note, kind }: (typeof cards)[number]) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-[#d9c9a8] bg-[#f4ead9] px-3 py-5 text-[#2b2042] [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <div className="absolute inset-1.5 rounded-xl border border-[#2b2042]/15" />
      <div className="flex flex-1 items-center">
        <Glyph kind={kind} />
      </div>
      <div className="relative text-center">
        <p className="font-[family-name:var(--font-display)] text-base italic leading-tight sm:text-xl">
          {name}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-[#2b2042]/60 sm:text-xs">
          {note}
        </p>
      </div>
    </div>
  );
}

/* ---------- the fan (the one memorable thing) ---------- */

function Fan() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="relative mx-auto flex h-[320px] w-full max-w-md items-end justify-center sm:h-[400px]"
      style={{ perspective: 900 }}
      onMouseLeave={() => setActive(null)}
    >
      {/* moonlit glow behind the cards */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#b9a6e8]/15 blur-[90px]" />

      {cards.map((card, i) => {
        const offset = i - 2;
        const isActive = active === i;
        return (
          <motion.div
            key={card.name}
            tabIndex={0}
            role="img"
            aria-label={`${card.name}: ${card.note}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="absolute bottom-4 h-[190px] w-[116px] cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4] sm:h-[250px] sm:w-[150px]"
            style={{
              transformOrigin: "50% 210%",
              transformStyle: "preserve-3d",
              zIndex: isActive ? 10 : i,
            }}
            initial={reduce ? false : { rotate: 0, y: 60, opacity: 0 }}
            animate={{
              rotate: offset * 10,
              y: isActive ? -26 : 0,
              opacity: 1,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 160, damping: 18, delay: 0.15 + i * 0.09 }
            }
          >
            <motion.div
              className="relative h-full w-full shadow-2xl shadow-black/50"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isActive ? 180 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
            >
              <CardBack />
              <CardFace {...card} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} relative flex min-h-screen flex-col overflow-hidden bg-[#120d1c] font-[family-name:var(--font-body)] text-[#f4ead9]`}
    >
      {/* star field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#f4ead9]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="text-left">
          <h1 className="font-[family-name:var(--font-display)] text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            tarot,
            <br />
            but make it free.
          </h1>

          <p className="mt-8 max-w-sm text-lg leading-7 text-[#f4ead9]/65">
            You don&apos;t need a deck. You just need a question. ♡
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/reading"
              className="rounded-full bg-[#f4ead9] px-8 py-4 text-sm font-medium text-[#1a1329] shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a0b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d1c] active:translate-y-0"
            >
              Pull some cards
            </Link>
            <p className="text-sm text-[#f4ead9]/45">
              Hover a card to peek at the deck.
            </p>
          </div>
        </div>

        <Fan />
      </section>

      <footer className="relative px-6 pb-8 text-center text-xs leading-5 text-[#f4ead9]/40 lg:text-left lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
        For reflection, fun and a little delusion. Take what resonates, leave
        what doesn&apos;t.
      </footer>
    </main>
  );
}