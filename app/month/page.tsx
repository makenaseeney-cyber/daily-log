"use client";

import { useEffect, useMemo, useState } from "react";

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function MonthPage() {
  const key = `month:${monthKey()}`;
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(key);
    if (existing) setText(existing);
  }, [key]);

  const save = () => {
    localStorage.setItem(key, text.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const title = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }, []);

  return (
    <main className="min-h-screen p-8 font-sans max-w-2xl">
      <h1 className="text-2xl font-bold">{title} Reflection</h1>
      <p className="mt-2 text-neutral-600">
        How did this month feel? What stands out?
      </p>

      <textarea
        className="mt-6 w-full min-h-[220px] rounded-xl border p-3"
        placeholder="Looking back, this month was…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-xl bg-black text-white px-4 py-2"
        >
          Save
        </button>
        {saved && <span className="text-sm text-neutral-600">Saved ✓</span>}
      </div>
    </main>
  );
}
