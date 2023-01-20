import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, 
         ThumbnailView, Print,TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  return (<div>
    <div className='control-section'>
      {/* Render the PDF Viewer */}
      <PdfViewerComponent
        ref={(scope) => { this.viewer = scope; } }
        id="container"
        documentPath="PDF Succinctly.pdf"
        serviceUrl="https://localhost:44399/pdfviewer"
        documentLoad={documentLoaded}
        style={{ height: '640px' }}>
          
          {/* Inject the required services */}
          <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
            Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
        </PdfViewerComponent>
      </div>
  </div>);
}
function documentLoaded (args) {
  this.viewer.annotationSettings.author = 'syncfusion';
};
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);