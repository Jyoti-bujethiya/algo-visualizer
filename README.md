# DSA Algorithm Visualizer

An interactive step-by-step visualizer for 100 classic LeetCode problems — built with React and Vite.

Each problem includes an animated visualization, multi-language code viewer (Python, Java, C++), complexity analysis, and a written tutorial.

## Live Demo

> Deploy link will appear here after Vercel deployment.

## Features

- **100 problems** across 8 DSA categories
- **Step-by-step animations** — play, pause, step forward/back, adjust speed
- **Multi-language code** — Python, Java, and C++ with syntax highlighting
- **Complexity cards** — time and space complexity per approach
- **Written tutorials** — explanation of each approach with intuition and walkthrough
- **Search** — find problems by name or tag
- **Dark / light theme**
- **Progress tracking** — marks problems as done (persisted in localStorage)

## Problem Categories

| # | Category | Problems |
|---|---|---|
| 01 | Arrays & Strings | 20 |
| 02 | Linked Lists | 10 |
| 03 | Trees & Graphs | 20 |
| 04 | Dynamic Programming | 15 |
| 05 | Backtracking & Recursion | 10 |
| 06 | Stacks & Queues | 8 |
| 07 | Heaps & Priority Queues | 7 |
| 08 | Sorting & Searching | 10 |

## Tech Stack

- **React 19** + **Vite 8**
- **React Router DOM v7** — client-side routing
- **highlight.js** — code syntax highlighting
- **CSS Modules** — scoped component styles
- **Oxlint** — fast JavaScript linter

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # Shared UI components (Navbar, CodeViewer, etc.)
├── contexts/          # ThemeContext
├── data/              # Problem registry, tutorials, starter code
├── hooks/             # useVisualizer, useDoneProblems
├── pages/             # Route-level pages (Home, Category, Problem, Search)
├── styles/            # Global CSS and design tokens
└── visualizers/       # One folder per problem — visualizer + steps logic

public/
├── cpp/               # C++ solution files (100)
├── java/              # Java solution files (100)
└── python/            # Python solution files (100)
```

## Author

**Jyoti Bujethiya** — [github.com/Jyoti-bujethiya](https://github.com/Jyoti-bujethiya)
