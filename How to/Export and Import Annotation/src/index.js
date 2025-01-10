import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';

export function App() {
    function ExportXfdf(){   
        var viewer = document.getElementById('container').ej2_instances[0]; 
        viewer.exportAnnotation('Xfdf');
    }
    function ExportJSON(){
        var viewer = document.getElementById('container').ej2_instances[0];
        viewer.exportAnnotation('Json');
    }
    let exportAsObject;
    function ExportAsObject(){
        var viewer = document.getElementById('container').ej2_instances[0];
        viewer.exportAnnotationsAsObject().then(function(value) {
            exportAsObject = value;
        });
    }
    function Import (){
        var viewer = document.getElementById('container').ej2_instances[0];
        viewer.importAnnotation(JSON.parse(exportAsObject));
    }
return (<div>
    <div className='control-section' style={{marginTop: '50px'}} >
    <button onClick={ExportXfdf}>Export XFDF</button>
    <button onClick={ExportJSON}>Export JSON</button>
    <button onClick={ExportAsObject}>Export as Object</button>
    <button onClick={Import}>Import from Object</button>
        <PdfViewerComponent id="container" documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib" style={{ 'height': '640px' }}>
            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner,PageOrganizer]}/>
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);