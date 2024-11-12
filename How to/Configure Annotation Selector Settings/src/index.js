import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,PageOrganizer, Inject, AnnotationResizerLocation,
    CursorType } from '@syncfusion/ej2-react-pdfviewer';
export function App() {
    function findTextBounds() {
        var viewer = document.getElementById('container').ej2_instances[0];
        console.log(viewer.textSearch.findText(['pdf', 'adobe'], false, 7));
    }
return (<div>
    <div className='control-section' style={{marginTop: '50px'}} >
        <PdfViewerComponent id="container" documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/27.1.48/dist/ej2-pdfviewer-lib" style={{ 'height': '640px' }}
        annotationSelectorSettings={{
            selectionBorderColor: 'blue',
            resizerBorderColor: 'red',
            resizerFillColor: '#4070ff',
            resizerSize: 8,
            selectionBorderThickness: 1,
            resizerShape: 'Circle',
            selectorLineDashArray: [5, 6],
            resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges,
            resizerCursorType: CursorType.grab
        }}>
            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner,PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);