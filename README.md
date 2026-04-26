# DevTracker 2.0 🚀

DevTracker 2.0 is a modern developer portfolio and project tracking platform. It allows developers to showcase their work, track project status, and integrate directly with GitHub to import repositories.

## Features

- 🔐 **Secure Authentication**: Google and GitHub login via Firebase Auth.
- 🗂️ **Project Management**: Full CRUD operations for developer projects.
- 📊 **GitHub Integration**: Direct import of GitHub repositories with star tracking and language detection.
- 👤 **Dynamic Profiles**: Publicly shareable profiles showing bio, skills, and portfolio.
- 🧠 **Modern UI**: Built with React 19, Tailwind CSS 4, and shadcn/ui.
- ⚙️ **Full-Stack**: Express backend with Vite integration.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion, shadcn/ui.
- **Backend**: Node.js, Express.
- **Database/Auth**: Firebase (Firestore & Auth).
- **APIs**: GitHub REST API.

## Getting Started

1. **Prerequisites**: 
   - Node.js installed.
   - Firebase project set up.

2. **Environment Variables**:
   Create a `.env` file with:
   ```env
   GEMINI_API_KEY=your_key
   ```
   (Firebase config is loaded from `firebase-applet-config.json`)

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/components`: Reusable UI and business components.
- `src/hooks`: Custom React hooks (Auth, etc).
- `src/lib`: Services and utility functions.
- `src/pages`: Page components and routing.
- `server.ts`: Express server and API proxy.

## Security

Hardened Firestore Security Rules are implemented to ensure:
- Only owners can modify their projects/profiles.
- Public read access for portfolio items.
- Strict data validation using Firestore rules.

---
Built with ❤️ using Google AI Studio.
