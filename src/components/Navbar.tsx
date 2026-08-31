'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCultureOpen, setIsCultureOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.culture-dropdown-container')) {
        setIsCultureOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsCultureOpen(false);
  };

  const cultureLinks = [
    { name: 'Bahasa Daerah', href: '/bahasa' },
    { name: 'Seni & Budaya', href: '/seni-budaya' },
    { name: 'Tradisi Adat', href: '/tradisi' },
    { name: 'Cerita Rakyat', href: '/cerita-rakyat' },
    { name: 'Jelajah Daerah', href: '/jelajah' },
    { name: 'Kata Hari Ini', href: '/kata-hari-ini' },
  ];

  const mainLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Itah', href: '/tentang' },
    { name: 'Kuis Budaya', href: '/kuis' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Kontribusi', href: '/kontribusi' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const isActive = (href: string) => pathname === href;
  const isCultureActive = () => cultureLinks.some(link => pathname === link.href);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#FAF6EE]/95 backdrop-blur-md shadow-xs border-b border-card-border/30 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Brand Name - Single Brand Logo as requested */}
          {/* Logo / Brand Name - 4 Logos grouped on the left, Tentang Itah on the right of the sponsors */}
          <div className="flex items-center">
            {/* The 3 sponsor logos - visible on mobile with small height */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 mr-2.5 pr-2.5 border-r border-foreground/15 py-0.5 shrink-0">
              <img 
                src="/images/logo_kemendikbud.png" 
                alt="Kementerian Kebudayaan" 
                className="h-5 sm:h-7 w-auto object-contain mix-blend-multiply" 
              />
              <img 
                src="/images/logo_dana_indonesiana.png" 
                alt="Dana Indonesiana" 
                className="h-8 sm:h-11 w-auto object-contain mix-blend-multiply" 
              />
              <img 
                src="/images/logo_lpdp.png" 
                alt="LPDP" 
                className="h-5 sm:h-7 w-auto object-contain mix-blend-multiply" 
              />
            </div>

            {/* Tentang Itah brand logo on the right of sponsors */}
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2 group">
              <img 
                src="/images/logo_tentang_itah.png" 
                alt="Tentang Itah Logo" 
                className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply" 
              />
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#221A15] group-hover:text-primary transition-colors leading-none">
                Tentang Itah
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/" 
              onClick={handleLinkClick}
              className={`pb-1 text-sm font-medium transition-all border-b-2 ${
                isActive('/') 
                  ? 'text-primary border-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              Beranda
            </Link>
            
            <Link 
              href="/tentang" 
              onClick={handleLinkClick}
              className={`pb-1 text-sm font-medium transition-all border-b-2 ${
                isActive('/tentang') 
                  ? 'text-primary border-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary border-transparent hover:border-primary/30'
              }`}
            >
              Tentang Itah
            </Link>

            {/* Dropdown Culture */}
            <div className="relative culture-dropdown-container">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsCultureOpen(!isCultureOpen);
                }}
                className={`pb-1 text-sm font-medium transition-all flex items-center gap-1 border-b-2 ${
                  isCultureActive()
                    ? 'text-primary border-primary font-semibold'
                    : 'text-foreground/80 hover:text-primary border-transparent hover:border-primary/30'
                }`}
              >
                Kebudayaan
                <svg className={`w-4 h-4 transition-transform duration-200 ${isCultureOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Panel */}
              <div 
                className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-card-bg border border-card-border/80 py-1 z-50 transition-all duration-200 ${
                  isCultureOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                {cultureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`block px-4 py-2 text-sm transition-all ${
                      isActive(link.href)
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {mainLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`pb-1 text-sm font-medium transition-all border-b-2 ${
                  isActive(link.href)
                    ? 'text-primary border-primary font-semibold'
                    : 'text-foreground/80 hover:text-primary border-transparent hover:border-primary/30'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/5 focus:outline-none transition-all relative z-50 cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-[100vh] opacity-100 pointer-events-auto border-b border-card-border/50 bg-[#FAF6EE] shadow-lg' 
            : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/tentang"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/tentang') ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-primary/5 hover:text-primary'
            }`}
          >
            Tentang Itah
          </Link>

          {/* Collapsible Culture Links in Mobile */}
          <div className="border-t border-card-border/40 my-1 pt-1">
            <div className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
              Kebudayaan
            </div>
            {cultureLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`block px-5 py-2 rounded-md text-base font-medium ${
                  isActive(link.href) ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-card-border/40 my-1 pt-1">
            {mainLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href) ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
