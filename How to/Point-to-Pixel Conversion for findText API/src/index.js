import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  Annotation,
  TextSearch,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  const terms = ['book', 'from'];
  const pdfViewerRef = React.useRef(null);

  const handleDocumentLoad = () => {
    // Check periodically for text extraction to complete
    let retryCount = 0;
    const maxRetries = 20; // Maximum 10 seconds of checking

    const checkTextReady = () => {
      const viewer = pdfViewerRef.current;
      const textIsRendered = viewer?.textSearchModule?.isTextRetrieved;
      if (textIsRendered) {
        if (!viewer) return;

        if (viewer?.textSearchModule) {
          const results = viewer.textSearchModule.findText(terms, false);

          for (const key in results) {
            for (const match of results[key]) {
              if (match.bounds) {
                viewer.annotationModule.addAnnotation('Highlight', {
                  pageNumber: match.pageIndex + 1,
                  bounds: [
                    {
                      x: (match.bounds[0].x * 96) / 72,
                      y: (match.bounds[0].y * 96) / 72,
                      width: (match.bounds[0].width * 96) / 72,
                      height: (match.bounds[0].height * 96) / 72,
                    },
                  ],
                });
              }
            }
          }
        }
      } else if (retryCount < maxRetries) {
        // If text is not ready yet and we haven't exceeded max retries, check again
        retryCount++;
        setTimeout(checkTextReady, 500);
      } else {
        console.warn(
          'Text extraction timeout - giving up after',
          maxRetries,
          'attempts'
        );
      }
    };

    // Start checking after a brief initial delay
    setTimeout(checkTextReady, 200);
  };

  return (
    <div>
      <div className="control-section">
        <PdfViewerComponent
          ref={pdfViewerRef}
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/25.1.35/dist/ej2-pdfviewer-lib"
          extractTextCompleted={handleDocumentLoad}
          height="640px"
        >
          {/* Inject the required services */}
          <Inject
            services={[
              Toolbar,
              Magnification,
              Navigation,
              Annotation,
              LinkAnnotation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
              FormFields,
              FormDesigner,
              PageOrganizer,
            ]}
          />
        </PdfViewerComponent>
      </div>
    </div>
  );
}
const root = createRoot(document.getElementById('sample'));
root.render(<App />);
