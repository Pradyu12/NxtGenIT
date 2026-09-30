import { site } from '@/content/site';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-title">
      {/* One deep radial wash, no image, no gradient soup. */}
      <span className={styles.glow} aria-hidden="true" />

      <div className={`shell ${styles.inner}`}>
        <Reveal mode="fade" className={styles.eyebrowRow}>
          <p className="eyebrow">
            <em>06</em>
            <span>Contact</span>
          </p>
        </Reveal>

        <Reveal as="h2" id="contact-title" mode="up" className={styles.title}>
          <span className={styles.line}>Have an idea?</span>
          <span className={styles.line}>
            Let&rsquo;s build it<span className={styles.period}>.</span>
          </span>
        </Reveal>

        <Reveal mode="up" delay={120} className={styles.body}>
          <p className={`measure ${styles.lede}`}>
            Tell us what you&rsquo;re working on. We&rsquo;ll come back with how we&rsquo;d approach it —
            architecture, scope and what it would take to ship.
          </p>

          <div className={styles.actions}>
            <MagneticButton
              href={`mailto:${site.email}?subject=${encodeURIComponent('New project — NxtGenIT')}`}
              variant="primary"
              strength={12}
              trailing={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2 12L12 2M12 2H5.5M12 2v6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              }
            >
              Start a Conversation
            </MagneticButton>

            <a href={`mailto:${site.email}`} className={styles.email} data-cursor="hover">
              <span className={`mono ${styles.emailLabel}`}>Direct email</span>
              <span className={styles.emailValue}>{site.email}</span>
            </a>
          </div>
        </Reveal>

        <Reveal mode="fade" delay={200} className={styles.metaWrap}>
          <dl className={styles.meta}>
            <div className={styles.metaItem}>
              <dt className="mono">Studio</dt>
              <dd className="mono">{site.location}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt className="mono">Focus</dt>
              <dd className="mono">{site.footerServices.join(' · ')}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt className="mono">Status</dt>
              <dd className={`mono ${styles.metaLive}`}>
                <span className="pulse" aria-hidden="true" />
                Accepting projects
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
