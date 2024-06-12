import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';

export class App extends React.Component {
  render() {
    return (
      <div>
        <div className="control-section">
          {/* Render the PDF Viewer */}
          <PdfViewerComponent
            id="container"
            documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
            enableToolbar ={false}
            //To set up the **server-backed PDF Viewer**, add the following 'serviceUrl'.
            // serviceUrl="https://services.syncfusion.com/react/production/api/pdfviewer"
            resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
            style={{ height: '640px' } 
          }
          >
            {/* Inject the required services */}
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
              ]}
            />
          </PdfViewerComponent>
        </div>
      </div>
    );
  }
}
const root = createRoot(document.getElementById('sample'));
root.render(<App />);