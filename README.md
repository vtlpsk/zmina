# Zmina 🗓️

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Style](https://img.shields.io/badge/Style-Vanilla%20CSS-1572B6?style=flat-square&logo=css3&logoColor=white)](src/index.css)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A mobile-first web application for shift planning and staff scheduling.

---

## Features

The application includes a role switcher to test two different views:

### Manager Dashboard
* **Today's Overview:**
  * List of staff currently on shift with status indicators.
  * Visual timelines showing the duration and position of shifts across the day.
* **Calendar Scheduling:**
  * Monthly planner showing shifts and total work hours.
  * Today's date highlighted with a pulsing indicator.
  * Presets (Morning, Full-Day, Evening, Off) with custom time pickers and comments.
* **Staff Directory:**
  * Add new employees, assign roles, or remove staff with confirmation dialogs.

### Worker Dashboard
* **Schedule Snapshot:**
  * Total shifts and work hours for the month.
* **Monthly Calendar:**
  * Active working days highlighted in green, off-days left blank.
* **Shift Details:**
  * Shows working hours, roles, and manager comments for the selected day.
  * Displays full day-of-week names (e.g., Wednesday) for readability.

---

## Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** CSS (Flexbox, Grid)
* **Icons:** Lucide React

---

## Getting Started

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
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the address shown in the terminal (usually `http://localhost:5173`).
