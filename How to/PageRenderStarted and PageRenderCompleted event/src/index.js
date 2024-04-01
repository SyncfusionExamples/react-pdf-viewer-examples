import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch,PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
let pdfviewer;

function App() {

    function pageRenderInitiate(args){
        // This method is called when the page rendering starts
        console.log('Rendering of pages started'); 
        console.log(args); 
    };
    function pageRenderComplete(args){
      // This method is called when the page rendering completes
     console.log('Rendering of pages completed');
     console.log(args); 
    };
  return (<div>
    <div className='control-section'>
     {/* Render the PDF Viewer */}
      <PdfViewerComponent
        ref={(scope) => { pdfviewer = scope; }}
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
        pageRenderInitiate={pageRenderInitiate}
        pageRenderComplete={pageRenderComplete}
        style={{ 'height': '640px' }}>
              <Inject services={[ Toolbar, Magnification, Navigation, LinkAnnotation, Annotation, 
                                  BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,PageOrganizer]} />
      </PdfViewerComponent>
    </div>
  </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);