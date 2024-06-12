import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';

function App() {
  function uniqueId() {
    var viewer = document.getElementById('container').ej2_instances[0];	
    var uniqueId = viewer.viewerBase.documentId
    var hashId = window.sessionStorage.getItem(uniqueId+'_hashId');
    //Prints the id in the console window.
    console.log(hashId);
  }
  return (<div>
    <div className='control-section'>
     {/* Render the PDF Viewer */}
     <button onClick={uniqueId}>unique Id</button>
      <PdfViewerComponent
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        serviceUrl="https://services.syncfusion.com/react/production/api/pdfviewer"
        height= '600px'>
              <Inject services={[ Toolbar, Magnification, Navigation, LinkAnnotation, Annotation, 
                                  BookmarkView, ThumbnailView, Print, TextSelection, TextSearch]} />
      </PdfViewerComponent>
    </div>
  </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);

