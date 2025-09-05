import Link from "next/link";
import { ReviewList } from '../../components/ReviewList';
export default function HomePage() {
  return (


    <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold">Get it done, the right way.</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          From tech support and AI automations to home fixes, yard care, and <strong>Reiki distance sessions</strong> — book help when you need it.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link className="px-4 py-2 rounded-xl bg-black text-white" href="/availability">Book now</Link>
          <Link className="px-4 py-2 rounded-xl border" href="/services">Explore services</Link>
          <Link className="px-4 py-2 rounded-xl border" href="/pricing">Pricing</Link>
        </div>
        <p className="text-sm text-gray-500 italic">*Least resistance, highest alignment.* — Bashar</p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ["Computer Help (Remote)", "Friendly diagnostics, speed-ups, backups, wifi optimization.", "/services#computer"],
          ["AI Automations / Smart Home", "Inbox rules, shortcuts, content ops, HomeKit/Nest.", "/services#ai"],
          ["Outdoors & Plant Care", "Plant doctor; repotting, pruning, irrigation timers, orchid rescue.", "/services#plants"],
          ["Reiki (Distance)", "Level 2 Reiki: calming, supportive sessions; non-medical; 30/60 min.", "/services#reiki"],
          ["Mounting & Repairs", "TVs/art/shelves; stud-safe installs, tidy patch/paint.", "/services#mounting"],
          ["Heavy Lifting", "Careful moves; stairs/elevators ok; no truck by default.", "/services#lifting"],
        ].map(([title, blurb, href]) => (
          <Link key={title} href={href} className="rounded-2xl border p-4 hover:shadow-sm">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-gray-600 mt-1">{blurb}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★★★★★</span>
          <span className="text-sm text-gray-600">4.9★ · 628 reviews (summary)</span>
        </div>
        <ReviewList />
      </section>
    </main>
  );
}
