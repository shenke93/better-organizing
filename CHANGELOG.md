# Changelog

All notable changes to the **HomeStorage** (formerly *InStock*) project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.2.0] — 2026-05-25

### Added
- **Workflow Safeguards & First-Time Onboarding**:
  - **Auto-Initialize Defaults**: Introduced a "Welcome to HomeStorage" onboarding popover that auto-populates standard places (Kitchen, Living Room, Bedroom, Bathroom) and standard storage spots (Fridge, Pantry, Bookshelf, etc.) in a single click, allowing instant cataloging.
  - **Setup Required Blocker**: Users with no storage locations are elegantly guided with a safeguard blocker card when attempting to add items, providing clear options to quick-initialize or set up room structures manually.
  - **Dismissible Guiding Boards**: Integrated modern top-aligned dismissible instruction cards on all major pages (Dashboard, Add, Inventory, Locations, Settings) detailing page functionalities. Stored dismissed states persistently.
- **Google Material Design 3 Style Overhaul**:
  - **Color Palette & Typography**: Overhauled light and dark palettes to match Google Boq / MD3 guidelines (vibrant primary blue `#1a73e8` / `#8ab4f8`, elevated solid plates, and custom Outfit / Roboto typography).
  - **Outline Inputs & Pill Buttons**: Customized form elements, select fields, and buttons to use Outline Material styling, capsule/pill actions, and interactive hover tints.
  - **Capsule Navigation Highlights**: Restyled active/hover items inside the Desktop Sidebar and Mobile Bottom Sheet to use capsule-shaped Material selection pills.

---

## [1.1.0] — 2026-05-24

### Added
- **Step-by-Step Quick Add Wizard**: Added a highly interactive `QuickAddWizard` component to make daily item entry extremely effortless. It splits form entry into 5 simple single-question panels:
  1. Name & Subcategory
  2. Category Picker (giant touchable cards)
  3. Quantity increment/decrement circles & units
  4. Cascading Location Picker
  5. Review, optional quick date offsets (+3 days, +7 days, +30 days), notes, tags, and summary saving.
- **Wizard Mode Switcher**: Added a persistent mode switcher tab at the top of the Add and Edit item pages to toggle between the interactive *⚡ Quick Add* wizard and the *📋 Full Form*, storing the choice in `localStorage`.
- **Primary/Secondary Nav Redesign**:
  - **Mobile Layout**: Streamlined bottom navigation down to exactly 3 items: *Dashboard*, *Quick Add circular FAB*, and a *More* option that pulls up a premium glassmorphic slide-up overlay sheet to access other links.
  - **Desktop Layout**: Redesigned the sidebar to display *Dashboard* and *Add Item* prominently at the top, grouping management links (*Inventory*, *Locations*, *Settings*) under a muted secondary footer.
- **Collapsible Filter Panel**: Refined the Inventory page toolbar to hide advanced dropdowns and filter chips behind a single *SlidersHorizontal* filters toggle icon by default.
- **Default Collapsed Places**: Place cards in the Location page now render collapsed by default to minimize visual noise. Clicking on a room card smoothly expands its nested shelves list.
- **Import Backwards Compatibility**: Enabled the backup restoration module to read old `InStock` backups and automatically transition them to `HomeStorage` records.

### Changed
- **Branding Renaming**: Rebranded the app to **HomeStorage** (`家庭收纳` in Simplified Chinese), updating translations, documents, backups, and title elements.

---

## [1.0.0] — 2026-05-24

### Added
- **Initial Release**: Launched InStock offline-first React single-page app.
- **Persistent DB Layer**: Configured Dexie.js IndexedDB local schema database.
- **UI Kit**: ProgrammedButtons, Inputs, Modals, Toast notifications.
- **Layout Shell**: Designed collapsible Sidebars and Bottom bars.
- **Translations (i18n)**: Implemented dual language configurations (English + Chinese).
- **Core Pages**: Dashboard (with recharts donut category share), Inventory, Locations tree view, Settings page.
