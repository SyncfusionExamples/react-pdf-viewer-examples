import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject, PageOrganizer } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  let viewer1;
  let viewer2;
  return (
    <div>
      <div className="control-section">
        <div className="flex-container">
        </div>
        {/* Render the PDF Viewer */}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <PdfViewerComponent
            ref={(scope) => {
              viewer1 = scope;
            }}
            id="container1"
            documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
            resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
            style={{ height: '640px', flex: 1 }}
          >
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                Annotation,
                FormFields,
                FormDesigner,
                PageOrganizer,
              ]}
            />
          </PdfViewerComponent>
          <PdfViewerComponent
            ref={(scope) => {
              viewer2 = scope;
            }}
            id="container2"
            documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
            resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
            style={{ height: '640px', flex: 1 }}
          >
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                Annotation,
                FormFields,
                FormDesigner,
                PageOrganizer,
              ]}
            />
          </PdfViewerComponent>
        </div>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);