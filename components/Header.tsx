"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-semibold"><Link href="/">German G</Link></h1>
        <nav className="space-x-4 text-sm">
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/availability">Availability</Link>
          <Link href="/payments">Payments</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
