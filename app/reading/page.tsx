"use client";

export default function ReadingPage() {
  return (
    <main className="min-h-screen bg-[#100c18] text-[#f8f1e7]">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm text-purple-200/50">
          okay, let's see what's going on...
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl">
          What are we dealing with?
        </h1>

        <p className="mt-5 text-white/40">
          Pick whatever feels right. There are no wrong answers.
        </p>

        <div className="mt-10 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            "💗 Love",
            "💼 Career",
            "🫂 Friendship",
            "🌱 Life",
            "👀 Something specific",
            "🤷 Just pull for me",
          ].map((option) => (
            <button
              key={option}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm transition hover:border-purple-300/30 hover:bg-white/[0.06]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}