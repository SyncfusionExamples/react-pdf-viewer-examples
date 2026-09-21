import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject, PageOrganizer} from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  // Enable Extract Pages Tool
  const pageOrganizerSettings = { canExtractPages: true};
  return (<div>
    <div className='control-section'>
      <button onClick={extractPage}>Extract Page</button>
      <PdfViewerComponent 
        id="container" 
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/31.1.23/dist/ej2-pdfviewer-lib" 
        style={{ 'height': '680px' }} 
        pageOrganizerSettings={pageOrganizerSettings}
      >
        <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
          Print, TextSelection, TextSearch, FormFields, FormDesigner,PageOrganizer]} />
      </PdfViewerComponent>
    </div>
  </div>);
}
function extractPage(){
// Get the PDF viewer instance
    var viewer = document.getElementById('container').ej2_instances[0];
    //Extract Pages 1,2
    const array = viewer.extractPages('1,2');
    //Load in viewer
    viewer.load(array,'');

    //print base64 to ensure
    console.log(array);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);