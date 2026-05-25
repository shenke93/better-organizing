# 🏠 HomeStorage (家庭收纳)

HomeStorage is a fast, privacy-focused, offline-first home inventory manager designed to help you organize your living spaces, track stock quantities, and stay ahead of item expiration dates. 

Built with **React**, **Vite**, and **Dexie.js (IndexedDB)**, it provides a premium, responsive, and entirely local-first experience with a sleek **Google Material Design 3** visual overhaul.

---

## ✨ Core Features

*   **⚡ Step-by-Step Quick Add Wizard**: Add items to your inventory in seconds through a 5-step interactive flow (Name ➔ Category ➔ Quantity/Unit ➔ Storage Spot ➔ Expiry/Save) with preset offset buttons (+3 days, +1 week, +1 month).
*   **📊 Dynamic Stats Dashboard**: View item distribution charts, track items that are expiring soon, and get alerts for low-stock essentials immediately upon opening the app.
*   **🗂️ Visual Space & Shelf Planner**: Manage rooms/areas (Places) and nested storage containers (Fridges, Closets, Cabinets) with collapsible M3 cards.
*   **🔒 Privacy-First & Local-First**: All data is persisted directly inside your browser using IndexedDB. No accounts, no internet connection, and no third-party tracking required.
*   **💾 Import & Export Backups**: Easily download your database as a standard JSON backup or restore past data (fully compatible with historical *InStock* database exports).
*   **🌐 Fluent Dual-Language Support**: Fully dynamic interface toggle between English and Simplified Chinese (简体中文).
*   **🎨 Premium Material Design 3 Overhaul**: Elegant capsule navs, outline text fields, pill-shaped buttons, and elevated solid plates supporting both clean **Light Mode** and rich **Dark Mode**.

---

## 🛠️ Technology Stack

*   **Framework**: React 19 + React Router 7
*   **Build Tool**: Vite 5
*   **Database**: Dexie.js (IndexedDB wrapper)
*   **Styling**: Vanilla CSS with custom Material Design 3 Design Tokens
*   **Icons**: Lucide React
*   **Localization**: i18next + react-i18next
*   **Charts**: Recharts

---

## 🚀 Quick Start

### Prerequisites
*   Node.js (version 18 or above recommended)
*   npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/better-organizing.git
   cd better-organizing
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server with hot module reloading (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
Compile and minify the project for deployment:
```bash
npm run build
```
The output will be saved inside the `/dist` directory, ready to be served statically on GitHub Pages, Vercel, Netlify, or any static provider.

---

## 📋 Changelog

Please refer to the complete [CHANGELOG.md](./CHANGELOG.md) to view the history and details of all releases:
*   **v1.2.0**: Material Design 3 Style Overhaul, Welcome Onboarding Overlay, Auto-Initialize default rooms, and dismissible Guiding Boards.
*   **v1.1.0**: Quick Add Wizard, 3-tab Mobile Bottom Navigation, collapsible Inventory filter sheets.
*   **v1.0.0**: Initial release featuring local database layers, Settings layouts, and English/Chinese translation dictionaries.
