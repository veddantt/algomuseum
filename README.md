## [AlgoMuseum](https://github.com/veddantt/algomuseum)

**AlgoMuseum** is a high-end, interactive educational platform designed to visualize complex algorithms through a "cinematic" museum-like experience. Built with a focus on **system reasoning** and **premium UI**, it transforms dry technical concepts into immersive, glassmorphic exhibits.

---

### 🎨 Design Philosophy
The project departs from traditional "technical checklist" dashboards in favor of:
* **Cinematic UI:** A dark-themed, typography-driven aesthetic inspired by [linear.app](https://linear.app).
* **Glassmorphism:** Deep layering using `GlassPanel` components to create a sense of physical depth.
* **Exhibit-Based Learning:** Algorithms are presented as "exhibits" rather than just code snippets, emphasizing request flows and bottlenecks.

### 🛠️ Tech Stack
* **Frontend:** [React](https://react.dev/) / [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) for real-time visualization state.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom glassmorphic utilities.
* **Animation:** [Framer Motion](https://www.framer.com/motion/) for fluid exhibit transitions.

### 🏛️ Features
* **Museum Shell:** A custom-built UI shell that houses different algorithm visualizations.
* **Interactive Visualizers:** Real-time request flow simulations (e.g., Distributed Systems, Sorting, Pathfinding).
* **Product Thinking:** Focuses on *why* an algorithm is used and the specific problems it solves, rather than just the implementation details.

### 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/veddantt/algomuseum.git](https://github.com/veddantt/algomuseum.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **View the exhibit:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

**Author:** [Vedant Patel](https://github.com/veddantt)
**Deployment:** Live at [algomuseum.vercel.app](https://algomuseum.vercel.app/)
