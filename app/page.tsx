import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold">Daily Log</h1>
      <p className="mt-2 text-neutral-600">
        One word, a free write, or a quick rating — once a day.
      </p>

      <div className="mt-6 flex gap-4">
        <Link className="rounded-xl border px-4 py-2" href="/today">
          Log today
        </Link>
        <Link className="rounded-xl border px-4 py-2" href="/settings">
          Settings
        </Link>
      </div>
    </main>
  );
}
<Link className="rounded-xl border px-4 py-2" href="/month">
  Monthly reflection
</Link>
