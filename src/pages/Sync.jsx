import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./sync.module.css";
import NavAvatar from "../components/NavAvatar";

const TIMELINE_ITEMS = ["note", "commit", "transcript", "note", "commit", "transcript"];

function DotLine() {
  return (
    <div className={styles.dotLineWrapper}>
      <div className={styles.dotLineTrack}>
        {Array.from({ length: 8 }, () => TIMELINE_ITEMS).flat().map((label, i) => (
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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldAnimate = location.state?.syncing === true;

  const [notesVal, setNotesVal] = useState(shouldAnimate ? 0 : 488);
  const [commitsVal, setCommitsVal] = useState(shouldAnimate ? 0 : 142);
  const [transcriptsVal, setTranscriptsVal] = useState(shouldAnimate ? 0 : 6);
  const [syncDone, setSyncDone] = useState(!shouldAnimate);
  const [chunksVal, setChunksVal] = useState(shouldAnimate ? 0 : 2853);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    const t1 = setTimeout(() => setNotesVal(488), 300);
    const t2 = setTimeout(() => setCommitsVal(142), 600);
    const t3 = setTimeout(() => setTranscriptsVal(6), 900);
    const t4 = setTimeout(() => {
      setSyncDone(true);
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + 140, 2853);
        setChunksVal(current);
        if (current >= 2853) clearInterval(interval);
      }, 50);
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [shouldAnimate]);

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <Link to="/"><span className={styles.wordmark}>I / C</span></Link>
            <div className={styles.navLinks}>
              <Link to="/connect" className={pathname === "/connect" ? styles.navLinkActive : styles.navLink}>Connect</Link>
              <span className={styles.navDot}>·</span>
              <Link to="/sync" className={pathname === "/sync" ? styles.navLinkActive : styles.navLink}>Sync</Link>
              <span className={styles.navDot}>·</span>
              <Link to="/ask" className={pathname === "/ask" ? styles.navLinkActive : styles.navLink}>Ask</Link>
            </div>
          </div>
          <NavAvatar />
        </div>
      </nav>

      <DotLine />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Page header */}
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Sync</h1>
            <div className={styles.titleRule} />
            <p className={styles.pageSubtitle}>Your notes, commits, and transcripts are indexed and ready to query.</p>
          </div>

          {/* Sync complete row */}
          {syncDone && (
            <div className={styles.syncCompleteRow}>
              <span className={styles.syncCompleteCheck}>✓</span>
              <span className={styles.syncCompleteTitle}>Sync Complete</span>
              <button className={styles.goToAskBtn} onClick={() => navigate("/ask")}>Go to Ask</button>
            </div>
          )}

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
                  <span className={styles.progressCount}>{notesVal}/488</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`} style={{ width: `${(notesVal / 488) * 100}%` }} />
                </div>
              </div>
              {/* Commits */}
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabelGroup}>
                    <span className={styles.progressLabel}>Commits Indexed</span>
                    <span className={`${styles.sourceBadge} ${styles.badgeGithub}`}>GITHUB</span>
                  </div>
                  <span className={styles.progressCount}>{commitsVal}/142</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`} style={{ width: `${(commitsVal / 142) * 100}%` }} />
                </div>
              </div>
              {/* Transcripts */}
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <div className={styles.progressLabelGroup}>
                    <span className={styles.progressLabel}>Transcripts Indexed</span>
                    <span className={`${styles.sourceBadge} ${styles.badgeTranscripts}`}>TRANSCRIPTS</span>
                  </div>
                  <span className={styles.progressCount}>{transcriptsVal}/6</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={`${styles.progressBar} ${styles.progressBarFull}`} style={{ width: `${(transcriptsVal / 6) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className={styles.statsCard}>
              <div className={styles.statsIcon}>⊞</div>
              <p className={styles.statsLabel}>Total Chunks Embedded</p>
              <div className={styles.statsNumber}>{chunksVal.toLocaleString()}</div>
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
                  <tr className={styles.tableRow}>
                    <td className={styles.td}>
                      <div className={styles.sourceCell}>
                        <span className={styles.sourceCellIcon}>🎙️</span>
                        <div>
                          <p className={styles.sourceName}>Transcripts</p>
                          <p className={styles.sourceDesc}>Granola Sync</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>every 30 min</td>
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
              <div className={styles.supportAvatar}>
                <img src="/support-1.png" alt="Support" className={styles.supportAvatarImg} />
              </div>
              <div className={styles.supportAvatar}>
                <img src="/support-2.png" alt="Support" className={styles.supportAvatarImg} />
              </div>
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
            <p className={styles.footerSub}>© 2026 Infinite Context. Built for developer learning.</p>
          </div>
          <div className={styles.footerLinks}>
          </div>
        </div>
      </footer>
    </div>
  );
}
