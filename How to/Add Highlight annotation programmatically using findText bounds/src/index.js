import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  return (<div>
    <div className='control-section'>
      <PdfViewerComponent 
        id="container" 
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib" 
        style={{ 'height': '680px' }} 
        extractTextCompleted={extractTextCompleted}
      >
        <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
          Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
      </PdfViewerComponent>
    </div>
  </div>);
}

//function to handle the extractTextCompleted event
function extractTextCompleted(args) {
     var viewer = document.getElementById('container').ej2_instances[0];
     //Text search for a specific text in the PDF document
    var searchText =
      'The authors and copyright holders provide absolutely no warranty for any information provided. The authors and copyright holders shall not be liable for any claim, damages, or any other liability arising from, out of, or in connection with the information in this book.';
    const searchResults = viewer.textSearchModule.findText(searchText, false);
    console.log(searchText);
    if (!searchResults || searchResults.length === 0) {
      console.warn('No matches found.');
      return;
    }

    for (let i = 0; i < searchResults.length; i++) {
      const pageResult = searchResults[i];
      if (!pageResult.bounds || pageResult.bounds.length === 0) continue;

      for (let j = 0; j < pageResult.bounds.length; j++) {
        const bound = pageResult.bounds[j];
        //To add a highlight annotation for the found text
        viewer.annotation.addAnnotation('Highlight', {
          bounds: [
            {
              x: (bound.x * 96) / 72,
              y: (bound.y * 96) / 72,
              width: (bound.width * 96) / 72,
              height: (bound.height * 96) / 72,
            },
          ],
          pageNumber: pageResult.pageIndex + 1,
        });
      }
    }
  }
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);