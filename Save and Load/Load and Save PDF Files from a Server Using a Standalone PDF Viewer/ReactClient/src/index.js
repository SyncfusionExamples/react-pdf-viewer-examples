import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';

function Default() {
    let viewer;
    function load() {
        var xhr = new XMLHttpRequest();
        var fileName = 'annotations.pdf';
        var url = `https://localhost:7255/pdfviewer/Load`;
        var data = {
            document: fileName,
            isFileName: true
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'arraybuffer';    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var blob = new Blob([xhr.response], { type: 'application/pdf' });
                var reader = new FileReader();

                reader.onload = function () {
                    var base64String = reader.result;
                    viewer.load(base64String);
                };

                reader.readAsDataURL(blob);
            }
        };

        xhr.send(JSON.stringify(data));
    
    }

    
    function Save() {
    const url = "https://localhost:7255/pdfviewer/Download";

    viewer.saveAsBlob().then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
            const base64String = e.target?.result.toString();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
            const requestData = JSON.stringify({ base64String });

            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('Download successful:', xhr.responseText);
                } else {
                    console.error('Download failed:', xhr.statusText);
                }
            };

            xhr.onerror = function () {
                console.error('An error occurred during the download:', xhr.statusText);
            };

            xhr.send(requestData);
        };
    });
};

    return (<div>
        <div className='control-section'>
            <PdfViewerComponent ref={(scope) => { viewer = scope; }} id="container" documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf" resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib" style={{ 'height': '640px' }}>
            <button onClick={load}>load</button>
            <button onClick={Save}>Save</button>
                <Inject services={[Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, PageOrganizer]}/>
            </PdfViewerComponent>
        </div>
    </div>);
}
export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);