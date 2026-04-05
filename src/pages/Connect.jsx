import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Connect.module.css";
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

// ─── Ingest state machine ──────────────────────────────────────────────────────
// idle → picking → reading → uploading → done | error

export default function Connect() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Notes file picker state
  const [ingestState, setIngestState] = useState("connected"); // connected | idle | picking | reading | uploading | done | error
  const [selectedFolder, setSelectedFolder] = useState(null);   // folder name string
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 0 }); // batch progress
  const [ingestResult, setIngestResult] = useState(null);           // { ingested, chunks }
  const [ingestError, setIngestError] = useState(null);
  const abortRef = useRef(false);

  // Transcripts file picker state
  const [transcriptIngestState, setTranscriptIngestState] = useState("connected");
  const [transcriptSelectedFolder, setTranscriptSelectedFolder] = useState(null);
  const [transcriptFileCount, setTranscriptFileCount] = useState(0);
  const [transcriptProgress, setTranscriptProgress] = useState({ done: 0, total: 0 });
  const [transcriptIngestResult, setTranscriptIngestResult] = useState(null);
  const [transcriptIngestError, setTranscriptIngestError] = useState(null);
  const transcriptAbortRef = useRef(false);

  async function handlePickFolder() {
    if (!("showDirectoryPicker" in window)) {
      setIngestError("Your browser doesn't support the folder picker. Try Chrome or Edge.");
      setIngestState("error");
      return;
    }

    try {
      setIngestState("picking");
      const dirHandle = await window.showDirectoryPicker({ mode: "read" });
      setSelectedFolder(dirHandle.name);
      setIngestState("reading");

      // Recursively collect all .md files
      const files = await collectMarkdownFiles(dirHandle);
      setFileCount(files.length);

      if (files.length === 0) {
        setIngestError("No markdown (.md) files found in that folder.");
        setIngestState("error");
        return;
      }

      // Read file contents
      const fileData = await readFileContents(files);

      // Upload in batches of 20
      setIngestState("uploading");
      abortRef.current = false;
      const BATCH = 20;
      let totalIngested = 0;
      let totalChunks = 0;

      for (let i = 0; i < fileData.length; i += BATCH) {
        if (abortRef.current) break;
        const batch = fileData.slice(i, i + BATCH);
        setProgress({ done: i, total: fileData.length });

        const res = await fetch("http://localhost:8000/ingest/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: batch }),
        });

        if (!res.ok) {
          const detail = await res.text();
          throw new Error(detail || `Server error ${res.status}`);
        }

        const data = await res.json();
        totalIngested += data.ingested;
        totalChunks += data.chunks;
      }

      setProgress({ done: fileData.length, total: fileData.length });
      setIngestResult({ ingested: totalIngested, chunks: totalChunks });
      setIngestState("done");

    } catch (err) {
      if (err.name === "AbortError") {
        // User cancelled the picker — go back to idle silently
        setIngestState("idle");
      } else {
        setIngestError(err.message);
        setIngestState("error");
      }
    }
  }

  function handleReset() {
    abortRef.current = true;
    setIngestState("idle");
    setSelectedFolder(null);
    setFileCount(0);
    setProgress({ done: 0, total: 0 });
    setIngestResult(null);
    setIngestError(null);
  }

  async function handlePickTranscriptFolder() {
    if (!("showDirectoryPicker" in window)) {
      setTranscriptIngestError("Your browser doesn't support the folder picker. Try Chrome or Edge.");
      setTranscriptIngestState("error");
      return;
    }

    try {
      setTranscriptIngestState("picking");
      const dirHandle = await window.showDirectoryPicker({ mode: "read" });
      setTranscriptSelectedFolder(dirHandle.name);
      setTranscriptIngestState("reading");

      const files = await collectMarkdownFiles(dirHandle);
      setTranscriptFileCount(files.length);

      if (files.length === 0) {
        setTranscriptIngestError("No markdown (.md) files found in that folder.");
        setTranscriptIngestState("error");
        return;
      }

      const fileData = await readFileContents(files);

      setTranscriptIngestState("uploading");
      transcriptAbortRef.current = false;
      const BATCH = 20;
      let totalIngested = 0;
      let totalChunks = 0;

      for (let i = 0; i < fileData.length; i += BATCH) {
        if (transcriptAbortRef.current) break;
        const batch = fileData.slice(i, i + BATCH);
        setTranscriptProgress({ done: i, total: fileData.length });

        const res = await fetch("http://localhost:8000/ingest/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: batch, source: "transcripts" }),
        });

        if (!res.ok) {
          const detail = await res.text();
          throw new Error(detail || `Server error ${res.status}`);
        }

        const data = await res.json();
        totalIngested += data.ingested;
        totalChunks += data.chunks;
      }

      setTranscriptProgress({ done: fileData.length, total: fileData.length });
      setTranscriptIngestResult({ ingested: totalIngested, chunks: totalChunks });
      setTranscriptIngestState("done");

    } catch (err) {
      if (err.name === "AbortError") {
        setTranscriptIngestState("idle");
      } else {
        setTranscriptIngestError(err.message);
        setTranscriptIngestState("error");
      }
    }
  }

  function handleTranscriptReset() {
    transcriptAbortRef.current = true;
    setTranscriptIngestState("idle");
    setTranscriptSelectedFolder(null);
    setTranscriptFileCount(0);
    setTranscriptProgress({ done: 0, total: 0 });
    setTranscriptIngestResult(null);
    setTranscriptIngestError(null);
  }

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <Link to="/" className={styles.wordmarkLink}><span className={styles.wordmark}>I / C</span></Link>
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
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Connect</h1>
          <div className={styles.titleRule} />
          <p className={styles.pageSubtitle}>One-time setup to index your personal knowledge base.</p>
        </header>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>

            {/* ── STEP 1: Notes ─────────────────────────────────── */}
            <div className={styles.stepBlock}>
              <div className={styles.stepCallout}>
                <span className={styles.stepNumber}>Step 1/3</span>
                <p className={styles.stepDescription}>
                  Connect your notes.
                </p>
              </div>
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

                {/* ── Folder picker UI ────────────────────────── */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Notes Folder</label>

                  {ingestState === "connected" && (
                    <div className={styles.ingestDone}>
                      <div className={styles.ingestDoneMeta}>
                        <span className={styles.ingestDoneFolder}>📁 remnote-export · 488 notes · already indexed</span>
                      </div>
                      <button className={styles.resetBtn} onClick={handlePickFolder}>Update folder</button>
                    </div>
                  )}

                  {ingestState === "idle" && (
                    <button className={styles.folderPickerBtn} onClick={handlePickFolder}>
                      <span className={styles.folderPickerIcon}>📁</span>
                      <span>Select folder of markdown files</span>
                    </button>
                  )}

                  {ingestState === "picking" && (
                    <div className={styles.ingestStatus}>
                      <span className={styles.spinner} />
                      <span>Waiting for folder selection…</span>
                    </div>
                  )}

                  {ingestState === "reading" && (
                    <div className={styles.ingestStatus}>
                      <span className={styles.spinner} />
                      <span>Reading files from <code className={styles.inlineCode}>{selectedFolder}</code>…</span>
                    </div>
                  )}

                  {ingestState === "uploading" && (
                    <div className={styles.ingestProgress}>
                      <div className={styles.ingestProgressHeader}>
                        <span className={styles.folderName}>📁 {selectedFolder}</span>
                        <span className={styles.ingestProgressCount}>
                          {progress.done} / {fileCount} files
                        </span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: fileCount > 0 ? `${(progress.done / fileCount) * 100}%` : "0%" }}
                        />
                      </div>
                      <p className={styles.ingestProgressLabel}>
                        Embedding and indexing into Pinecone…
                      </p>
                    </div>
                  )}

                  {ingestState === "done" && (
                    <div className={styles.ingestDone}>
                      <div className={styles.ingestDoneHeader}>
                        <span className={styles.ingestDoneCheck}>✓</span>
                        <span className={styles.ingestDoneTitle}>Indexed successfully</span>
                      </div>
                      <div className={styles.ingestDoneMeta}>
                        <span className={styles.ingestDoneFolder}>📁 {selectedFolder}</span>
                        <span className={styles.ingestDoneStat}>
                          {ingestResult?.ingested} files · {ingestResult?.chunks} chunks
                        </span>
                      </div>
                      <button className={styles.resetBtn} onClick={handleReset}>
                        Select a different folder
                      </button>
                    </div>
                  )}

                  {ingestState === "error" && (
                    <div className={styles.ingestError}>
                      <span className={styles.ingestErrorIcon}>⚠</span>
                      <div>
                        <p className={styles.ingestErrorMsg}>{ingestError}</p>
                        <button className={styles.resetBtn} onClick={handleReset}>Try again</button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ── STEP 2: Code ──────────────────────────────────── */}
            <div className={styles.stepBlock}>
              <div className={styles.stepCallout}>
                <span className={styles.stepNumber}>Step 2/3</span>
                <p className={styles.stepDescription}>
                  Connect your code.
                </p>
              </div>
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
            </div>

            {/* ── STEP 3: Transcripts ───────────────────────────── */}
            <div className={styles.stepBlock}>
              <div className={styles.stepCallout}>
                <span className={styles.stepNumber}>Step 3/3</span>
                <p className={styles.stepDescription}>
                  Connect your transcripts.
                </p>
              </div>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🎙️</span>
                  <h2 className={styles.cardTitle}>Transcripts</h2>
                </div>
                <div className={styles.tabRow}>
                  <button className={`${styles.tab} ${styles.tabActive}`}>
                    <span className={styles.tabLabel}>Granola</span>
                    <span className={styles.tabStatus}>Active</span>
                  </button>
                  <button className={`${styles.tab} ${styles.tabDisabled}`} disabled>
                    <span className={styles.tabLabel}>Zoom</span>
                  </button>
                  <button className={`${styles.tab} ${styles.tabDisabled}`} disabled>
                    <span className={styles.tabLabel}>Other</span>
                  </button>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Transcripts Folder</label>

                  {transcriptIngestState === "connected" && (
                    <div className={styles.ingestDone}>
                      <div className={styles.ingestDoneMeta}>
                        <span className={styles.ingestDoneFolder}>📁 transcripts · 6 sessions · already indexed</span>
                      </div>
                      <button className={styles.resetBtn} onClick={handlePickTranscriptFolder}>Update folder</button>
                    </div>
                  )}

                  {transcriptIngestState === "idle" && (
                    <button className={styles.folderPickerBtn} onClick={handlePickTranscriptFolder}>
                      <span className={styles.folderPickerIcon}>📁</span>
                      <span>Select folder of markdown files</span>
                    </button>
                  )}

                  {transcriptIngestState === "picking" && (
                    <div className={styles.ingestStatus}>
                      <span className={styles.spinner} />
                      <span>Waiting for folder selection…</span>
                    </div>
                  )}

                  {transcriptIngestState === "reading" && (
                    <div className={styles.ingestStatus}>
                      <span className={styles.spinner} />
                      <span>Reading files from <code className={styles.inlineCode}>{transcriptSelectedFolder}</code>…</span>
                    </div>
                  )}

                  {transcriptIngestState === "uploading" && (
                    <div className={styles.ingestProgress}>
                      <div className={styles.ingestProgressHeader}>
                        <span className={styles.folderName}>📁 {transcriptSelectedFolder}</span>
                        <span className={styles.ingestProgressCount}>
                          {transcriptProgress.done} / {transcriptFileCount} files
                        </span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: transcriptFileCount > 0 ? `${(transcriptProgress.done / transcriptFileCount) * 100}%` : "0%" }}
                        />
                      </div>
                      <p className={styles.ingestProgressLabel}>
                        Embedding and indexing into Pinecone…
                      </p>
                    </div>
                  )}

                  {transcriptIngestState === "done" && (
                    <div className={styles.ingestDone}>
                      <div className={styles.ingestDoneHeader}>
                        <span className={styles.ingestDoneCheck}>✓</span>
                        <span className={styles.ingestDoneTitle}>Indexed successfully</span>
                      </div>
                      <div className={styles.ingestDoneMeta}>
                        <span className={styles.ingestDoneFolder}>📁 {transcriptSelectedFolder}</span>
                        <span className={styles.ingestDoneStat}>
                          {transcriptIngestResult?.ingested} files · {transcriptIngestResult?.chunks} chunks
                        </span>
                      </div>
                      <button className={styles.resetBtn} onClick={handleTranscriptReset}>
                        Select a different folder
                      </button>
                    </div>
                  )}

                  {transcriptIngestState === "error" && (
                    <div className={styles.ingestError}>
                      <span className={styles.ingestErrorIcon}>⚠</span>
                      <div>
                        <p className={styles.ingestErrorMsg}>{transcriptIngestError}</p>
                        <button className={styles.resetBtn} onClick={handleTranscriptReset}>Try again</button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* CTA */}
            <div className={styles.ctaRow}>
              <button className={styles.syncBtn} onClick={() => navigate("/sync", { state: { syncing: true } })}>
                Start Initial Sync <span className={styles.syncIcon}>↻</span>
              </button>
            </div>
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
          <div className={styles.footerLinks} />
        </div>
      </footer>
    </div>
  );
}

// ─── Helpers (module-level, no React) ─────────────────────────────────────────

async function collectMarkdownFiles(dirHandle, path = "") {
  const files = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "file" && name.endsWith(".md")) {
      files.push({ handle, path: path ? `${path}/${name}` : name });
    } else if (handle.kind === "directory") {
      const nested = await collectMarkdownFiles(handle, path ? `${path}/${name}` : name);
      files.push(...nested);
    }
  }
  return files;
}

async function readFileContents(files) {
  const results = [];
  for (const { handle, path } of files) {
    const file = await handle.getFile();
    const content = await file.text();
    results.push({ filename: path, content });
  }
  return results;
}
