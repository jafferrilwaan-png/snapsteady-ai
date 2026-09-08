# ⚡ SnapSteady AI — On-Device Vision Camera Agent
> **Official Prototype for the iQOO Hackathon 2026**  
> *Flagship On-Device Vision Intelligence, Zero-Shake Optical Gyro Lock, and Autonomous Camera Agent Execution.*

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI%20Streaming-FF6F00?style=flat)](https://openrouter.ai/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🌟 Overview

**SnapSteady AI** is an interactive on-device computational photography system running within an ultra-realistic 3D iQOO smartphone chassis. It leverages real browser hardware APIs (`getUserMedia`, Web Speech API, Web Audio API, Canvas 2D Pixel Luminance Engine) alongside an OpenRouter streaming AI agent that autonomously executes hardware commands.

---

## 🚀 Core Features (100% Real Hardware APIs)

### 1. 🤖 Autonomous Vision Camera Agent
Control the camera through natural voice or typed commands:
- **📸 Auto-Capture & Cache**: `"take photo"`, `"capture"`, `"snap picture"` — grabs the live frame, triggers optical flash & mechanical shutter audio, and saves it into browser cache.
- **🔍 Hybrid Zoom**: `"zoom 2x"`, `"zoom in"`, `"zoom 4x"`, `"reset zoom"` — dynamically scales digital/optical zoom with instant live HUD feedback.
- **🎨 Pro LUT Filters**: `"cinematic filter"`, `"black and white"`, `"vivid HDR"`, `"night vision"`, `"cyberpunk"`.
- **🔄 Camera Flipping**: `"flip camera"`, `"switch to rear"`, `"selfie mode"`.
- **💡 Torch / Night Illumination**: `"torch on"`, `"flash"`.
- **🧠 Multimodal Scene Analysis**: `"what do you see?"`, `"analyze my composition"` — streams live intelligence from OpenRouter.

### 2. 📁 In-App Local Photo Cache & Gallery
- Offline-persistent photo cache using `localStorage` / `IndexedDB`.
- Built-in photo inspector to view full resolution, check LUX metadata & zoom level, and download `.jpg` files.

### 3. 🎯 Gyro-Stability Ring & Zero-Shake Lock
- Real-time orientation & device tilt calculations.
- Live horizon indicator (turns **#FFD600 Gold** when steady, **Red** when unstable).

### 4. 💡 Canvas Computer Vision Pixel Pipeline
- Offscreen 60fps `<canvas>` pixel engine computes real ambient LUX, brightness percentage, and color temperature in real time.

---

## 🛠️ Architecture & Tech Stack

```
SnapSteady AI
├── Hero Stage (AetherHero) ── Visible Artwork Background + Transparent Cloud Shader
├── Showcase Stage (ContainerScroll) ── 3D Scroll Perspective + Living Art Backdrop
│   └── 3D iQOO Smartphone Chassis (PhoneExperience)
│       ├── Hardware Camera (WebRTC getUserMedia)
│       ├── Pixel Analyzer (Canvas 2D Lux Engine)
│       ├── Live Pro Filters (CSS LUT Engine)
│       ├── Speech Interface (Web Speech API + Web Speech Synthesis)
│       ├── Autonomous Agent Intent Dispatcher (aiService.js)
│       └── In-App Photo Gallery Cache (photoCache.js)
└── Cinematic Footer ── Marquee Ticker + Quick Links
```

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js 18+
- Modern Web Browser with camera & microphone permissions (Chrome, Edge, Safari, Firefox)

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/snapsteady-ai.git
cd snapsteady-ai

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🚀 One-Click Vercel Deployment

This repository includes a pre-configured [`vercel.json`](./vercel.json):
1. Import this repository into [Vercel](https://vercel.com/new).
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Click **Deploy**!

---

## 📄 License
MIT License &copy; 2026 SnapSteady AI &middot; Built for the iQOO Hackathon.
