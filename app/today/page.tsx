"use client";

import { useMemo, useState } from "react";

type Mode = "one_word" | "free_write" | "scale";
const SCALE_LABELS = ["Terrible", "Bad", "Okay", "Good", "Amazing"] as const;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function TodayPage() {
  const [mode, setMode] = useState<Mode>("one_word");
  const [oneWord, setOneWord] = useState("");
  const [freeText, setFreeText] = useState("");
  const [scale, setScale] = useState<number>(3);
  const [status, setStatus] = useState("");

  const todayPretty = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const save = () => {
    setStatus("");
    const key = `entry:${todayKey()}`;

    if (mode === "one_word") {
      const v = oneWord.trim();
      if (!v) return setStatus("Enter a word.");
      if (/\s/.test(v)) return setStatus("One word only (no spaces).");
      if (v.length > 30) return setStatus("Keep it under 30 characters.");
      localStorage.setItem(key, JSON.stringify({ mode, oneWord: v }));
      return setStatus("Saved ✅");
    }

    if (mode === "free_write") {
      const v = freeText.trim();
      if (!v) return setStatus("Write something (even one sentence).");
      localStorage.setItem(key, JSON.stringify({ mode, freeText: v }));
      return setStatus("Saved ✅");
    }

    localStorage.setItem(key, JSON.stringify({ mode, scale }));
    return setStatus("Saved ✅");
  };

  return (
    <main className="min-h-screen p-8 font-sans max-w-2xl">
      <h1 className="text-2xl font-bold">Today</h1>
      <p className="mt-1 text-neutral-600">{todayPretty}</p>

      <div className="mt-6 flex gap-2">
        <button onClick={() => setMode("one_word")} className={tabClass(mode === "one_word")}>
          One word
        </button>
        <button onClick={() => setMode("free_write")} className={tabClass(mode === "free_write")}>
          Free write
        </button>
        <button onClick={() => setMode("scale")} className={tabClass(mode === "scale")}>
          Scale
        </button>
      </div>

      <div className="mt-6">
        {mode === "one_word" && (
          <div>
            <label className="block font-semibold mb-2">Your one word</label>
            <input
  value={oneWord}
  onChange={(e) => {
    // Keep only the first "word" (split on any whitespace)
    const first = e.target.value.trimStart().split(/\s+/)[0] ?? "";
    setOneWord(first);
  }}
  onKeyDown={(e) => {
    // Prevent typing spaces/newlines
    if (e.key === " " || e.key === "Enter" || e.key === "Tab") e.preventDefault();
  }}
  placeholder="wired"
  autoComplete="off"
  spellCheck={false}
  className="w-full rounded-xl border p-3 text-base"
/>
<p className="mt-2 text-sm text-neutral-500">
  One word only — spaces are blocked.
</p>
          </div>
        )}

        {mode === "free_write" && (
          <div>
            <label className="block font-semibold mb-2">Free write</label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Dump your brain here…"
              className="w-full rounded-xl border p-3 text-base min-h-[180px]"
            />
          </div>
        )}

        {mode === "scale" && (
          <div>
            <label className="block font-semibold mb-3">How was today?</label>
            <input
              type="range"
              min={1}
              max={5}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-neutral-500">
              {SCALE_LABELS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <p className="mt-4">
              Selected: <span className="font-semibold">{SCALE_LABELS[scale - 1]}</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="rounded-xl bg-black text-white px-4 py-2">
          Save
        </button>
        {status && <p className="text-sm text-neutral-700">{status}</p>}
      </div>

      <p className="mt-10 text-xs text-neutral-500">
        MVP: saves to this browser only. Next we’ll add accounts + syncing + reminders.
      </p>
    </main>
  );
}

function tabClass(active: boolean) {
  return [
    "rounded-xl border px-3 py-2 text-sm",
    active ? "bg-black text-white border-black" : "bg-white",
  ].join(" ");
}
