# Infinite Context — Claude Code Briefing

You are completing a React frontend for a personal RAG application called **Infinite Context**. The backend is fully built and working. All four frontend pages are built. Your job is to wire everything together and fix two functional gaps. Do not ask clarifying questions — everything you need is in this file.

---

## Project Locations

```
~/Launch_School/Capstone/
  rag/                        ← Python backend (DO NOT MODIFY except task 7 below)
    synthesize.py             ← contains SYSTEM_PROMPT constant
    main.py                   ← FastAPI app, POST /chat route
    .venv/                    ← Python venv

  infinite-context/           ← React frontend — YOUR WORKING DIRECTORY
    src/
      pages/
        Landing.jsx + landing.module.css
        Connect.jsx + connect.module.css
        Sync.jsx + sync.module.css
        Ask.jsx + ask.module.css
      components/             ← empty, keep it that way
      profile.js              ← DOES NOT EXIST YET — create it (Task 5)
      App.jsx                 ← routing not wired — fix it (Task 1)
      index.css               ← global resets, already done
```

---

## Rules — Read Before Writing Any Code

- **CSS Modules only** — one `.module.css` per page, already exists. Do not add inline styles.
- **No new dependencies** — `react-router-dom` and `react-markdown` are already installed. Do not run npm install for anything.
- **No LangChain, no abstraction libraries** — keep code simple and direct.
- **Do not touch** `embed.py`, `retrieve.py`, `main.py`, or any `.module.css` file unless a task explicitly says so.
- **Read each file before editing it.** The pages are complete — you are wiring and extending, not rewriting.

---

## Task List — Complete In Order

### Task 1 — Wire React Router in App.jsx

Current `App.jsx` is a one-liner that just renders `<Landing />` with no router. Replace the entire file with:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Connect from "./pages/Connect";
import Sync from "./pages/Sync";
import Ask from "./pages/Ask";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/sync" element={<Sync />} />
        <Route path="/ask" element={<Ask />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Task 2 — Wire nav links on all four pages

Each page has a nav with this pattern (from Ask.jsx — the others match):

```jsx
<span className={styles.wordmark}>I / C</span>
<a href="#" className={styles.navLink}>Connect</a>
<a href="#" className={styles.navLink}>Sync</a>
<a href="#" className={styles.navLinkActive}>Ask</a>
```

For **each of the four pages** (Landing.jsx, Connect.jsx, Sync.jsx, Ask.jsx):

1. Add `import { Link, useLocation } from "react-router-dom";` at the top
2. Wrap the `I/C` wordmark span in `<Link to="/">`
3. Replace each `<a href="#">` nav link with `<Link to="/connect">`, `<Link to="/sync">`, `<Link to="/ask">`
4. Use `useLocation()` to apply the active class dynamically:
   - `const { pathname } = useLocation();`
   - Each Link gets `className={pathname === "/connect" ? styles.navLinkActive : styles.navLink}` (adjust path per link)
5. Remove the hardcoded `navLinkActive` class from the static JSX — it should now be applied dynamically

Do this for all four pages. Read each file first — the nav structure is consistent but verify before editing.

---

### Task 3 — Wire CTA buttons on Landing

In `Landing.jsx`, find the **Get Started** and **Sign In** buttons. Wire both to navigate to `/connect`:

```jsx
import { useNavigate } from "react-router-dom";
// inside component:
const navigate = useNavigate();
// on button:
onClick={() => navigate("/connect")}
```

---

### Task 4 — Wire Go to Ask and Start Initial Sync buttons

In `Sync.jsx`: find the **Go to Ask** button → `onClick={() => navigate("/ask")}`

In `Connect.jsx`: find the **Start Initial Sync** button → `onClick={() => navigate("/sync")}`

Add `useNavigate` import to both files.

---

### Task 5 — Create profile.js and fix Ask.jsx userProfile

**Step A:** Create `~/Launch_School/Capstone/infinite-context/src/profile.js`:

```js
const profile = {
  name: "Mordecai",
  github_username: "mordcole",
};

export default profile;
```

**Step B:** In `Ask.jsx`, there is currently a hardcoded `userProfile` object near the top of the file:

```js
const userProfile = {
  name: "Mordecai",
  github: "mordecai-xyz",
  focus: "Launch School Capstone — RAG, embeddings, vector search",
};
```

Delete this object entirely. Add this import at the top of the file instead:

```js
import profile from "../profile.js";
```

**Step C:** In `Ask.jsx`, find the `handleSubmit` function. The `history` state starts as `[]` and is sent directly to the backend. Inject a system message on the first turn only.

Find this exact line in `handleSubmit`:
```js
body: JSON.stringify({ query, history }),
```

Replace it with:
```js
const systemMessage = {
  role: "system",
  content: `You are a learning assistant for ${profile.name} (GitHub: ${profile.github_username}). Help them explore connections between their notes, commits, and transcripts.`,
};
const historyWithSystem = history.length === 0 ? [systemMessage] : history;
body: JSON.stringify({ query, history: historyWithSystem }),
```

---

### Task 6 — Wire GitHub commit URLs in SourceCard

In `Ask.jsx`, find the `SourceCard` component. It currently renders the view link as a static div with no href:

```jsx
<div className={styles.sourceLink}>
  <span className={styles.sourceLinkIcon}>
    {type === "GITHUB" ? "<>" : "↗"}
  </span>
  {viewLabel}
</div>
```

Replace the contents of that div so GitHub sources become real anchor tags:

```jsx
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
    <span>{viewLabel}</span>
  )}
</div>
```

---

### Task 7 — Add casual conversation redirect to system prompt

Open `~/Launch_School/Capstone/rag/synthesize.py`. Find the `SYSTEM_PROMPT` constant. Add the following as a new paragraph at the very end of the prompt string, before the closing quote:

```
If the user's query is casual conversation, a greeting, or unrelated to their notes, commits, or transcripts, respond with a brief friendly redirect: let them know Infinite Context is designed to help them explore their learning material, and invite them to ask about their notes or code.
```

Do not change any other part of the system prompt.

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `localhost:5173` loads Landing page
- [ ] I/C wordmark on any page navigates to `/`
- [ ] Get Started on Landing navigates to `/connect`
- [ ] Start Initial Sync on Connect navigates to `/sync`
- [ ] Go to Ask on Sync navigates to `/ask`
- [ ] Active nav link is underlined on each page (dynamically, based on current route)
- [ ] Ask page still works end-to-end (requires backend running)
- [ ] GitHub source cards show real `github.com` URLs
- [ ] `profile.js` exists, old inline `userProfile` object removed from Ask.jsx

---

## How to Start Backend (if needed for testing)

```bash
cd ~/Launch_School/Capstone/rag
source .venv/bin/activate
uvicorn main:app --reload
```

Frontend:
```bash
cd ~/Launch_School/Capstone/infinite-context
npm run dev
```

Backend: `localhost:8000` — Frontend: `localhost:5173`

---

## What Not To Do

- Do not refactor or rewrite existing page components beyond what each task specifies
- Do not add new pages or routes
- Do not install new npm packages
- Do not modify `.module.css` files
- Do not add TypeScript
- Do not touch `embed.py`, `retrieve.py`, or `main.py` (only `synthesize.py` for Task 7)
- Do not touch the Pinecone index
