"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/site/services" },
  { name: "Pricing", href: "/site/pricing" },
  { name: "Reviews", href: "/site/reviews" },
  { name: "Book Now", href: "/site/availability", primary: true },
  { name: "Contact", href: "/site/contact" },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold hover:text-gray-300 transition-colors">
              VersaCraft
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isPrimary = 'primary' in item && item.primary;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isPrimary
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800">
          <nav className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isPrimary = 'primary' in item && item.primary;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isPrimary
                      ? 'bg-white text-gray-900'
                      : isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
