<div align="center">

# ✨ PROMPT-ENHANCER

![PROMPT-ENHANCER Thumbnail](https://raw.githubusercontent.com/panduthegang/Prompt-Enhancer/main/public/Thumbnail.jpg)

**The bridge between human chaos and machine precision.**

Transform raw voice rants, messy thoughts, and Hinglish inputs into structured, token-efficient AI prompts.

[![Live Demo](https://img.shields.io/badge/▶_LIVE_DEMO-000000?style=for-the-badge)](https://prompt-enhancer-by-harsh.vercel.app/)
[![GitHub](https://img.shields.io/badge/SOURCE_CODE-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/panduthegang/Prompt-Enhancer)

</div>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | Component-driven UI with hooks and context |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | End-to-end type safety |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Utility-first styling engine |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Lightning-fast dev server and build tool |
| ![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white) | Authentication (Email + Google) & Firestore Database |
| ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white) | AI-powered intent detection and prompt optimization |
| ![Framer Motion](https://img.shields.io/badge/Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | Fluid page transitions and micro-animations |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Production deployment and edge hosting |

</div>

---

## ✨ Features

- **🎙 Voice-to-Prompt** — Integrated Web Speech API captures messy voice rants in real-time
- **🧠 AI Intent Decomposition** — Gemini extracts Task, Domain, Audience, Constraints, and Output Format
- **⚡ Token Optimization** — Minimizes token usage while maximizing prompt clarity and precision
- **📂 Real-Time History** — Firestore-powered prompt history with live `onSnapshot` sync
- **🔒 Per-User Data Isolation** — Secure subcollection architecture ensures complete privacy
- **⭐ Favorites System** — Star your best prompts for quick access with optimistic UI updates
- **🗑 Delete Support** — Remove prompts from history instantly
- **🌐 Multilingual Input** — Works with Hinglish, Hindi, and English
- **🎨 Brutalist-Luxury UI** — Minimalist, boxy aesthetic with custom scrollbars and smooth transitions
- **📱 Fully Responsive** — Optimized for desktop, tablet, and mobile devices

---

## 📁 Project Structure

```
Prompt-Enhancer/
│
├── public/                          # Static assets
│   ├── Hero-1.png                   # Landing page hero background
│   ├── Thumbnail.jpg                # Social media preview image
│   └── favicon.svg                  # Custom sparkles favicon
│
├── src/
│   ├── App.tsx                      # Root component — routing, guards, layout
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles, design tokens, scrollbar
│   ├── types.ts                     # Shared TypeScript interfaces
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx          # Marketing landing page with hero section
│   │   ├── SignIn.tsx               # Email/Google sign-in form
│   │   ├── SignUp.tsx               # Email/Google registration form
│   │   └── Workspace.tsx            # Main app — prompt input, processing, history
│   │
│   ├── components/
│   │   ├── WorkspaceHeader.tsx      # Top nav with user profile and logout
│   │   ├── PromptInput.tsx          # Text input area with voice recording
│   │   ├── WorkflowVisualizer.tsx   # Step progress indicator (Idle → Detect → Enhance)
│   │   ├── ProcessingStates.tsx     # Detecting, Confirming, and Enhancing UI states
│   │   ├── PromptResult.tsx         # Final optimized prompt display with copy
│   │   ├── InspirationGrid.tsx      # Quick-start prompt suggestion cards
│   │   ├── HistoryLogs.tsx          # Searchable, filterable prompt history log
│   │   ├── AuthVisuals.tsx          # Animated visuals for auth pages
│   │   └── ui/                      # Reusable primitives (Dialog, Button, etc.)
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx              # Firebase auth context (sign in/up/out)
│   │   └── useSpeechRecognition.ts  # Web Speech API wrapper hook
│   │
│   ├── services/
│   │   ├── geminiService.ts         # Gemini API calls (intent + enhancement)
│   │   └── promptService.ts         # Firestore CRUD for prompt history
│   │
│   └── lib/
│       ├── firebase.ts              # Firebase app initialization and exports
│       └── utils.ts                 # Utility functions (cn classname merger)
│
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore composite indexes
├── index.html                       # HTML entry with SEO + OG meta tags
├── vite.config.ts                   # Vite configuration
├── vercel.json                      # Vercel SPA rewrite config
└── .env                             # Environment variables (not committed)
```

---

## 🔄 How It Works

### Authentication Flow

```
User opens app
  │
  ▼
Firebase Auth (onAuthStateChanged)
  │
  ├── Authenticated ──► Workspace
  └── Not Authenticated ──► Sign In / Sign Up
```

### Prompt Enhancement Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INPUT                               │
│  Type a prompt or use voice recording (Web Speech API)           │
│  Supports: English, Hindi, Hinglish                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                 PHASE 1 — INTENT DETECTION                       │
│                                                                  │
│  Raw input ──► Google Gemini API                                 │
│                                                                  │
│  Gemini returns structured JSON:                                 │
│    • Task         (what to do)                                   │
│    • Domain       (industry/field)                               │
│    • Category     (image gen, coding, marketing, etc.)           │
│    • Constraints  (specific rules/limitations)                   │
│    • Audience     (who is this for)                               │
│    • Output Format (markdown, code, bullet points, etc.)         │
│                                                                  │
│  ──► User reviews and confirms the detected intent               │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                   User confirms ✓
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│               PHASE 2 — PROMPT OPTIMIZATION                      │
│                                                                  │
│  Decomposed intent ──► Google Gemini API                         │
│                                                                  │
│  Gemini generates:                                               │
│    • Optimized, token-efficient prompt (Markdown)                │
│    • Original vs optimized token count                           │
│                                                                  │
│  ──► User can copy the final prompt                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE                                   │
│                                                                  │
│  Prompt saved to Firestore:  users/{uid}/prompts/{promptId}      │
│                                                                  │
│  Real-time onSnapshot listener auto-updates the history UI       │
│  User can: ⭐ Favorite  │  🗑 Delete  │  🔍 Search & Filter      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Google Cloud** account (for Gemini API)
- A **Firebase** project (for Auth + Firestore)

### 1. Clone & Install

```bash
git clone https://github.com/panduthegang/Prompt-Enhancer.git
cd Prompt-Enhancer
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# ──────────────── Gemini AI ────────────────
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ──────────────── Firebase ─────────────────
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Connect Google Gemini

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **"Get API Key"** → Create a new key
3. Copy the key and paste it as `VITE_GEMINI_API_KEY` in your `.env`

### 4. Firebase Setup

#### a) Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** → Follow the wizard
3. Enable **Authentication** → Turn on **Email/Password** and **Google** sign-in methods
4. Enable **Cloud Firestore** → Start in **production mode**
5. Go to **Project Settings** → **Your Apps** → Add a **Web App**
6. Copy the Firebase config values into your `.env`

#### b) Deploy Firestore Security Rules

Navigate to **Firestore → Rules** tab in the Firebase Console and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ┌─────────────────────────────────────────────┐
    // │  USER PROFILES                              │
    // │  Path: /users/{userId}                      │
    // │  Only the authenticated owner can access    │
    // └─────────────────────────────────────────────┘
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // ┌─────────────────────────────────────────────┐
    // │  PROMPT HISTORY (per-user subcollection)    │
    // │  Path: /users/{userId}/prompts/{promptId}   │
    // │  Complete data isolation between users      │
    // └─────────────────────────────────────────────┘
    match /users/{userId}/prompts/{promptId} {

      // READ: Only owner can read their own prompts
      allow read: if request.auth != null && request.auth.uid == userId;

      // CREATE: Owner only, with strict schema validation
      //   → Must contain all required fields
      //   → Field types are enforced (string, bool)
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.keys().hasAll(
                         ['original', 'optimized', 'category', 'isFavorite', 'createdAt']
                       )
                    && request.resource.data.original is string
                    && request.resource.data.optimized is string
                    && request.resource.data.category is string
                    && request.resource.data.isFavorite is bool;

      // UPDATE: Owner only, restricted to toggling favorites
      //   → Cannot modify original, optimized, category, or createdAt
      //   → Only the 'isFavorite' field can be changed
      allow update: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.diff(resource.data)
                         .affectedKeys().hasOnly(['isFavorite']);

      // DELETE: Owner only
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### c) Deploy Firestore Indexes

Navigate to **Firestore → Indexes** tab and create the following composite index:

| Setting | Value |
|---------|-------|
| **Collection ID** | `prompts` |
| **Query Scope** | `Collection` |
| **Field Path** | `createdAt` |
| **Sort Order** | `Descending` |

**Why is this needed?** The app queries prompts with `orderBy("createdAt", "desc")` combined with `limit(50)`. Firestore requires a composite index for sorted queries on subcollections. Without this index, the query will fail with a `FAILED_PRECONDITION` error.

<details>
<summary>📋 Or deploy via CLI (click to expand)</summary>

The `firestore.indexes.json` is already configured in the repository:

```json
{
  "indexes": [
    {
      "collectionGroup": "prompts",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deploy both rules and indexes in one command:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

</details>

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

---

## 🗄 Database Architecture

```
Cloud Firestore
│
└── users (collection)
    └── {userId} (document)
        ├── uid: string
        ├── username: string
        ├── email: string
        ├── photoURL: string | null
        ├── updatedAt: number
        │
        └── prompts (subcollection)
            └── {promptId} (document)
                ├── original: string        ← User's raw input
                ├── optimized: string       ← AI-enhanced prompt
                ├── category: string        ← Auto-detected category
                ├── isFavorite: boolean     ← Toggled by user
                └── createdAt: Timestamp    ← Server-generated
```

---

## 🚢 Deployment

The project is configured for **Vercel** out of the box:

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all `.env` variables in **Settings → Environment Variables**
4. Deploy — Vercel automatically detects Vite and builds accordingly

The `vercel.json` handles SPA routing rewrites:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

<div align="center">

## 🖤

**Crafted with precision by [Harsh Rathod](https://harshrathod-portfolio.vercel.app/)**

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://harshrathod-portfolio.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/harsh-rathod-2591b0292/)

</div>
