import { principles } from '@/content/philosophy';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/content/site';
import styles from './Philosophy.module.css';

const headingLines = [{ text: 'We think' }, { text: <>in systems<span className={styles.period}>.</span></> }];

export function Philosophy() {
  return (
    <section className="section" id="about" aria-labelledby="philosophy-title">
      <div className="shell">
        <div className={styles.head}>
          <Reveal mode="fade" className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>03</em>
              <span>Engineering philosophy</span>
            </p>
          </Reveal>

          <SplitHeading as="h2" id="philosophy-title" className={styles.title} lines={headingLines} />

          <Reveal mode="up" delay={140} className={styles.ledeWrap}>
            <p className={`measure ${styles.lede}`}>
              {site.name} is a studio, not a body shop. Three commitments shape how we scope,
              architect and maintain every product we put our name on.
            </p>
          </Reveal>
        </div>

        <ol className={styles.list}>
          {principles.map((principle, index) => (
            <li key={principle.index}>
              <Reveal mode="up" delay={index * 120} className={styles.block}>
                <span className={styles.index} aria-hidden="true">
                  {principle.index}
                </span>
                <h3 className={styles.blockTitle}>{principle.title}</h3>
                <p className={styles.blockBody}>{principle.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
