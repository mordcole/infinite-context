# Infinite Context — Frontend Claude Code Briefing

Personal RAG application for software engineering students.
Semantic search and AI synthesis across three personal learning
sources: notes, GitHub commits, and pairing transcripts.

## Project Location
~/Launch_School/capstone/infinite-context/

## Running the Frontend
npm run dev

Frontend runs on localhost:5173.
Backend must also be running on localhost:8000 for Ask page to work.

## Tech Stack
- React + Vite
- react-router-dom (routing)
- react-markdown (markdown rendering on Ask page)
- CSS Modules — one .module.css per page
- No TypeScript, no new dependencies

## File Structure
infinite-context/
  src/
    pages/
      Landing.jsx + landing.module.css
      Connect.jsx + connect.module.css
      Sync.jsx + sync.module.css
      Ask.jsx + ask.module.css
      Onboarding.jsx + onboarding.module.css
    components/
      NavAvatar.jsx + NavAvatar.module.css
    profile.js
    App.jsx
    index.css
  public/
    favicon.svg
    support-1.png
    support-2.png

## Design System
- Background: #f0ede6 (warm off-white)
- Primary text: #2d3d35 (forest green)
- Muted text: #5a6b5d
- Primary CTA: #445d48 (dark green buttons)
- Source badges: REMNOTE purple, GITHUB blue, TRANSCRIPTS amber
- Code block background: #1e2b22
- Fonts: Plus Jakarta Sans (display/body), JetBrains Mono (code/metadata)

## What Is Already Built and Working
- All four pages complete: Landing, Connect, Sync, Ask
- Onboarding flow with localStorage profile
- React Router wired across all pages
- Ask page: word-by-word streaming, source cards, coverage callout
- Coverage signal: well_covered / partial / missing
- Query classifier: off_topic / learning
- GitHub commit URLs constructed from filename metadata
- NavAvatar with dropdown and sign out
- Session chip showing role and focus with system prompt popover
- Connect page folder pickers wired to POST /ingest/notes

## Pages — Current State
- Landing: complete, hero and feature cards and CTA
- Onboarding: complete, writes profile to localStorage
- Connect: notes and transcript folder pickers working,
  Code section (PAT and repo fields) not yet functional
- Sync: animated bars and chunk counter, hardcoded stats
- Ask: fully wired to backend, streaming, source cards, coverage

## Rules — Read Before Writing Any Code
- Read each file before editing it
- CSS Modules only — never add inline styles
- No new npm dependencies
- No TypeScript
- Surgical edits — do not refactor working components
- Never touch .module.css files unless task explicitly says so
- Never touch index.css
- Follow existing patterns in Ask.jsx for any new page features
- Always commit after completing a task with a clear commit message

## Git
- Remote: https://github.com/mordcole/infinite-context.git
- Branch: main
- Commit after every completed task

## Current Task
See task prompt provided at session start.
