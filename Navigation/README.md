# React PDF Viewer Sample

A React + TypeScript proof-of-concept that demonstrates **programmatic navigation** in a PDF using the [Syncfusion React PDF Viewer](https://www.syncfusion.com/pdf-viewer-sdk/react-pdf-viewer) component. The app loads a sample PDF from Syncfusion's CDN and exposes a custom control panel for jumping between pages, navigating to bookmarks, and running text searches.

---

## ✨ Features

| Capability | How it works |
|---|---|
| **Page navigation** | Go to previous / next page, or jump to a specific page number. |
| **Bookmark navigation** | Retrieve all PDF bookmarks, open / close the bookmark panel, and jump to a selected destination. |
| **Text search** | Search the document for a term (with optional match-case), then move to the next or previous result. |
| **Zoom controls** | Fit to page, fit to width, zoom in, and zoom out. |

---

## 📋 Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

> Verify your environment:
> ```bash
> node --version
> npm --version
> ```

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open it in your browser to see the PDF viewer.

### 3. Build for production

```bash
npm run build
```

The optimized output is written to the `dist/` folder.

### 4. Preview the production build locally

```bash
npm run preview
```

## 🧩 Project structure

```
pdf-viewer-app/
├── index.html              # Vite entry HTML
├── package.json            # Scripts and dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig*.json          # TypeScript configuration
├── public/                 # Static assets served as-is
└── src/
    ├── main.tsx            # React root bootstrap (StrictMode)
    ├── App.tsx             # PDF viewer + custom control panel
    ├── App.css             # Layout and styling for the control grid
    ├── index.css           # Global styles
    └── assets/             # Local assets
```

---

## 🔍 How the sample works

1. **`src/main.tsx`** mounts the React app inside `#root` using `StrictMode`.
2. **`src/App.tsx`** renders the `PdfViewerComponent` from `@syncfusion/ej2-react-pdfviewer` and wires up:
   - A custom **control grid** with page, bookmark, search, and zoom controls.
   - A **status banner** that reflects the latest action (e.g. *"5 bookmarks retrieved"*).
   - **Event handlers** for `documentLoad`, `pageChange`, and `documentLoadFailed`.

### Key Syncfusion APIs demonstrated

| API | Purpose |
|---|---|
| `viewer.navigation.goToPage(n)` | Jump to a specific page |
| `viewer.navigation.goToNextPage()` / `goToPreviousPage()` | Step through pages |
| `viewer.bookmark.getBookmarks()` | Retrieve the bookmark tree |
| `viewer.bookmark.goToBookmark(pageIndex, y)` | Jump to a bookmark destination |
| `viewer.bookmark.openBookmarkPane()` / `closeBookmarkPane()` | Toggle the bookmark panel |
| `viewer.textSearch.searchText(term, isMatchCase)` | Run a text search |
| `viewer.textSearch.searchNext()` / `searchPrevious()` | Move between matches |
| `viewer.magnification.fitToPage()` / `fitToWidth()` / `zoomIn()` / `zoomOut()` | Adjust the view |

The sample PDF and viewer resources are loaded from Syncfusion's public CDN:

```ts
const SAMPLE_PDF    = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';
const RESOURCE_URL  = 'https://cdn.syncfusion.com/ej2/34.2.3/dist/ej2-pdfviewer-lib';
```

---

## 🔗 Useful links

- [Syncfusion React PDF Viewer — Overview](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/overview)
- [Syncfusion React PDF Viewer — API reference](https://ej2.syncfusion.com/react/documentation/api/pdfviewer)

