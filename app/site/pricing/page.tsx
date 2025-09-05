export const metadata = { title: 'Pricing \u2014 VersaCraft' };

const bands = [
  ['Computer / AI', '$99\u2013$115/hr'],
  ['Outdoors / Plant Care', '$95\u2013$105/hr'],
  ['Reiki (Distance)', '$65 (30m) / $120 (60m)'],
  ['Mounting', '$89\u2013$95/hr'],
  ['Repairs', '$125\u2013$135/hr'],
  ['Lifting', '$89\u2013$95/hr'],
  ['Assembly', '$79\u2013$85/hr'],
];

export default function PricingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <ul className="divide-y rounded-2xl border">
        {bands.map(([label, value]) => (
          <li key={label} className="flex items-center justify-between p-4">
            <span className="font-medium">{label}</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-600 mt-4">
        Electrical: non-permit scope only; referrals for licensed work. Reiki is complementary, not a medical treatment.
      </p>
    </main>
  );
}
