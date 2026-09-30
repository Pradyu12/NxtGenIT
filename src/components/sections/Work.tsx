import { projects, type Project } from '@/content/projects';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SystemMap } from './SystemMap';
import styles from './Work.module.css';

/**
 * Work is rendered entirely from `src/content/projects.ts`.
 *
 * The first entry flagged `featured` becomes the primary panel; everything else
 * becomes a compact row. Adding a client project means adding one object to that
 * array — no component changes.
 */
const featured = projects.find((project) => project.featured) ?? projects[0];
const rest = projects.filter((project) => project !== featured);

export function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className={styles.head}>
          <Reveal mode="fade" className={styles.eyebrowRow}>
            <p className="eyebrow">
              <em>05</em>
              <span>Work</span>
            </p>
          </Reveal>

          <SplitHeading as="h2" id="work-title" className={styles.title} lines={[{ text: 'Selected work' }]} />

          <Reveal mode="up" delay={140} className={styles.ledeWrap}>
            <p className={`measure ${styles.lede}`}>
              Our own IP first. Client work follows as it ships — same engineering standard, same
              attention to detail.
            </p>
          </Reveal>
        </div>

        {featured ? <FeaturedProject project={featured} /> : null}

        {rest.length > 0 ? (
          <ul className={styles.list}>
            {rest.map((project, index) => (
              <Reveal as="li" key={project.id} mode="up" delay={index * 80}>
                <ProjectRow project={project} />
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <Reveal mode="up" className={styles.featured}>
      <article className={styles.featuredInner} aria-labelledby={`project-${project.id}`}>
        <div className={styles.featuredVisual}>
          <SystemMap
            seed={project.graphSeed}
            label={`Abstract system architecture diagram for ${project.title}`}
          />
          <span className={styles.visualTag}>
            <span className="pulse" aria-hidden="true" />
            {project.statusLabel}
          </span>
        </div>

        <div className={styles.featuredBody}>
          <div className={styles.featuredMeta}>
            <span className="mono">{project.client}</span>
            <span className="mono">{project.year}</span>
          </div>

          <h3 className={styles.featuredTitle} id={`project-${project.id}`}>
            {project.title}
          </h3>

          <p className={styles.featuredSummary}>{project.summary}</p>
          <p className={styles.featuredText}>{project.body}</p>

          <div className={styles.featuredFoot}>
            <div className={styles.metaGroup}>
              <p className={`mono ${styles.metaLabel}`}>Role</p>
              <ul className={styles.metaList}>
                {project.role.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.metaGroup}>
              <p className={`mono ${styles.metaLabel}`}>Stack</p>
              <ul className={styles.metaList}>
                {project.stack.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const Wrapper = project.href ? 'a' : 'div';
  return (
    <Wrapper
      {...(project.href ? { href: project.href, 'data-cursor': 'hover' as const } : {})}
      className={styles.row}
    >
      <div className={styles.rowMain}>
        <h3 className={styles.rowTitle}>{project.title}</h3>
        <p className={styles.rowSummary}>{project.summary}</p>
      </div>

      <div className={styles.rowMeta}>
        <span className="mono">{project.statusLabel}</span>
        <span className={`mono ${styles.rowYear}`}>{project.year}</span>
      </div>
    </Wrapper>
  );
}
