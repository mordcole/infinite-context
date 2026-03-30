import styles from "./Connect.module.css";

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

export default function Connect() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <span className={styles.wordmark}>I / C</span>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLinkActive}>Connect</a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLink}>Sync</a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLink}>Ask</a>
            </div>
          </div>
          <button className={styles.avatarBtn}>
            <span className={styles.avatarIcon}>👤</span>
          </button>
        </div>
      </nav>

      <DotLine />

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Connect</h1>
          <div className={styles.titleRule} />
          <p className={styles.pageSubtitle}>One-time setup to index your personal knowledge base.</p>
        </header>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>

            {/* Notes card */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>📄</span>
                <h2 className={styles.cardTitle}>Notes</h2>
              </div>
              <div className={styles.tabRow}>
                <button className={`${styles.tab} ${styles.tabActive}`}>
                  <span className={styles.tabLabel}>RemNote</span>
                  <span className={styles.tabStatus}>Active</span>
                </button>
                <button className={`${styles.tab} ${styles.tabDisabled}`} disabled>
                  <span className={styles.tabLabel}>Notion</span>
                </button>
                <button className={`${styles.tab} ${styles.tabDisabled}`} disabled>
                  <span className={styles.tabLabel}>Obsidian</span>
                </button>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Local Directory Path</label>
                <div className={styles.pathField}>
                  <span className={styles.pathText}>~/Documents/Knowledge/RemNote-Export</span>
                  <span className={styles.folderIcon}>📁</span>
                </div>
              </div>
            </section>

            {/* Code card */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⌨️</span>
                <h2 className={styles.cardTitle}>Code</h2>
              </div>
              <div className={styles.inputGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>GitHub Personal Access Token</label>
                  <input
                    className={styles.input}
                    type="password"
                    defaultValue="ghp_************************"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Repository Identifier</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="username/repo"
                    defaultValue="username/repo"
                  />
                </div>
              </div>
            </section>

            {/* Transcripts card */}
            <section className={`${styles.card} ${styles.cardDimmed}`}>
              <div className={styles.cardHeaderRow}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🎙️</span>
                  <h2 className={styles.cardTitle}>Transcripts</h2>
                </div>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <div className={styles.tabRow}>
                <div className={`${styles.tab} ${styles.tabDisabled}`}>
                  <span className={styles.tabLabel}>Granola</span>
                </div>
                <div className={`${styles.tab} ${styles.tabDashed}`}>
                  <span className={styles.tabLabelMuted}>Connect...</span>
                </div>
                <div className={`${styles.tab} ${styles.tabDashed}`}>
                  <span className={styles.tabLabelMuted}>Connect...</span>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className={styles.ctaRow}>
              <button className={styles.syncBtn}>
                Start Initial Sync <span className={styles.syncIcon}>↻</span>
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className={styles.sidebar}>
            {/* Sync Readiness */}
            <div className={styles.card}>
              <h3 className={styles.sidebarTitle}>Sync Readiness</h3>
              <ul className={styles.readinessList}>
                <li className={styles.readinessItem}>
                  <span className={styles.checkCircle} />
                  <div>
                    <p className={styles.readinessLabel}>RemNote Export</p>
                    <p className={styles.readinessStatus}>Ready</p>
                  </div>
                </li>
                <li className={styles.readinessItem}>
                  <span className={styles.checkCircle} />
                  <div>
                    <p className={styles.readinessLabel}>GitHub Auth</p>
                    <p className={styles.readinessStatus}>Ready</p>
                  </div>
                </li>
                <li className={styles.readinessItem}>
                  <span className={styles.checkPending}>○</span>
                  <div>
                    <p className={styles.readinessLabelMuted}>Knowledge Index</p>
                    <p className={styles.readinessStatusMuted}>Pending Sync</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Privacy card */}
            <div className={styles.privacyCard}>
              <div className={styles.cardHeader}>
                <span className={styles.privacyShield}>🛡</span>
                <h3 className={styles.privacyTitle}>Local-First Privacy</h3>
              </div>
              <p className={styles.privacyText}>
                Your files stay local. Only anonymized embeddings are shared with
                our processing partners.
              </p>
            </div>
          </aside>
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
