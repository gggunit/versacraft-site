const services = [
  {
    title: 'Computer Help (Remote)',
    description: 'Friendly diagnostics, speed-ups, backups, wifi optimization.',
  },
  {
    title: 'AI Automations / Smart Home',
    description: 'Inbox rules, shortcuts, content ops, HomeKit/Nest.',
  },
  {
    title: 'Outdoors & Plant Care',
    description: 'Plant doctor; repotting, pruning, irrigation timers, orchid rescue.',
  },
  {
    title: 'Reiki (Distance)',
    description: 'Level 2 Reiki: calming, supportive sessions; non-medical; 30/60 min.',
  },
  {
    title: 'Mounting & Repairs',
    description: 'TVs/art/shelves; stud-safe installs, tidy patch/paint.',
  },
  {
    title: 'Heavy Lifting',
    description: 'Careful moves; stairs/elevators ok; no truck by default.',
  },
  {
    title: 'Light Carpentry',
    description: 'Trim, shelves, small builds; precise finishes.',
  },
  {
    title: 'Organization',
    description: 'Closets/garages; systems you’ll keep.',
  },
];

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Services</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.title}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}