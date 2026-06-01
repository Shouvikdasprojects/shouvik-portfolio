# Shouvik Das | Modern 3D Portfolio Website

> A high-performance, immersive 3D personal portfolio and digital content creator showcase. Pegged strictly to Indian Standard Time (IST) with hardware-accelerated visuals and automated live data integration.

---

## 🌟 Core Features

This website utilizes cutting-edge web design languages and state-of-the-art framework structures to offer a breathtaking, interactive developer experience:

*   **Interactive 3D Elements:** Powered by **Three.js** and **React Three Fiber (R3F)** to render an additive volumetric cosmic starfield featuring 3,500 particles, Z-axis travel camera controls, and mouse-parallax viewport rotations.
*   **Ultra-Modern Glassmorphic UI:** Crafted using high-fidelity Tailwind CSS glassmorphic panel tokens, custom glow borders, smooth transitions, and deep backdrop blur filter effects (`backdrop-blur-md`).
*   **Live Indian Standard Time (IST) Digital Clock:** Pegged strictly to the `Asia/Kolkata` (IST) timezone using standard internationalization formatting, equipped with neon pink glow drop-shadows and real-time pulsing status signals.
*   **Fully Responsive & Fluid Animations:** Staggered revealing heading load-ins, mouse-parallax tilt frames, and premium interactive hover effects powered by **Framer Motion**.
*   **Functional Resume Download System:** Structured direct-routing links pointing seamlessly to root-level static assets (`/Shouvik_Das_Resume.pdf`) to prompt instant download dialogues.

---

## 🛠️ Tech Stack

*   **Core Framework:** Next.js (App Router with ISR static route revalidations)
*   **Core Logic:** React, TypeScript
*   **3D Graphics Layer:** Three.js, React Three Fiber (R3F), `@react-three/drei`
*   **Aesthetics & Styles:** Tailwind CSS, Vanilla CSS CSS-in-JS Tokens
*   **Motion & Physics:** Framer Motion (Spring-based physics engines)
*   **Icons & Assets:** Lucide React, SVG Custom Path vectors

---

## 🚀 Getting Started

Follow these steps to run a copy of the portfolio locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v18.x or above) installed on your system.

### 1. Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/shouvik-portfolio.git

# Navigate into the project folder
cd shouvik-portfolio

# Install required packages
npm install
```

### 2. Run the Development Server

Start the local server using standard Next.js dev commands:

```bash
# Fire up local development environment
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to view the application.

---

## 📦 Production Builds & Verification

To verify that all production static page routes compile successfully, execute the Next.js production bundler:

```bash
# Compile and build production optimized assets
npm run build

# Start the compiled production app locally
npm run start
```
