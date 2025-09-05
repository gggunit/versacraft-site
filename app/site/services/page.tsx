import Link from "next/link";

const primary = [
  ["Computer Help (Remote)", "Friendly diagnostics, speed-ups, backups, wifi optimization.", "/services#computer"],
  ["AI Automations / Smart Home", "Inbox rules, shortcuts, content ops, HomeKit/Nest.", "/services#ai"],
  ["Outdoors & Plant Care", "Plant doctor; repotting, pruning, irrigation timers, orchid rescue.", "/services#plants"],
  ["Reiki (Distance)", "Level 2 Reiki: calming, supportive sessions; non-medical; 30/60 min.", "/services#reiki"],
];

const secondary = [
  ["Mounting & Repairs", "TVs/art/shelves; stud-safe installs, tidy patch/paint.", "/services#mounting"],
  ["Heavy Lifting", "Careful moves; stairs/elevators ok; no truck by default.", "/services#lifting"],
  ["Light Carpentry", "Trim, shelves, small builds; precise finishes.", "/services#carpentry"],
  ["Organization", "Closets/garages; systems you’ll keep.", "/services#org"],
];

export default function ServicesPage() {
  const Card = ({ title, blurb, href }) => (
    <Link href={href} className="rounded-2xl border p-4 hover:shadow-sm block">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{blurb}</p>
    </Link>
  );
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Services</h1>
        <p className="text-gray-600">SF Bay Area · Remote available for tech + Reiki</p>
      </header>

      <section>
        <h2 className="text-xl font-medium mb-3">Featured</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {primary.map(([t, b, h]) => <Card key={t} title={t} blurb={b} href={h} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Also available</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondary.map(([t, b, h]) => <Card key={t} title={t} blurb={b} href={h} />)}
        </div>
      </section>
    </main>
  );
}
