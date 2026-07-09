# AlgoViz — Feature Documentation

Complete reference of every feature in the project.

---

## Table of Contents

1. [Problem Library](#1-problem-library)
2. [Algorithm Visualizer](#2-algorithm-visualizer)
3. [Solution Panel](#3-solution-panel)
4. [Code Editor & Runner](#4-code-editor--runner)
5. [Navigation & Search](#5-navigation--search)
6. [Progress Tracking](#6-progress-tracking)
7. [UI & Theming](#7-ui--theming)
8. [Keyboard Shortcuts](#8-keyboard-shortcuts)

---

## 1. Problem Library

### 100 Curated Problems
All problems are sourced from LeetCode's most-asked SDE-2 problem set, organized into 8 categories.

| # | Category | Count |
|---|---|---|
| 01 | Arrays & Strings | 20 |
| 02 | Linked Lists | 10 |
| 03 | Trees & Graphs | 20 |
| 04 | Dynamic Programming | 15 |
| 05 | Backtracking & Recursion | 10 |
| 06 | Stacks & Queues | 8 |
| 07 | Heaps & Priority Queues | 7 |
| 08 | Sorting & Searching | 10 |

### Problem Metadata
Every problem carries:
- **Title** — official LeetCode name
- **Difficulty** — Easy / Medium / Hard (colour-coded green / yellow / red)
- **Tags** — e.g. `Array`, `Two Pointers`, `Dynamic Programming`
- **LeetCode link** — direct link to the original problem
- **Solution files** — C++, Python, Java served from `/public/`

### Category Page Filters
- **Difficulty dropdown** — filter by All / Easy / Medium / Hard
- **Tag chips** — multi-select; problems must match ALL selected tags (AND logic)
- **Combined** — difficulty and tag filters work together
- **Problem count** — updates live to show `filtered / total`
- **Clear all** — resets both filters at once

### Sort Order
Problems on each category page are sorted **Easy → Medium → Hard** automatically. Within the same difficulty, original registry order is preserved.

---

## 2. Algorithm Visualizer

### Standardised 3-Panel Shell
Every problem uses the same layout:

```
┌─────────────┬──────────────────────────┬──────────────┐
│  LEFT       │  CENTER (canvas)         │  RIGHT       │
│  Test cases │  Visualization           │  Step info   │
│  Algorithm  │  Step comment            │  Pseudocode  │
│  Custom     │  Progress bar            │  Statistics  │
│  input      │  Controls                │  Legend      │
│             │  Keyboard hint           │  Complexity  │
└─────────────┴──────────────────────────┴──────────────┘
```

### Left Panel
- **Test Cases** — pre-built inputs per problem; numbered badges (1, 2, 3…); active case highlighted
- **Algorithm Selector** — switch between multiple approaches (e.g. Brute Force vs Optimal); complexity shown per option
- **Custom Input** — problem-specific input fields to run the visualizer on your own data; ghost "▶ Apply" button

### Center Panel — Canvas
- **Step comment banner** — plain-English explanation of the current step shown above the canvas
- **Progress bar** — 3px bar below the canvas fills as you step through
- **Visualizer canvas** — 6 reusable visual patterns:
  - `ArrayDisplay` — array cells with pointer labels
  - `LinkedListDisplay` / `CyclicListDisplay` — node chains with arrows
  - `TreeDisplay` — binary tree with parent/child edges
  - `GraphDisplay` — graph nodes and edges with BFS/DFS state
  - `DPTableDisplay` — 2-D DP table with cell highlighting
  - `BacktrackingDisplay` — decision tree for recursive problems

### Controls Bar
- **◀ Prev** — step back one frame
- **▶ Start / Resume / ↺ Restart** — context-aware play button label
- **⏸ Pause** — pause auto-play
- **Next ▶** — step forward one frame
- **↺ Reset** — return to initial state
- **Speed selector** — 0.5× / 1× / 2× / 3× / 5× (maps to 2000ms → 200ms interval)
- **Step counter** — `Step N of M` display
- **Keyboard hint** — `Space play · ← → step · R reset`

### Right Panel
- **Current Step** — step number + plain-English description of what's happening
- **Pseudocode** — line-by-line pseudocode; active line auto-highlighted and scrolled into view
- **Statistics** — live key-value stats (e.g. comparisons, swaps, current max)
- **Legend** — colour key for the visual tokens used in the canvas
- **Complexity** — time and space complexity cards with Big-O tier bars (O(1) → O(n!)) and a live operations chart

### Playback Engine (`useVisualizer`)
- Steps array generated per problem per test case per algorithm
- `play` auto-advances on an interval driven by speed setting
- Stops automatically at the last step; play button turns to "Restart"
- All state resets when test case or algorithm changes

### Semantic Colour System
Six consistent highlight colours used across all 100 visualizers:

| Token | Colour | Meaning |
|---|---|---|
| `current` | Orange | Element being examined |
| `match` | Green | Found / correct result |
| `compare` | Purple | Secondary pointer |
| `special` | Amber | Pivot / midpoint / special node |
| `discard` | Grey | Eliminated / visited |
| `error` | Red | Conflict / mismatch |

---

## 3. Solution Panel

### Multi-Language Code Viewer
- **Language dropdown** — C++ / Python / Java (easily extensible — add a line to `LANGS` array)
- **Syntax highlighting** — via highlight.js; grammars lazy-loaded per language
- **Copy button** — copies current solution to clipboard; shows `✓ Copied` feedback for 2s
- **Filename label** — shows the source file name in the toolbar

### Multi-Approach Support
- Problems with multiple approaches show **approach pills** (e.g. `Brute Force O(n²)` / `Optimal O(n)`)
- Each approach has its own code, time complexity, space complexity, and tutorial
- Approach pills show the time complexity badge inline

### Resizable Split View
- Code pane (left) and tutorial pane (right) are separated by a **drag handle**
- Drag to resize between 40%–60% split
- Cursor changes to `col-resize` during drag

### Tutorial Pane
- **Intuition** — high-level explanation of why the approach works
- **Step-by-step walkthrough** — numbered steps with example values
- **Insight box** — key insight or gotcha callout
- **Complexity summary** — time and space with Big-O visual bars
- **Run Code panel** — collapsible, see §4

---

## 4. Code Editor & Runner

### Syntax-Highlighted Editor (Problem Tab)
- Editable code area with live syntax highlighting (highlight.js)
- Transparent `<textarea>` overlaid on a highlighted `<pre>` — no external editor dependency
- Language dropdown (C++ / Python / Java) reloads the starter template for the selected language
- Starter code pre-populated from `/src/data/starterCode.js`

### In-Browser Code Execution (Judge0)
- Powered by **Judge0 CE** (free, no account required)
- Submits source code + stdin → polls for result → displays stdout / stderr / compile errors
- Supports **stdin** input field for custom test data
- Status badges: `Accepted` (green) / `Wrong Answer` / `TLE` / `Compilation Error` / `Runtime Error` (red)
- Falls back to the open CE instance (`ce.judge0.com`) if the RapidAPI key is not configured

### I/O Section
- **Input textarea** — pre-filled with the selected test case's input
- **Output panel** — displays raw stdout; colour-coded for success / error

---

## 5. Navigation & Search

### Navbar
- **Logo** — `{ }` AlgoViz — links to home
- **Search bar** — type to navigate to `/search?q=...`; clears on navigate

### Search Page
- Full-text search across problem title, tags, and category
- Results update live as you type
- URL stays in sync (`?q=...`) — shareable search links
- Result count shown

### Problem Page Header
- **Breadcrumb** — Home → Category → Problem
- **Difficulty badge**, tags, LeetCode link
- **Prev / Next** navigation — links to adjacent problems in the same category
- **Mark Done button** — toggles completion state with `✓` / `○` icon

### Three-Tab Layout
Each problem has three tabs:
1. **Problem** — description, constraints, examples, hints, code editor, run panel
2. **Visualizer** — interactive animation shell
3. **Solution** — multi-language solutions with tutorial

### 404 Page
- Large `404` heading
- **← Back to Home** link
- **Try a random problem →** button — picks a random slug and navigates instantly

---

## 6. Progress Tracking

### Mark Done
- Toggle button on every problem page — marks a problem as done or undone
- State persisted in **localStorage** under key `dsa-done-problems`
- Syncs across browser tabs via the `storage` event

### Visual Indicators
- **Problem cards** — green left border + green `✓` badge when done
- **Home page stats** — global `done / total` counter in the hero section
- **Per-category progress bars** — each category card on the home page shows a green fill bar + `X/Y` counter

---

## 7. UI & Theming

### Dark / Light Theme
- Default: **dark** (GitHub-style dark palette)
- Toggle via the sun/moon button in the navbar
- Persisted in `localStorage`; applied via `data-theme` attribute on `<html>`
- Full light mode overrides for every component

### Design System
- **Design tokens** — all colours, spacing, radii, shadows defined as CSS variables in `tokens.css`; zero hardcoded values in components
- **Font stack** — Inter (sans), JetBrains Mono (code)
- **Spacing scale** — 4px base unit (`--space-1` through `--space-10`)
- **Radius scale** — sm (4px) → 2xl (24px) → full (pill)
- **Transitions** — fast (0.12s) / base (0.18s) throughout

### Social / SEO
- **Page title** — `AlgoViz — DSA Algorithm Visualizer`
- **Meta description** — for Google indexing
- **Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url` for LinkedIn / Slack previews
- **Twitter Card** — `summary_large_image` for Twitter / X previews

---

## 8. Keyboard Shortcuts

Available on any visualizer page (disabled when focus is inside an input, textarea, or select):

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `←` | Previous step |
| `→` | Next step |
| `R` | Reset to beginning |

A hint bar showing all shortcuts is displayed below the controls bar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM v7 |
| Syntax highlighting | highlight.js 11 |
| Code execution | Judge0 CE (free tier) |
| Styling | CSS Modules + CSS Variables |
| Linting | Oxlint |
| Hosting | Vercel (recommended) |

---

*Last updated after commit `967a7e2`*
