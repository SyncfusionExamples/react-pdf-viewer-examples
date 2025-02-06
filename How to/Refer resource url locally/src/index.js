import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
return (<div>
    <div className='control-section'>
        <PdfViewerComponent 
            id="container" 
            documentPath= {window.location.origin + "/assets/pdfsuccinctly.pdf"} 
            resourceUrl = {window.location.origin + "/assets/ej2-pdfviewer-lib"} 
            style={{ 'height': '640px' }}>

            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);