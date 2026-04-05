import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./ask.module.css";
import ReactMarkdown from "react-markdown";
import profile from "../profile.js";
import NavAvatar from "../components/NavAvatar";

const TIMELINE_ITEMS = [
  "note",
  "commit",
  "transcript",
  "note",
  "commit",
  "transcript",
];


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

function NoteModal({ source, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{source.filename}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalText}>
            <ReactMarkdown>{source.text}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ type }) {
  const cls =
    {
      REMNOTE: styles.badgeRemnote,
      GITHUB: styles.badgeGithub,
      TRANSCRIPTS: styles.badgeTranscripts,
    }[type] || styles.badgeRemnote;
  return <span className={`${styles.badge} ${cls}`}>{type}</span>;
}

function SourceCard({ source, onViewNote }) {
  const type = source.type || "REMNOTE";
  const viewLabel = type === "GITHUB" ? "View Commit" : type === "TRANSCRIPTS" ? "View Transcript" : "View Note";
  return (
    <div className={styles.sourceCard}>
      <div className={styles.sourceCardTop}>
        <SourceBadge type={type} />
        {source.score && (
          <span className={styles.sourceScore}>
            {Math.round(source.score * 100)}%
          </span>
        )}
      </div>
      <h3 className={styles.sourceTitle}>{source.filename || source.title}</h3>
      {source.date && <p className={styles.sourceDate}>{source.date}</p>}
      <div className={styles.sourceLink}>
        <span className={styles.sourceLinkIcon}>
          {type === "GITHUB" ? "<>" : "↗"}
        </span>
        {type === "GITHUB" ? (
          (() => {
            const parts = (source.filename || "").split("_");
            // Format: mordcole_reponame_commithash
            // parts[0] = username, parts[last] = commit hash, parts[1..n-1] = repo name
            const hash = parts[parts.length - 1];
            const repo = parts.slice(1, parts.length - 1).join("-");
            const url = `https://github.com/mordcole/${repo}/commit/${hash}`;
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {viewLabel}
              </a>
            );
          })()
        ) : (
          <button className={styles.viewNoteBtn} onClick={() => onViewNote(source)}>
            {viewLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function Message({ message, onViewNote }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`${styles.message} ${isUser ? styles.messageUser : styles.messageAssistant}`}
    >
      <div
        className={`${styles.avatar} ${isUser ? styles.avatarUser : styles.avatarAssistant}`}
      >
        {isUser ? "👤" : "✦"}
      </div>
      <div className={styles.messageBubble}>
        <div className={styles.messageText}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {/* Coverage callout */}
        {!isUser && message.mode === "learning" && message.coverage && (
          <div className={`${styles.coverageCallout} ${styles[`coverage_${message.coverage}`]}`}>
            {message.coverage === "well_covered" && "✦ Well documented in your sources"}
            {message.coverage === "partial" && "◑ Partially covered in your sources"}
            {message.coverage === "missing" && "○ Not in your sources yet"}
          </div>
        )}
        {/* Source cards below assistant messages */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className={styles.sourcesSection}>
            <div className={styles.sourcesHeader}>
              <span className={styles.sourcesTitle}>Retrieved Context</span>
              <span className={styles.sourcesCount}>
                {message.sources.length} sources identified
              </span>
            </div>
            <div className={styles.sourceGrid}>
              {message.sources.map((s, i) => (
                <SourceCard key={i} source={s} onViewNote={onViewNote} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function buildSystemPrompt(profile) {
  const roleClause = profile.role ? `, a ${profile.role}` : "";
  const focusClause = profile.focus ? ` currently focused on ${profile.focus}` : "";
  const githubClause = profile.github_username ? ` (GitHub: ${profile.github_username})` : "";
  const base = `You are a learning assistant for ${profile.name}${roleClause}${focusClause}${githubClause}. Tailor your responses to their context and goals. Help them explore connections between their notes, commits, and transcripts.`;

  const styleMap = {
    "software engineering student": `Your responses should be thorough and educational. Define terms before using them. Explain the 'why' before the 'how'. Make connections explicit and celebrate progress. Treat the user as someone building foundational understanding — depth and clarity matter more than brevity.`,
    "working developer": `Your responses should be direct and dense. Skip fundamentals, assume fluency. Lead with trade-offs and production implications. Use precise technical vocabulary without explanation. Treat the user as a peer — get to the point.`,
    "career changer": `Your responses should bridge from general programming experience into new concepts. Use analogies to adjacent domains. Emphasize transferable patterns and the 'why' before the 'how'. Balance encouragement with technical precision.`,
  };

  const styleInstruction = profile.role ? styleMap[profile.role.toLowerCase()] : null;
  return styleInstruction ? `${base}\n\n${styleInstruction}` : base;
}

export default function Ask() {
  const { pathname } = useLocation();
  const lsProfile = (() => { try { const r = localStorage.getItem("ic_profile"); return r ? JSON.parse(r) : null; } catch { return null; } })();
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const bottomRef = useRef(null);
  const chipRef = useRef(null);
  const popoverRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const handleCloseModal = useCallback(() => setActiveNote(null), []);

  useEffect(() => {
    if (!showPrompt) return;
    function handleClickOutside(e) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        chipRef.current && !chipRef.current.contains(e.target)
      ) {
        setShowPrompt(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPrompt]);

  // Clear typing interval on unmount
  useEffect(() => {
    return () => { if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit() {
    const query = input.trim();
    if (!query || loading) return;

    // Add user message to display
    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history: history.length === 0 ? [{ role: "system", content: buildSystemPrompt(profile) }] : history }),
      });

      const data = await res.json();
      const words = data.answer.split(" ");

      const sources = data.sources || [];
      const mode = data.mode || "learning";
      const coverage = data.coverage || null;

      // Add message with empty content and no sources yet
      setMessages((prev) => [...prev, { role: "assistant", content: "", sources: [], mode, coverage }]);
      setHistory(data.history);

      // Reveal words one at a time; hide loading dots on the first tick; add sources after last word
      let wordIndex = 0;
      typingIntervalRef.current = setInterval(() => {
        wordIndex++;
        const revealed = words.slice(0, wordIndex).join(" ");
        const done = wordIndex >= words.length;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: revealed,
            ...(done && { sources }),
          };
          return updated;
        });
        if (wordIndex === 1) setLoading(false);
        if (done) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }, 25);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong connecting to the backend. Is the FastAPI server running?", sources: [] },
      ]);
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className={styles.page}>
      {activeNote && <NoteModal source={activeNote} onClose={handleCloseModal} />}
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
          <div className={styles.navRight}>
            {lsProfile && (
              <div className={styles.sessionChipWrapper}>
                <button
                  ref={chipRef}
                  className={styles.sessionChip}
                  onClick={() => setShowPrompt((p) => !p)}
                >
                  ✦ {lsProfile.role}{lsProfile.focus ? ` · focused on ${lsProfile.focus}` : ""}
                  <span className={styles.chipIcon}>ⓘ</span>
                </button>
                {showPrompt && (
                  <div ref={popoverRef} className={styles.promptPopover}>
                    <p className={styles.promptPopoverLabel}>Active system prompt</p>
                    <pre className={styles.promptPopoverText}>{buildSystemPrompt(lsProfile)}</pre>
                  </div>
                )}
              </div>
            )}
            <NavAvatar />
          </div>
        </div>
      </nav>

      <DotLine />

      {/* Page header */}
      <div className={styles.headerWrapper}>
        <div className={styles.headerInner}>
          <h1 className={styles.pageTitle}>Ask</h1>
          <div className={styles.titleRule} />
          <p className={styles.pageSubtitle}>
            Query across your notes, commits, and transcripts.
          </p>
        </div>
      </div>

      {/* Chat thread */}
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                Ask anything about your notes, code, and transcripts.
              </p>
              <p className={styles.emptySubtitle}>
                Try: "What have I written about closures?" or "How did I
                implement auth in my last project?"
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <Message key={i} message={msg} onViewNote={setActiveNote} />
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.messageAssistant}`}>
              <div className={`${styles.avatar} ${styles.avatarAssistant}`}>
                ✦
              </div>
              <div className={styles.loadingDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar — pinned to bottom */}
      <div className={styles.inputBar}>
        <div className={styles.inputInner}>
          <div className={styles.inputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className={styles.queryBtn}
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
            >
              QUERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
