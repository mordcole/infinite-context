import { useState, useRef, useEffect } from "react";
import styles from "./ask.module.css";
import ReactMarkdown from "react-markdown";

const TIMELINE_ITEMS = [
  "note",
  "commit",
  "transcript",
  "note",
  "commit",
  "transcript",
];

const userProfile = {
  name: "Mordecai",
  github: "mordecai-xyz",
  focus: "Launch School Capstone — RAG, embeddings, vector search",
};

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

function SourceBadge({ type }) {
  const cls =
    {
      REMNOTE: styles.badgeRemnote,
      GITHUB: styles.badgeGithub,
      TRANSCRIPTS: styles.badgeTranscripts,
    }[type] || styles.badgeRemnote;
  return <span className={`${styles.badge} ${cls}`}>{type}</span>;
}

function SourceCard({ source }) {
  const type = source.type || "REMNOTE";
  const viewLabel = type === "GITHUB" ? "View Commit" : "View Note";
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
        {viewLabel}
      </div>
    </div>
  );
}

function Message({ message }) {
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
                <SourceCard key={i} source={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Ask() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

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
        body: JSON.stringify({ query, history }),
      });

      const data = await res.json();
      const assistantMsg = {
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setHistory(data.history);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong connecting to the backend. Is the FastAPI server running?",
          sources: [],
        },
      ]);
    } finally {
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
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <span className={styles.wordmark}>I / C</span>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLink}>
                Connect
              </a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLink}>
                Sync
              </a>
              <span className={styles.navDot}>·</span>
              <a href="#" className={styles.navLinkActive}>
                Ask
              </a>
            </div>
          </div>
          <button className={styles.avatarBtn}>👤</button>
        </div>
      </nav>

      <DotLine />

      {/* Page header */}
      <div className={styles.headerWrapper}>
        <div className={styles.headerInner}>
          <h1 className={styles.pageTitle}>Ask</h1>
          <div className={styles.titleRule} />
          <p className={styles.pageSubtitle}>
            Query across your notes and commits.
          </p>
        </div>
      </div>

      {/* Chat thread */}
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                Ask anything about your notes and code.
              </p>
              <p className={styles.emptySubtitle}>
                Try: "What have I written about closures?" or "How did I
                implement auth in my last project?"
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <Message key={i} message={msg} />
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
