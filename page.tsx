export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Get it done, the right way.</h1>
      <p className="mb-6 max-w-lg">
        From tech support and AI automations to home fixes, yard care, and Reiki distance sessions —
        book help when you need it.
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl">
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">Computer Help (Remote)</h2>
          <p>Friendly diagnostics, speed-ups, backups, wifi optimization.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">AI Automations / Smart Home</h2>
          <p>Inbox rules, shortcuts, content ops, HomeKit/Nest.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">Outdoors & Plant Care</h2>
          <p>Plant doctor; repotting, pruning, irrigation timers, orchid rescue.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">Reiki (Distance)</h2>
          <p>Level 2 Reiki: calming, supportive sessions; non-medical; 30/60 min.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">Mounting & Repairs</h2>
          <p>TVs/art/shelves; stud-safe installs, tidy patch/paint.</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="font-semibold mb-2">Heavy Lifting</h2>
          <p>Careful moves; stairs/elevators ok; no truck by default.</p>
        </div>
      </div>
    </main>
  )
}
