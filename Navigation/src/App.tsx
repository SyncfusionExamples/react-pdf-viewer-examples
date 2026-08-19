import React, { useMemo, useRef, useState } from 'react';
import {
  BookmarkView,
  Inject,
  LinkAnnotation,
  Magnification,
  Navigation,
  PdfViewerComponent,
  Print,
  TextSearch,
  TextSelection,
  ThumbnailView,
  Toolbar,
} from '@syncfusion/ej2-react-pdfviewer';

const SAMPLE_PDF = 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf';
const RESOURCE_URL = 'https://cdn.syncfusion.com/ej2/34.2.3/dist/ej2-pdfviewer-lib';

interface BookmarkItem {
  id: string;
  title: string;
  pageIndex: number;
  y: number;
  depth: number;
}

interface BookmarkResult {
  bookmarks?: { bookMark?: BookmarkItem[]; bookmark?: BookmarkItem[]; BookMark?: BookmarkItem[] };
  Bookmarks?: { bookMark?: BookmarkItem[]; bookmark?: BookmarkItem[]; BookMark?: BookmarkItem[] };
  bookmarksDestination?: Record<string, { PageIndex?: number; pageIndex?: number; Y?: number; y?: number }>;
  BookmarksDestination?: Record<string, { PageIndex?: number; pageIndex?: number; Y?: number; y?: number }>;
  [key: string]: unknown;
}

function normalizeBookmarkResult(result: unknown): BookmarkItem[] {
  if (!result) return [];

  const typedResult = result as BookmarkResult;
  const bookmarkRoot = typedResult.bookmarks ?? typedResult.Bookmarks;
  const roots =
    bookmarkRoot?.bookMark ??
    bookmarkRoot?.bookmark ??
    bookmarkRoot?.BookMark ??
    bookmarkRoot ??
    (Array.isArray(result) ? result : []);
  const destinationRoot = typedResult.bookmarksDestination ?? typedResult.BookmarksDestination ?? {};
  const destinations =
    destinationRoot.bookMarkDestination ??
    destinationRoot.bookmarkDestination ??
    destinationRoot.BookMarkDestination ??
    destinationRoot;

  const flattened: BookmarkItem[] = [];

  function visit(nodes: unknown, depth: number = 0): void {
    if (!Array.isArray(nodes)) return;

    nodes.forEach((node: unknown, index: number) => {
      const typedNode = node as Record<string, unknown>;
      const id = typedNode.Id ?? typedNode.id ?? typedNode.BookmarkId ?? index;
      const destination = (destinations as Record<string, unknown>)?.[Number(id)] ?? 
        (destinations as Record<string, unknown>)?.[id as string] ?? 
        typedNode.destination ?? 
        typedNode.Destination ?? 
        {};
      const destinationTyped = destination as Record<string, unknown>;
      const pageIndex =
        destinationTyped.PageIndex ?? destinationTyped.pageIndex ?? typedNode.PageIndex ?? typedNode.pageIndex;
      const y = destinationTyped.Y ?? destinationTyped.y ?? typedNode.Y ?? typedNode.y ?? 0;

      flattened.push({
        id: `${depth}-${id}-${flattened.length}`,
        title: (typedNode.Title ?? typedNode.title ?? typedNode.Text ?? typedNode.text ?? `Bookmark ${flattened.length + 1}`) as string,
        pageIndex: Number(pageIndex),
        y: Number(y),
        depth,
      });

      visit(typedNode.Child ?? typedNode.child ?? typedNode.Children ?? typedNode.children, depth + 1);
    });
  }

  visit(roots);
  return flattened.filter((bookmark) => Number.isFinite(bookmark.pageIndex));
}

export default function App() {
  const viewerRef = useRef<PdfViewerComponent>(null);
  const [pageNumber, setPageNumber] = useState<string>('1');
  const [searchText, setSearchText] = useState<string>('PDF');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedBookmark, setSelectedBookmark] = useState<string>('');
  const [status, setStatus] = useState<string>('Loading the sample PDF…');
  const [isBookmarkPaneOpen, setIsBookmarkPaneOpen] = useState<boolean>(false);
  const [isStatusVisible, setIsStatusVisible] = useState<boolean>(true);
  const [isMatchCase, setIsMatchCase] = useState<boolean>(false);

  const selectedBookmarkData = useMemo(
    () => bookmarks.find((item) => item.id === selectedBookmark),
    [bookmarks, selectedBookmark],
  );

  const viewer = (): PdfViewerComponent | null => viewerRef.current;

  function updatePageStatus(): void {
    const instance = viewer();
    if (!instance) return;
    setPageNumber(String(instance.currentPageNumber || 1));
    setStatus(`Page ${instance.currentPageNumber || 1} of ${instance.pageCount || 0}`);
  }

  function retrieveBookmarks(): void {
    const result = viewer()?.bookmark?.getBookmarks();
    const items = normalizeBookmarkResult(result);
    setBookmarks(items);
    setSelectedBookmark(items[0]?.id ?? '');
    setStatus(
      items.length
        ? `${items.length} bookmark${items.length === 1 ? '' : 's'} retrieved.`
        : 'This PDF does not expose any navigable bookmarks.',
    );
  }

  function goToSelectedBookmark(): void {
    if (!selectedBookmarkData) {
      setStatus('Retrieve and select a bookmark first.');
      return;
    }

    viewer()?.bookmark?.goToBookmark(
      selectedBookmarkData.pageIndex,
      selectedBookmarkData.y,
    );
    setStatus(`Navigated to "${selectedBookmarkData.title}".`);
  }

  function goToPage(): void {
    const requestedPage = Number(pageNumber);
    if (!Number.isInteger(requestedPage) || requestedPage < 1) {
      setStatus('Enter a valid page number starting from 1.');
      return;
    }
    viewer()?.navigation?.goToPage(requestedPage);
  }

  function startSearch(): void {
    const term = searchText.trim();
    if (!term) {
      setStatus('Enter text to search for.');
      return;
    }
    viewer()?.textSearch?.searchText(term, isMatchCase);
    setStatus(`Searching for "${term}"${isMatchCase ? ' (case-sensitive)' : ''}.`);
  }

  function toggleBookmarkPane(): void {
    if (isBookmarkPaneOpen) {
      viewer()?.bookmark?.closeBookmarkPane();
      setIsBookmarkPaneOpen(false);
      setStatus('Bookmark panel closed.');
    } else {
      viewer()?.bookmark?.openBookmarkPane();
      setIsBookmarkPaneOpen(true);
      setStatus('Bookmark panel opened.');
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Syncfusion React PDF Viewer</p>
          <h1>Programmatic navigation POC</h1>
          <p className="intro">
            Navigate by page, bookmark destination, or text-search result using a custom React UI.
          </p>
        </div>
        <a href="https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/overview" target="_blank" rel="noreferrer">
          Product documentation
        </a>
      </header>

      <section className="control-grid" aria-label="Programmatic PDF controls">
        <article className="control-card">
          <span className="step">01</span>
          <h2>Page navigation</h2>
          <div className="button-row">
            <button onClick={() => viewer()?.navigation?.goToPreviousPage()}>Previous</button>
            <button onClick={() => viewer()?.navigation?.goToNextPage()}>Next</button>
          </div>
          <div className="field-row">
            <label htmlFor="pageNumber">Page</label>
            <input id="pageNumber" type="number" min="1" value={pageNumber} onChange={(event) => setPageNumber(event.target.value)} />
            <button className="primary" onClick={goToPage}>Go</button>
          </div>
        </article>

        <article className="control-card">
          <span className="step">02</span>
          <h2>Bookmark location</h2>
          <div className="button-row">
            <button onClick={retrieveBookmarks}>Retrieve bookmarks</button>
            <button onClick={toggleBookmarkPane}>{isBookmarkPaneOpen ? 'Close panel' : 'Open panel'}</button>
          </div>
          <div className="field-row bookmark-row">
            <label htmlFor="bookmark">Destination</label>
            <select id="bookmark" value={selectedBookmark} onChange={(event) => setSelectedBookmark(event.target.value)}>
              <option value="">Select a bookmark</option>
              {bookmarks.map((bookmark) => (
                <option key={bookmark.id} value={bookmark.id}>
                  {'— '.repeat(bookmark.depth)}{bookmark.title}
                </option>
              ))}
            </select>
            <button className="primary" onClick={goToSelectedBookmark}>Navigate</button>
          </div>
        </article>

        <article className="control-card">
          <span className="step">03</span>
          <h2>Search results</h2>
          <div className="field-row">
            <label htmlFor="searchText">Find</label>
            <input id="searchText" value={searchText} onChange={(event) => setSearchText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && startSearch()} />
            <button className="primary" onClick={startSearch}>Search</button>
          </div>
          <div className="checkbox-row">
            <input 
              id="matchCase" 
              type="checkbox" 
              checked={isMatchCase}
              onChange={(event) => {
                console.log('Checkbox changed:', event.target.checked);
                setIsMatchCase(event.target.checked);
              }}
            />
            <label htmlFor="matchCase">Match case</label>
          </div>
          <div className="button-row">
            <button onClick={() => viewer()?.textSearch?.searchPrevious()}>Previous result</button>
            <button onClick={() => viewer()?.textSearch?.searchNext()}>Next result</button>
            <button onClick={() => viewer()?.textSearch?.cancelTextSearch()}>Clear</button>
          </div>
        </article>

        <article className="control-card compact">
          <span className="step">04</span>
          <h2>Presentation view</h2>
          <div className="button-row">
            <button onClick={() => viewer()?.magnification?.fitToPage()}>Fit page</button>
            <button onClick={() => viewer()?.magnification?.fitToWidth()}>Fit width</button>
            <button onClick={() => viewer()?.magnification?.zoomOut()}>−</button>
            <button onClick={() => viewer()?.magnification?.zoomIn()}>+</button>
          </div>
        </article>
      </section>

      {isStatusVisible && (
        <div className="status" role="status">
          <span>{status}</span>
          <button className="close-btn" onClick={() => setIsStatusVisible(false)} aria-label="Close status message">
            ✕
          </button>
        </div>
      )}

      <section className="viewer-frame" aria-label="PDF document viewer">
        <PdfViewerComponent
          ref={viewerRef}
          id="pdf-viewer"
          documentPath={SAMPLE_PDF}
          resourceUrl={RESOURCE_URL}
          style={{ height: '760px' }}
          enableBookmark
          enableNavigation
          enableTextSearch
          documentLoad={() => {
            updatePageStatus();
            setTimeout(retrieveBookmarks, 200);
          }}
          pageChange={updatePageStatus}
          documentLoadFailed={(args: unknown) => {
            const typedArgs = args as Record<string, unknown> | undefined;
            setStatus(`Unable to load the PDF: ${typedArgs?.message ?? 'unknown error'}`);
          }}
        >
          <Inject services={[
            Toolbar,
            Magnification,
            Navigation,
            LinkAnnotation,
            BookmarkView,
            ThumbnailView,
            Print,
            TextSelection,
            TextSearch,
          ]} />
        </PdfViewerComponent>
      </section>
    </main>
  );
}
