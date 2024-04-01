import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
    function openBookmark() {
        var viewer = document.getElementById('container').ej2_instances[0];
        // Open Bookmark pane
        viewer.bookmarkViewModule.openBookmarkPane();
    }
    function closeBookmark() {
        var viewer = document.getElementById('container').ej2_instances[0];
           // close Bookmark pane
           viewer.bookmarkViewModule.closeBookmarkPane();
    }
return (<div>
    <div className='control-section'>
    <button onClick={openBookmark}>Open Bookmark Pane</button>
    <button onClick={closeBookmark}>Close Bookmark Pane</button>
        <PdfViewerComponent id="container" documentPath="PDF_Succinctly.pdf" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" style={{ 'height': '640px' }}>
            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner,PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);