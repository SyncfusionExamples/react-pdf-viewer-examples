import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  return (<div>
    <div className="control-section">
      {/* Render the PDF Viewer */}
      <PdfViewerComponent
        id="container"
        documentPath="PDF_Succinctly.pdf"
        documentLoad={documentLoaded}
        serviceUrl="https://localhost:44309/pdfviewer" 
        style={{ height: '640px' }}>

        {/* Inject the required services */}
        <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
          Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
      </PdfViewerComponent>
    </div>
  </div>);
  function documentLoaded () {
      var viewer = document.getElementById('container').ej2_instances[0];
      viewer.annotationSettings.author = 'syncfusion';
    };
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);
