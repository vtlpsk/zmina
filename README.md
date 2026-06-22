# Zmina 🗓️

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Style](https://img.shields.io/badge/Style-Vanilla%20CSS-1572B6?style=flat-square&logo=css3&logoColor=white)](src/index.css)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A modern, high-fidelity mobile-first web application designed for seamless shift planning and staff scheduling. Built with a premium **"Liquid Glass"** visual aesthetic, smooth animations, and optimized mobile-first user flows.

---

## ✨ Features

The application incorporates a role simulation switcher, enabling instant testing of two distinct user views:

### 💼 Manager Dashboard
* **Real-time "Who's Working Today" (Daily Overview):**
  * Live snapshot of staff currently on shift with custom green glow status indicators.
  * Abstract visual timelines mapping the exact duration and position of shifts across a 24-hour scale.
* **Smart Calendar Scheduling:**
  * Interactive monthly planner with automated total monthly shifts and total hours calculation.
  * Animated pulsing "Today" indicator for effortless time navigation.
  * Adaptive shift presets (*Morning*, *Full-Day*, *Evening*, *Off-Duty*) alongside custom time pickers and notes.
* **Staff Directory Management:**
  * Quick panel to add new employees, assign roles, or remove personnel with confirmation prompts.

### 👤 Worker Dashboard
* **Personal Schedule Snapshot:**
  * Dynamic welcome greeting with a real-time tally of monthly shifts and cumulative work hours.
* **Visual Monthly Calendar:**
  * At-a-glance color-coded schedule: active working days marked in green, off-days transparent.
* **Detailed Shift Cards:**
  * Clean context cards showing work status, hours, and manager notes for the selected day.
  * Native localized full-day names (e.g., *Wednesday* instead of abbreviations like *Wed*) for optimal readability.

---

## 🛠️ Tech Stack

* **Core Framework:** [React 18](https://react.dev/)
* **Build System:** [Vite](https://vite.dev/)
* **Styling System:** Vanilla CSS featuring Backdrop Filters (Glassmorphism), Flexbox, & CSS Grid
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) installed (LTS recommended).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vtlpsk/zmina.git
   cd zmina
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open the local address shown in your terminal (typically `http://localhost:5173`).

---

## 🎨 Design Philosophy

Zmina's UI is built on the **Liquid Glass** architecture:
* **Translucency:** Uses CSS variable `backdrop-filter: blur(24px)` combined with semi-transparent background colors for a layered, three-dimensional depth.
* **Micro-interactions:** Interactive components leverage delicate animations such as scale transitions on click and pulsing markers (`@keyframes pulse-dot`).
* **Optimized Badges:** Separate visual groups for shift counts (subtle green theme) and total hours (translucent ice-blue theme) to lower cognitive load.
