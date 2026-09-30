import { site } from '@/content/site';
import { navigation } from '@/content/navigation';
import { Logo } from './Logo';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brandBlock}>
          <Logo />
          <p className={styles.tagline}>{site.tagline}</p>
          <p className={styles.services}>{site.footerServices.join('  •  ')}</p>
        </div>

        <nav className={styles.navBlock} aria-label="Footer">
          <p className={`mono ${styles.navHeading}`}>Navigate</p>
          <ul className={styles.navList}>
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={styles.navLink} data-cursor="hover">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contactBlock}>
          <p className={`mono ${styles.navHeading}`}>Contact</p>
          <a href={`mailto:${site.email}`} className={styles.email} data-cursor="hover">
            {site.email}
          </a>
          <p className={styles.location}>{site.location}</p>
          <ul className={styles.social}>
            {site.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`shell ${styles.baseline}`}>
        <p className={styles.copyright}>
          © {year} {site.name}. All rights reserved.
        </p>
        <p className={styles.built}>
          <span>Shunya is in active development</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="#shunya" className={styles.baselineLink} data-cursor="hover">
            Follow the build
          </a>
        </p>
      </div>
    </footer>
  );
}
