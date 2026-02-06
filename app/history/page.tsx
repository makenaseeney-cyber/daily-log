"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Entry =
  | { mode: "one_word"; oneWord: string }
  | { mode: "free_write"; freeText: string }
  | { mode: "scale"; scale: number };

type Row = { date: string; entry: Entry };

const SCALE_LABELS = ["Terrible", "Bad", "Okay", "Good", "Amazing"] as const;

function isEntry(x: any): x is Entry {
  return x && typeof x === "object" && typeof x.mode === "string";
}

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const items: Row[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("entry:")) continue;

      const date = k.slice("entry:".length); // YYYY-MM-DD
      try {
        const parsed = JSON.parse(localStorage.getItem(k) || "null");
        if (isEntry(parsed)) items.push({ date, entry: parsed });
      } catch {
        // ignore bad items
      }
    }

    items.sort((a, b) => b.date.localeCompare(a.date));
    setRows(items);
  }, []);

  const empty = rows.length === 0;

  return (
    <main className="min-h-screen p-8 font-sans max-w-2xl">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <Link className="text-sm underline" href="/today">
          Log today
        </Link>
      </div>

      {empty ? (
        <div className="mt-8 rounded-2xl border p-4 text-neutral-700">
          <p className="font-semibold">No entries yet.</p>
          <p className="mt-2 text-sm text-neutral-600">
            Go to <Link className="underline" href="/today">/today</Link> and save your first entry.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.date} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{prettyDate(r.date)}</div>
                <span className="text-xs rounded-full border px-2 py-1 text-neutral-600">
                  {labelFor(r.entry)}
                </span>
              </div>

              <div className="mt-2 text-neutral-800">{previewFor(r.entry)}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function prettyDate(iso: string) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function labelFor(e: Entry) {
  if (e.mode === "one_word") return "one word";
  if (e.mode === "free_write") return "free write";
  return "scale";
}

function previewFor(e: Entry) {
  if (e.mode === "one_word") return <span className="italic">“{e.oneWord}”</span>;
  if (e.mode === "scale") return <span>{SCALE_LABELS[e.scale - 1] ?? `#${e.scale}`}</span>;

  const text = e.freeText.trim();
  const trimmed = text.length > 140 ? text.slice(0, 140) + "…" : text;
  return <span>{trimmed || <span className="text-neutral-500">(empty)</span>}</span>;
}
