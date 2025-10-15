// Import necessary modules and styles
import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { useEffect } from 'react';

// Import required modules from Syncfusion PDF Viewer
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

// Define the main component
function Default() {
  let viewer; // Reference to the PDF Viewer component

  // useEffect hook to add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const viewerElement = document.querySelector('.e-pv-viewer-container');

      // Exit if viewer container is not found
      if (!viewerElement) return;

      // Exit if the active element is not inside the viewer container
      if (!viewerElement.contains(document.activeElement)) return;

      // Handle Ctrl + key combinations
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

    // Add the keydown event listener
    document.addEventListener('keydown', handleKeyDown, true);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div className="control-section">
        {/* Render the Syncfusion PDF Viewer */}
        <PdfViewerComponent
          ref={(scope) => {
            viewer = scope; // Assign the viewer reference
          }}
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf" // PDF file to load
          resourceUrl="https://cdn.syncfusion.com/ej2/31.1.17/dist/ej2-pdfviewer-lib" // Resource URL for viewer assets
          style={{ height: '640px' }} // Viewer height
        >
          {/* Inject required services into the viewer */}
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

// Export the component as default
export default Default;

// Render the component into the DOM
const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
