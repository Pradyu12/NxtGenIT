import { stack } from '@/content/stack';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Stack.module.css';

export function Stack() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="shell">
        <div className={styles.head}>
          <Reveal mode="fade" className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>04</em>
              <span>Technology</span>
            </p>
          </Reveal>

          <SplitHeading as="h2" id="stack-title" className={styles.title} lines={[{ text: 'Our stack' }]} />

          <Reveal mode="up" delay={140} className={styles.ledeWrap}>
            <p className={`measure ${styles.lede}`}>
              The tools we actually build with. Chosen for longevity and boring reliability, not for
              novelty.
            </p>
          </Reveal>
        </div>

        <dl className={styles.grid}>
          {stack.map((discipline, index) => (
            <Reveal
              key={discipline.id}
              mode="up"
              delay={index * 90}
              className={styles.column}
            >
              <div className={styles.columnHead}>
                <dt className={styles.columnTitle}>{discipline.title}</dt>
                <span className={`mono ${styles.columnCount}`}>
                  {String(discipline.items.length).padStart(2, '0')}
                </span>
              </div>
              <ul className={styles.items}>
                {discipline.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
