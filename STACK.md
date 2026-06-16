# React + TypeScript + Vite Project Starter

A modern web application boilerplate built with React, TypeScript, and Vite, featuring Tailwind CSS v4, Shadcn UI components, and a robust state management and routing architecture.

## 🚀 Tech Stack

- **Frontend Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Routing:** React Router DOM
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query + Axios

---

## 🛠️ Installation & Setup

Follow these steps to set up the project locally.

### Step 1: Clone and Initialize Project
Create the Vite project template and install the core dependencies.
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Styling & Path Alias Dependencies
Install Tailwind CSS v4 and the Node types required for configuring path aliases (e.g., `@/*`).
```bash
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
```

### Step 3: Initialize Shadcn UI
Set up the component library infrastructure.
```bash
npx shadcn@latest init
```

### Step 4: Install UI Components
Add the essential Shadcn UI components to your project.
```bash
# Layout & Basic Inputs
npx shadcn@latest add button input label table badge dialog

# Navigation & Forms
npx shadcn@latest add dropdown-menu select form card sonner

# Structure & Pagination
npx shadcn@latest add pagination separator sheet
```

> 💡 **Tip:** To add more components later, run:
> ```bash
> npx shadcn@latest add {component-name}
> ```

### Step 5: Install Architecture & State Dependencies
Install libraries for routing, API fetching, global state, and form handling.
```bash
# Routing & HTTP Client
npm install axios react-router-dom

# State Management & Data Fetching
npm install @tanstack/react-query zustand

# Form Validation
npm install react-hook-form @hookform/resolvers zod
```

---

## 💻 Development

To start the local development server:
```bash
npm run dev
```

To build the project for production:
```bash
npm run build
```