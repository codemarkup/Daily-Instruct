"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tech', href: '/tech' },
    { name: 'Business', href: '/business' },
    // { name: 'Startups', href: '/startups' },
    { name: 'Markets', href: '/market' },
    // { name: 'Science', href: '/science' },
    { name: 'Guides', href: '/guides' },
    // { name: 'Reviews', href: '/reviews' }
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.navLogo}>
          <span className={styles.logoSerif}>Daily</span>
          <span className={styles.logoSans}>Instruct</span>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navCenter}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${styles.navLink} ${isActiveLink(link.href) ? styles.active : ''}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          <button className={styles.navIconBtn} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          
          {/* Mobile Menu Button */}
          <button 
            className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActiveLink(link.href) ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;