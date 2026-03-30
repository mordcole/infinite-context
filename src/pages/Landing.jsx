import { useEffect, useRef } from "react";
import styles from "./Landing.module.css";

function SourceBadge({ type }) {
  const badgeClass = {
    REMNOTE: styles.badgeRemnote,
    GITHUB: styles.badgeGithub,
    TRANSCRIPTS: styles.badgeTranscripts,
  }[type];
  return <span className={`${styles.badge} ${badgeClass}`}>{type}</span>;
}

export default function Landing() {
  const timelineRef = useRef(null);

  useEffect(() => {
    const bg = timelineRef.current;
    if (!bg) return;
    const labels = ["note", "commit", "transcript"];
    let labelIdx = 0;
    for (let i = 0; i < 120; i++) {
      if (i % 6 === 0) {
        const node = document.createElement("div");
        node.className = styles.timelineNode;

        const bigDot = document.createElement("div");
        bigDot.className = styles.timelineDotLarge;

        const label = document.createElement("span");
        label.className = styles.timelineLabel;
        label.textContent = labels[labelIdx % labels.length];

        node.appendChild(bigDot);
        node.appendChild(label);
        bg.appendChild(node);
        labelIdx++;
      } else {
        const dot = document.createElement("div");
        dot.className = styles.timelineDot;
        bg.appendChild(dot);
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.wordmark}>I / C</span>
          <div className={styles.navActions}>
            <button className={styles.signInBtn}>Sign In</button>
            <button className={styles.getStartedBtn}>Get Started</button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Masthead */}
        <div className={styles.masthead}>
          <div ref={timelineRef} className={styles.timelineBg} />
          <div className={styles.mastheadContent}>
            <h1 className={styles.displayHeadline}>Infinite<br />Context</h1>
          </div>
        </div>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <h2 className={styles.heroHeadline}>
              Your context window is finite.{" "}
              <em className={styles.heroEmphasis}>Infinite Context isn't.</em>
            </h2>
            <p className={styles.heroSubtitle}>
              Semantic search across your notes, commits, and meeting transcripts
              — three sources of learning, unified.
            </p>
            <div className={styles.heroCtas}>
              <button className={styles.primaryBtn}>
                Get Started <span className={styles.arrow}>→</span>
              </button>
              <button className={styles.secondaryBtn}>View Documentation</button>
            </div>
          </div>

          {/* Hero UI mockup card */}
          <div className={styles.heroRight}>
            <div className={styles.mockupCard}>
              <div className={styles.mockupTitleBar}>
                <div className={styles.trafficLights}>
                  <span className={styles.tlRed} />
                  <span className={styles.tlYellow} />
                  <span className={styles.tlGreen} />
                </div>
              </div>
              <div className={styles.mockupBody}>
                {/* User message */}
                <div className={styles.mockupMessage}>
                  <div className={styles.avatarUser}>👤</div>
                  <div className={styles.userBubble}>
                    How does the new authentication logic handle session expiration
                    in the mobile repo?
                  </div>
                </div>
                {/* Assistant message */}
                <div className={styles.mockupMessage}>
                  <div className={styles.avatarAssistant}>✦</div>
                  <div className={styles.assistantContent}>
                    <p className={styles.assistantText}>
                      Based on your recent <strong>RemNote</strong> entries and
                      the last three commits in{" "}
                      <strong>github.com/org/mobile</strong>, the auth provider
                      now uses a sliding window strategy for session expiration.
                    </p>
                    <div className={styles.sourceList}>
                      <div className={styles.sourceRow}>
                        <span className={styles.sourceFilename}>AuthRefactoring.md</span>
                        <SourceBadge type="REMNOTE" />
                      </div>
                      <div className={styles.sourceRow}>
                        <span className={styles.sourceFilename}>commit: a3f2e91_refresh</span>
                        <SourceBadge type="GITHUB" />
                      </div>
                      <div className={styles.sourceRow}>
                        <span className={styles.sourceFilename}>Meeting_Notes_Aug12.txt</span>
                        <SourceBadge type="TRANSCRIPTS" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.featuresHeader}>
            <div>
              <h2 className={styles.featuresTitle}>
                Built for how developers actually learn.
              </h2>
              <p className={styles.featuresSubtitle}>
                Your notes capture how you think. Your code captures how you
                build. Your pairing sessions capture what you discover together.
                Infinite Context finds the connections between all three.
              </p>
            </div>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⬡</div>
              <h3 className={styles.featureTitle}>Semantic Search</h3>
              <p className={styles.featureDesc}>
                Understands meaning, not just keywords. Find concepts even if you
                forgot the exact phrasing.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.featureCardActive}`}>
              <div className={styles.featureIcon}>✳</div>
              <h3 className={styles.featureTitle}>Cross-Source Synthesis</h3>
              <p className={styles.featureDesc}>
                Combines notes, code, and transcripts into unified answers that
                span your entire workspace.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⬡</div>
              <h3 className={styles.featureTitle}>Local-First Privacy</h3>
              <p className={styles.featureDesc}>
                Your files stay local. Only anonymized embeddings are shared with
                our processing partners.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className={styles.ctaBanner}>
          <span className={styles.ctaLabel}>Unified Knowledge Layer</span>
          <h2 className={styles.ctaTitle}>
            Ready to bridge the gap between what you learn and what you remember?
          </h2>
          <button className={styles.ctaBtn}>Get Started</button>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerBrand}>Infinite Context</p>
            <p className={styles.footerSub}>
              © 2024 Infinite Context. Built for developer learning.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Documentation</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">GitHub</a>
            <span className={styles.footerDivider} />
            <a href="#" className={styles.footerSignIn}>Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
