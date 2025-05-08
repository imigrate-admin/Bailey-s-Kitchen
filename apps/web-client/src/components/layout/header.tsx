'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  href: string;
};

const mainNavItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Products',
    href: '/products',
  },
  {
    label: 'Dog Food',
    href: '/products/dogs',
  },
  {
    label: 'Cat Food',
    href: '/products/cats',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom py-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block w-8 h-8 bg-primary rounded-full"></span>
              <span className="hidden sm:inline-block text-xl font-bold font-display">
                Bailey&apos;s Kitchen
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User and Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -mt-5 ml-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                3
              </span>
            </Link>

            {/* User Menu */}
            <Link
              href="/login"
              className="hidden sm:flex items-center justify-center text-sm font-medium transition-colors hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <svg
                className={cn('h-6 w-6', isMobileMenuOpen ? 'hidden' : 'block')}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={cn('h-6 w-6', isMobileMenuOpen ? 'block' : 'hidden')}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium',
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  );
}

