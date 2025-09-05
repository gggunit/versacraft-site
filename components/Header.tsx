"use client";
import Link from "next/link";
import type { Route } from "next";

const links = [
  ["Home","/"],["Services","/services"],["Pricing","/pricing"],
  ["Reviews","/reviews"],["Availability","/availability"],
  ["Payments","/payments"],["Contact","/contact"],
] as const satisfies ReadonlyArray<readonly [string, Route]>;

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-semibold"><Link href="/">German G</Link></h1>
        <nav className="space-x-4 text-sm">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:underline">{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
