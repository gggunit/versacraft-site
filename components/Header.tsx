import type { Route } from 'next';
"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-semibold"><Link href="/">German G</Link></h1>
        <nav className="space-x-4 text-sm">
          
        <Link href={'/' as Route} className="hover:underline">Home</Link>
        <Link href={'/services' as Route} className="hover:underline">Services</Link>
        <Link href={'/pricing' as Route} className="hover:underline">Pricing</Link>
        <Link href={'/reviews' as Route} className="hover:underline">Reviews</Link>
        <Link href={'/availability' as Route} className="hover:underline">Availability</Link>
        <Link href={'/payments' as Route} className="hover:underline">Payments</Link>
        <Link href={'/contact' as Route} className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
