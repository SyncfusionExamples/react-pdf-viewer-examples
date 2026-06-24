import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
    var isInitialLoading = true;
    function documentLoaded() {
        var viewer = document.getElementById('container').ej2_instances[0];
        if (isInitialLoading) {
            viewer.isPageOrganizerOpen = true;
            isInitialLoading = false;
        } else {
            viewer.isPageOrganizerOpen = false;
        }
    }
    function openPageOrganizer() {
        var viewer = document.getElementById('container').ej2_instances[0];
        // Open PageOrganizer Pane
        viewer.pageOrganizer.openPageOrganizer();
    }
    function closePageOrganizer() {
        var viewer = document.getElementById('container').ej2_instances[0];
        // Close Page Organizer Pane
        viewer.pageOrganizer.closePageOrganizer();
     }
return (<div>
    <div className='control-section'>
    <button onClick={openPageOrganizer}>Open PageOrganizer Pane</button>
    <button onClick={closePageOrganizer}>Close PageOrganizer Pane</button>
        <PdfViewerComponent 
            id="container" 
            documentPath="PDF_Succinctly.pdf" 
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" 
            documentLoad = {documentLoaded} 
            isPageOrganizerOpen={false}
            enablePageOrganizer={true}
            pageOrganizerSettings = {{canDelete: true, canInsert: true, canRotate: true, canCopy: true, canRearrange: true}}
            style={{ 'height': '640px' }}>

            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);