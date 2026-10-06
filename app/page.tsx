"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#100c18] text-[#f8f1e7]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[100px]" />
      </div>

      {/* Stars */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <span className="absolute left-[12%] top-[18%] text-xs">✦</span>
        <span className="absolute left-[80%] top-[20%] text-sm">✧</span>
        <span className="absolute left-[20%] top-[70%] text-sm">✦</span>
        <span className="absolute left-[88%] top-[68%] text-xs">✧</span>
        <span className="absolute left-[70%] top-[80%] text-xs">✦</span>
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        {/* Tiny label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-sm tracking-[0.25em] text-purple-200/60 uppercase"
        >
          ✦ your tiny corner of the universe ✦
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl font-serif text-6xl leading-[0.95] tracking-tight sm:text-8xl"
        >
          tarot,
          <br />
          <span className="italic text-purple-200">but make it free.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-md text-base leading-7 text-white/55 sm:text-lg"
        >
          You don't need a deck.
          <br />
          You just need a question. ♡
        </motion.p>

        {/* CTA */}
        <motion.a
          href="/reading"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 rounded-full bg-[#f8f1e7] px-8 py-4 text-sm font-medium text-[#17111f] shadow-xl shadow-purple-950/30 transition hover:bg-white"
        >
          pull some cards ✨
        </motion.a>

        {/* Bottom disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-8 max-w-sm text-xs leading-5 text-white/25"
        >
          for reflection, fun & a little ✨delusion✨
          <br />
          take what resonates, leave what doesn't.
        </motion.p>
      </section>
    </main>
  );
}