export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; {year} VersaCraft Solutions</p>
        <p className="text-sm italic">Least resistance, highest alignment.</p>
      </div>
    </footer>
  );
}