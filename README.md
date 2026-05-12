# AlgoMuseum

A cinematic interactive systems museum that transforms classic computer science algorithms into immersive, production-inspired simulations.

## Live Demo

**Production:** https://algomuseum.vercel.app/

---

## Overview

AlgoMuseum reimagines algorithm learning as a premium interactive product experience.

Instead of static visualizers or classroom demos, AlgoMuseum presents immersive exhibits that simulate real-world systems using backend-driven state machines, cinematic frontend motion, and deterministic algorithm execution.

Each exhibit helps users understand not just what an algorithm does, but how real engineering systems apply it.

---

## Why AlgoMuseum?

Most algorithm visualizers feel academic.

AlgoMuseum reframes the same concepts as real systems:

- elevators as scheduling engines
- maps as routing systems
- search as indexed retrieval
- logistics as optimization workflows
- recommendations as ranking systems

The goal is to make algorithms intuitive, visual, memorable, and product-grade.

---

## Features

### Cinematic Product Experience

- premium dark museum-inspired interface
- immersive system boot sequence
- cinematic route transitions
- glassmorphism-based UI system panels
- ambient motion effects and subtle environmental realism
- responsive mobile-first experience
- premium motion interactions using Framer Motion

### Interactive Algorithm Exhibits

Explore production-inspired algorithm simulations:

- **Smart Search Shelf** → Binary Search
- **City Map Navigator** → Dijkstra’s Shortest Path
- **Elevator Dispatch** → Queue Scheduling / Dispatch Systems
- **Delivery Route Planner** → Greedy Optimization
- **Recommendation Room** → Similarity Scoring

---

# Featured Exhibit: Elevator Dispatch

A backend-driven elevator control simulation inspired by real scheduling systems.

Users can:

- request floors
- switch scheduling algorithms
- inspect backend state transitions
- visualize real-time queue behavior
- replay historical simulation states
- observe realistic elevator motion

### Supported Scheduling Algorithms

- FCFS (First Come First Served)
- SSTF (Shortest Seek Time First)
- SCAN (Elevator Algorithm)

---

# Architecture

AlgoMuseum separates simulation logic from presentation.

## Backend (Simulation Engine)

The backend acts as a deterministic state machine.

Responsibilities:

- queue scheduling logic
- algorithm execution
- target floor selection
- event logging
- metrics calculation
- state transitions

Simulation lifecycle:

```text
REQUEST_FLOOR
   ↓
STEP
   ↓
TARGET_LOCKED
   ↓
ARRIVAL_CONFIRMED
```

Backend determines:

- next destination
- queue state
- elevator direction
- completed requests
- system logs
- metrics

Built with:

- Next.js API Routes
- TypeScript
- modular simulation engine architecture

---

## Frontend (Presentation Layer)

The frontend is responsible for cinematic rendering.

Responsibilities:

- spring-based elevator animation
- motion orchestration
- interactive controls
- HUD rendering
- system timeline visualization
- route transitions
- micro-interactions

Built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

This separation keeps the platform deterministic, testable, scalable, and visually premium.

---

# Trace Replay / Time Travel Debugger

One of AlgoMuseum’s signature features.

Every backend state transition is recorded and replayable.

Users can:

- enter replay mode
- scrub through historical states
- play / pause simulation history
- inspect state changes
- visualize backend scheduling decisions step-by-step

Replay event types:

- REQUEST_RECEIVED
- TARGET_LOCKED
- ARRIVAL_CONFIRMED
- ALGORITHM_CHANGED
- SYSTEM_RESET

This creates a debugger-like experience for learning algorithms.

---

# Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend

- Next.js API Routes
- TypeScript Simulation Engine

### Design

- Glassmorphism UI
- Motion-based interaction design
- Cinematic system visual storytelling
- Reusable design system components

---

# Engineering Highlights

This project demonstrates:

- backend API architecture
- deterministic state machine design
- frontend systems visualization
- reusable UI architecture
- motion systems engineering
- algorithm simulation design
- product-level UI/UX thinking
- full-stack engineering

---

# Project Structure

```bash
app/
  page.tsx
  museum/
  exhibits/
    elevator-dispatch/
      page.tsx
      TraceReplayPanel.tsx
  api/
    exhibits/
      elevator-dispatch/
        step/
        reset/

lib/
  simulations/
    elevator/
      engine.ts
      types.ts
      defaultState.ts
      logger.ts
  hooks/
    useTraceReplay.ts

components/
  ui/
    GlassPanel.tsx
    Badge.tsx
```

---

# Run Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/algomuseum.git
cd algomuseum
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# Performance Optimizations

- hardware-accelerated animations
- optimized particle rendering
- capped trace replay memory
- reduced animation overhead
- responsive layout tuning
- mobile interaction optimization
- reduced-motion accessibility support

---

# Future Improvements

Planned enhancements:

- additional interactive exhibits
- side-by-side algorithm comparisons
- persistent trace history
- exportable simulation traces
- challenge / quiz mode
- optional AI educational assistant

---

# Resume Summary

Built AlgoMuseum, a cinematic interactive systems museum that visualizes real-world algorithms through backend-driven simulation engines, deterministic API state transitions, and premium motion-based frontend experiences.

---

# Live Demo

https://algomuseum.vercel.app/

---

# License

MIT
