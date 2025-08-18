import { createRoot } from 'react-dom/client';
import * as React from 'react';
import './index.css';
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
  PdfKeys,
  ModifierKeys,
} from '@syncfusion/ej2-react-pdfviewer';
import { PdfDocument } from '@syncfusion/ej2-pdf';

function App() {
  const viewerRef = React.useRef(null);

  // Handle keyboard shortcuts (Alt+R: rotate right, Alt+L: rotate left, Alt+D: delete)
  function keyboardCustomCommands(args) {
    if (args.keyboardCommand.name === 'rotateCurrentPageRight') {
      rotate(45);
    } else if (args.keyboardCommand.name === 'rotateCurrentPageLeft') {
      rotate(-45);
    } else if (args.keyboardCommand.name === 'deleteCurrentPage') {
      deleteCurrentPage();
    }
  }

  // Rotate current page by specified degrees
  function rotate(degree) {
    viewerRef.current.saveAsBlob().then((value) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(value);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const document = new PdfDocument(byteArray);
        const currentPage = viewerRef.current.currentPageNumber;
        const currentZoom = viewerRef.current.zoomValue;
        const page = document.getPage(currentPage - 1);
        page.rotation = (page.rotation + degree) % 360;
        const updatedData = document.save();
        document.destroy();
        let base64String = btoa(
          Array.from(new Uint8Array(updatedData))
            .map((byte) => String.fromCharCode(byte))
            .join('')
        );
        let base64PDF = 'data:application/pdf;base64,' + base64String;
        viewerRef.current.load(base64PDF, '');
        if (currentZoom !== 0)
          viewerRef.current.magnificationModule.zoomTo(currentZoom);
      };
    });
  }

  // Delete the current page from PDF
  function deleteCurrentPage() {
    viewerRef.current.saveAsBlob().then((value) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(value);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const document = new PdfDocument(byteArray);
        const currentPage = viewerRef.current.currentPageNumber;
        const currentZoom = viewerRef.current.zoomValue;
        document.removePage(currentPage - 1);
        const updatedData = document.save();
        document.destroy();
        let base64String = btoa(
          Array.from(new Uint8Array(updatedData))
            .map((byte) => String.fromCharCode(byte))
            .join('')
        );
        let base64PDF = 'data:application/pdf;base64,' + base64String;
        viewerRef.current.load(base64PDF, '');
        if (currentZoom !== 0)
          viewerRef.current.magnificationModule.zoomTo(currentZoom);
      };
    });
  }

  return (
    <div>
      <div className="control-section">
        <PdfViewerComponent
          ref={viewerRef}
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
          // Configure keyboard shortcuts and other props
          commandManager={{
            keyboardCommand: [
              {
                name: 'rotateCurrentPageRight',
                gesture: {
                  pdfKeys: PdfKeys.R,
                  modifierKeys: ModifierKeys.Alt,
                },
              },
              {
                name: 'rotateCurrentPageLeft',
                gesture: {
                  pdfKeys: PdfKeys.L,
                  modifierKeys: ModifierKeys.Alt,
                },
              },
              {
                name: 'deleteCurrentPage',
                gesture: {
                  pdfKeys: PdfKeys.D,
                  modifierKeys: ModifierKeys.Alt,
                },
              },
            ],
          }}
          keyboardCustomCommands={keyboardCustomCommands}
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

// Render the App
const root = createRoot(document.getElementById('sample'));
root.render(<App />);