import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { useEffect } from 'react';
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
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';

function Default() {
  let viewer;

  useEffect(() => {
    const handleKeyDown = (e) => {
      const viewerElement = document.querySelector('.e-pv-viewer-container');

      if (!viewerElement) return;

      // Check if the active element is inside the viewer container
      if (!viewerElement.contains(document.activeElement)) return;

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            e.stopPropagation();
            console.log('Ctrl + S was pressed');
            break;
          case 'arrowup':
            e.preventDefault();
            e.stopPropagation();
            console.log('Ctrl + Up Arrow was pressed');
            break;
          case 'arrowdown':
            e.preventDefault();
            e.stopPropagation();
            console.log('Ctrl + Down Arrow was pressed');
            break;
          case 'arrowleft':
            e.preventDefault();
            e.stopPropagation();
            console.log('Ctrl + Left Arrow was pressed');
            break;
          case 'arrowright':
            e.preventDefault();
            e.stopPropagation();
            console.log('Ctrl + Right Arrow was pressed');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div>
      <div className="control-section">
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
          ref={(scope) => {
            viewer = scope;
          }}
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/31.1.17/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
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
  );
}
export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
