// components/shell.tsx
import { Fraunces, DM_Sans } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

const stars = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 53.3 + (i % 5) * 7) % 100,
  size: i % 7 === 0 ? 3 : 2,
  opacity: 0.16 + (i % 4) * 0.1,
}));

/** Page wrapper: fonts, night background, one glow, static stars. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-x-clip bg-[#120d1c] font-[family-name:var(--font-body)] text-[#f4ead9]`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#b9a6e8]/10 blur-[110px]" />
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
      <div className="relative">{children}</div>
    </main>
  );
}

/** Face-down card. Fills its (positioned) parent; hides itself when flipped. */
export function CardBack() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-[#b9a6e8]/40 bg-gradient-to-b from-[#2b2042] to-[#1a1329] shadow-lg shadow-black/40 [backface-visibility:hidden]">
      <div className="absolute inset-1.5 rounded-lg border border-[#b9a6e8]/20" />
      <svg
        viewBox="0 0 60 60"
        className="w-1/2 text-[#b9a6e8]/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        <circle cx="30" cy="30" r="26" />
        <circle cx="30" cy="30" r="17" />
        <circle cx="30" cy="30" r="8" />
        <path d="M30 4v52M4 30h52" />
      </svg>
    </div>
  );
}