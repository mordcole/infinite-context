import styles from "./sync.module.css";

const TIMELINE_ITEMS = ["note", "commit", "transcript", "note", "commit", "transcript"];

function DotLine() {
  return (
    <div className={styles.dotLineWrapper}>
      <div className={styles.dotLineTrack}>
        {[...TIMELINE_ITEMS, ...TIMELINE_ITEMS].map((label, i) => (
          <div key={i} className={styles.timelineGroup}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineDot} />
            <div className={styles.timelineDot} />
            <div className={styles.timelineDot} />
            <div className={styles.timelineNode}>
              <div className={styles.timelineDotLarge} />
              <span className={styles.timelineLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sync() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <span className={styles.wordmark}>I / C</span>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLink}>Connect</a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLinkActive}>Sync</a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLink}>Ask</a>
            </div>
          </div>
          <button className={styles.avatarBtn}>👤</button>
        </div>
      </nav>

      <DotLine />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Page header */}
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Sync</h1>
            <div className={styles.titleRule} />
            <p className={styles.pageSubtitle}>Your notes and commits are processing into your vector index.</p>
          </div>

          {/* Sync complete banner */}
          <section className={styles.successBanner}>
            <div className={styles.successBlur} />
            <div className={styles.successInner}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successText}>
                <h3 className={styles.successTitle}>Sync Complete</h3>
                <p className={styles.successSubtitle}>Your notes and commits are indexed and ready to query.</p>
              </div>
              <div className={styles.successAction}>
                <button className={styles.goToAskBtn}>Go to Ask</button>
              </div>
            </div>
          </section>

          {/* Progress + Stats grid */}
          <div className={styles.bentoGrid}>
            {/* Progress card */}
            <div className={styles.progressCard}>
              {/* Notes */}
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabelGroup}>
                    <span className={styles.progressLabel}>Notes Processed</span>
                    <span className={`${styles.sourceBadge} ${styles.badgeRemnote}`}>REMNOTE</span>
                  </div>
                  <span className={styles.progressCount}>488/488</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`} />
                </div>
              </div>
              {/* Commits */}
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabelGroup}>
                    <span className={styles.progressLabel}>Commits Indexed</span>
                    <span className={`${styles.sourceBadge} ${styles.badgeGithub}`}>GITHUB</span>
                  </div>
                  <span className={styles.progressCount}>142/142</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`} />
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className={styles.statsCard}>
              <div className={styles.statsIcon}>⊞</div>
              <p className={styles.statsLabel}>Total Chunks Embedded</p>
              <div className={styles.statsNumber}>2,847</div>
              <p className={styles.statsSubtitle}>Optimized for vector search retrieval.</p>
            </div>
          </div>

          {/* Auto-update schedule */}
          <section className={styles.scheduleSection}>
            <h4 className={styles.scheduleTitle}>Auto-Update Schedule</h4>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHead}>
                    <th className={styles.th}>Source</th>
                    <th className={styles.th}>Refresh Frequency</th>
                    <th className={`${styles.th} ${styles.thRight}`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tableRow}>
                    <td className={styles.td}>
                      <div className={styles.sourceCell}>
                        <span className={styles.sourceCellIcon}>📄</span>
                        <div>
                          <p className={styles.sourceName}>RemNote</p>
                          <p className={styles.sourceDesc}>Knowledge Base Sync</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>every 30 min</td>
                    <td className={`${styles.td} ${styles.tdRight}`}>
                      <span className={styles.activeBadge}>Active</span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.td}>
                      <div className={styles.sourceCell}>
                        <span className={styles.sourceCellIcon}>⌨️</span>
                        <div>
                          <p className={styles.sourceName}>GitHub</p>
                          <p className={styles.sourceDesc}>Repository Indexer</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>daily 6 AM ET</td>
                    <td className={`${styles.td} ${styles.tdRight}`}>
                      <span className={styles.activeBadge}>Active</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Support card */}
          <div className={styles.supportCard}>
            <div className={styles.supportAvatars}>
              <div className={styles.supportAvatar}>👤</div>
              <div className={styles.supportAvatar}>👤</div>
            </div>
            <div className={styles.supportText}>
              <p className={styles.supportTitle}>Something not syncing correctly?</p>
              <p className={styles.supportSubtitle}>Our Infinite Context support team is here to help with complex data connections.</p>
            </div>
            <button className={styles.supportBtn}>Chat with Support</button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerBrand}>Infinite Context</p>
            <p className={styles.footerSub}>© 2024 Infinite Context. Built for developer learning.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Documentation</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
