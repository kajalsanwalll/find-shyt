"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  { id: "love", emoji: "💗", label: "Love", sub: "relationships, crushes, situationships" },
  { id: "career", emoji: "💼", label: "Career", sub: "work, studies, what's next" },
  { id: "friendship", emoji: "🫂", label: "Friendship", sub: "friends, people, connections" },
  { id: "life", emoji: "🌱", label: "Life", sub: "growth, choices, your current era" },
  { id: "specific", emoji: "👀", label: "Something specific", sub: "you know exactly what we're asking" },
  { id: "random", emoji: "🤷", label: "Just pull for me", sub: "no question, just vibes" },
];

export default function ReadingPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedCategory = categories.find(
    (category) => category.id === selected
  );

  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="mb-4 text-sm text-purple-200/50">
            okay, let's see what's going on...
          </p>

          <h1 className="font-serif text-5xl leading-tight sm:text-6xl">
            What are we dealing with?
          </h1>

          <p className="mx-auto mt-5 max-w-md text-white/40">
            Pick whatever feels right. There are no wrong answers.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {categories.map((category) => {
            const isSelected = selected === category.id;

            return (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => setSelected(category.id)}
                whileTap={{ scale: 0.97 }}
                className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-purple-300/50 bg-purple-300/[0.10]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition ${
                      isSelected
                        ? "bg-purple-200/15"
                        : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                    }`}
                  >
                    {category.emoji}
                  </div>

                  <div>
                    <p className="font-medium">{category.label}</p>

                    <p className="mt-1 text-xs text-white/35">
                      {category.sub}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  <div
                    className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-purple-200 bg-purple-200 text-[#100c18]"
                        : "border-white/15"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-xs font-bold">✓</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Question appears after selection */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={
            selected
              ? { opacity: 1, height: "auto" }
              : { opacity: 0, height: 0 }
          }
          className="w-full max-w-2xl overflow-hidden"
        >
          {selected && (
            <div className="pt-8">
              {selected === "random" ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
                  <p className="font-serif text-xl">
                    no question? no problem. ✨
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    We'll let the cards decide what you need to hear.
                  </p>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="question"
                    className="mb-3 block text-sm text-white/60"
                  >
                    What's on your mind?
                  </label>

                  <textarea
                    id="question"
                    rows={3}
                    placeholder={
                      selectedCategory
                        ? `e.g. "what should I know about my ${selectedCategory.label.toLowerCase()} situation?"`
                        : ""
                    }
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-300/40"
                  />
                </div>
              )}

              {/* Continue */}
              <div className="mt-6 flex justify-center">
                <motion.button
  type="button"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  onClick={() => {
    const question =
      (
        document.getElementById("question") as HTMLTextAreaElement | null
      )?.value || "";

    sessionStorage.setItem(
      "reading",
      JSON.stringify({
        category: selected,
        question,
      })
    );

    router.push("/reading/deck");
  }}
  className="rounded-full bg-[#f8f1e7] px-8 py-4 text-sm font-medium text-[#17111f] transition hover:bg-white"
>
  let's pull some cards ✨
</motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tiny footer */}
        <p className="mt-12 text-center text-xs text-white/20">
          take what resonates, leave what doesn't. ♡
        </p>
      </div>
    </main>
  );
}