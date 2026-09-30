'use client';

import { useEffect, useState } from 'react';
import { navigation } from '@/content/navigation';
import { site } from '@/content/site';
import { Logo } from './Logo';
import { MagneticButton } from '@/components/ui/MagneticButton';
import styles from './SiteHeader.module.css';

/**
 * Sticky site header.
 *
 * Two states driven by a passive scroll listener:
 *  - `top`    — transparent, taller, brand mark fades in.
 *  - `compact — scrolled: shrinks, gains a blurred backdrop + hairline, reads as a rail.
 *
 * The header also tracks which section is in view to set `aria-current` on the
 * matching link, so keyboard and screen-reader users get the same orientation
 * that the visual underline gives sighted users.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Active-section observer. Chosen section = the last one whose top has
  // passed the header line, which matches how a reader perceives position.
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Close on Escape — required for the overlay to be dismissable by keyboard.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header} data-compact={scrolled || menuOpen || undefined}>
      <div className={`shell ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label={`${site.name} — home`} data-cursor="hover">
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={styles.navLink}
                  data-active={activeId === item.id || undefined}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  data-cursor="hover"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <MagneticButton href="#contact" variant="secondary" className={styles.headerCta}>
            Start a Project
          </MagneticButton>

          <button
            type="button"
            className={styles.burger}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            data-open={menuOpen || undefined}
            data-cursor="hover"
          >
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className={styles.burgerBars} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* No `hidden` attribute: `visibility: hidden` in CSS keeps the sheet
          animatable while still removing it from the accessibility tree. */}
      <div id="mobile-menu" className={styles.sheet} data-open={menuOpen || undefined}>
        <nav aria-label="Mobile">
          <ul className={styles.sheetList}>
            {navigation.map((item, index) => (
              <li key={item.id} style={{ '--i': index } as React.CSSProperties}>
                <a
                  href={item.href}
                  className={styles.sheetLink}
                  onClick={() => setMenuOpen(false)}
                  data-cursor="hover"
                >
                  <span className={styles.sheetIndex}>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sheetFooter}>
          <a href={`mailto:${site.email}`} className={styles.sheetMail} data-cursor="hover">
            {site.email}
          </a>
          <p className={styles.sheetMeta}>{site.location}</p>
        </div>
      </div>
    </header>
  );
}
