"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'text-neo-accent underline decoration-3 underline-offset-4' : 'hover:text-neo-accent transition-colors';
  };

  return (
    <nav className="sticky top-0 z-50 bg-neo-white border-b-3 border-neo-black">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-heading text-2xl font-black shrink-0">
          Algorithm with Mami <span className="text-xl">🧠</span>
        </Link>

        {/* Masaüstü Linkler */}
        <div className="hidden md:flex items-center gap-6 font-heading font-bold ml-6">
          <Link href="/" className={isActive('/')}>
            Ana Sayfa
          </Link>
          <Link href="/problems" className={isActive('/problems')}>
            Tüm Sorular
          </Link>
          <Link href="/platform/leetcode" className={isActive('/platform/leetcode')}>
            LeetCode
          </Link>
          <Link href="/platform/hackerrank" className={isActive('/platform/hackerrank')}>
            HackerRank
          </Link>
          <Link href="/platform/codewars" className={isActive('/platform/codewars')}>
            CodeWars
          </Link>
        </div>

        {/* Hamburger Menü Butonu (Mobil) */}
        <button 
          className="md:hidden neo-btn !px-3 !py-2 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Mobil Menü */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-neo-white border-b-3 border-neo-black shadow-neo`}>
        <div className="flex flex-col font-heading font-bold text-center">
          <Link 
            href="/" 
            className={`block px-4 py-4 border-b border-gray-200 hover:bg-neo-yellow transition-colors ${pathname === '/' ? 'bg-neo-yellow/30' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Ana Sayfa
          </Link>
          <Link 
            href="/problems" 
            className={`block px-4 py-4 border-b border-gray-200 hover:bg-neo-blue transition-colors ${pathname === '/problems' ? 'bg-neo-blue/30' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Tüm Sorular
          </Link>
          <Link 
            href="/platform/leetcode" 
            className={`block px-4 py-4 border-b border-gray-200 hover:bg-neo-orange transition-colors ${pathname === '/platform/leetcode' ? 'bg-neo-orange/30' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            LeetCode
          </Link>
          <Link 
            href="/platform/hackerrank" 
            className={`block px-4 py-4 border-b border-gray-200 hover:bg-neo-green transition-colors ${pathname === '/platform/hackerrank' ? 'bg-neo-green/30' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            HackerRank
          </Link>
          <Link 
            href="/platform/codewars" 
            className={`block px-4 py-4 border-b border-gray-200 hover:bg-neo-purple transition-colors ${pathname === '/platform/codewars' ? 'bg-neo-purple/30' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            CodeWars
          </Link>
        </div>
      </div>
    </nav>
  );
}
