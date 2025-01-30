import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  function documentLoaded() {
    var searchDialog = document.getElementById('container_search');
    searchDialog.addEventListener('click', searchDialogOpened);
  }
  function searchDialogOpened() {
    var saveAsButtonWrapper = document.querySelector(
      '.e-checkbox-wrapper.e-wrapper.e-pv-match-any-word'
    );
    if (saveAsButtonWrapper) {
      var checkbox = saveAsButtonWrapper.querySelector(
        'input[type="checkbox"]'
      );
      if (checkbox) {
        checkbox.style.display = 'none';
      }
      saveAsButtonWrapper.style.display = 'none';
    }
  }
return (<div>
    <div className='control-section'>
        <PdfViewerComponent 
            id="container" 
            documentPath="PDF_Succinctly.pdf" 
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" 
            documentLoad = {documentLoaded} 
            style={{ 'height': '640px' }}>

            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);