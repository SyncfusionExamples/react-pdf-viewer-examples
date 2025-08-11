import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import './index.css';
import  { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';     

export function App() {

    function onImportSuccess(args) {
        console.log(args);
        var viewer = document.getElementById('container').ej2_instances[0];
        for (let i = 0; i < viewer.annotationCollection.length; i++) {
            console.log(viewer.annotationCollection);
            if (viewer.annotationCollection[i].subject === 'Highlight') {
                viewer.annotationCollection[i].opacity = 1;
                viewer.annotationCollection[i].color = '#0000FF';
                viewer.annotationCollection[i].author = 'Guest';
                viewer.annotationCollection[i].annotationSelectorSettings = {
                    color: '#0000FF',
                    selectionBorderColor: '',
                    resizerBorderColor: 'black',
                    resizerFillColor: '#FF4081',
                    resizerSize: 8,
                    selectionBorderThickness: 1,
                    resizerShape: 'Square',
                    selectorLineDashArray: [0],
                };
                viewer.annotation.editAnnotation(viewer.annotationCollection[i]);
                console.log(viewer.annotationCollection);
            }
        }
    }

    return (<div>
        <div className='control-section'>
            <PdfViewerComponent 
                id="container" 
                documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
                resourceUrl="https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib"
                importSuccess={onImportSuccess}
                highlightSettings={{
                    opacity: 1,
                    color: '#0000FF',
                    author: 'Guest',
                    annotationSelectorSettings: {
                        color: '#0000FF',
                        selectionBorderColor: '',
                        resizerBorderColor: 'black',
                        resizerFillColor: '#FF4081',
                        resizerSize: 8,
                        selectionBorderThickness: 1,
                        resizerShape: 'Square',
                        selectorLineDashArray: [0],
                    },
                }}
                style={{ 'height': '640px' }}>
                <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                                Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
            </PdfViewerComponent>
        </div>
    </div>);
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);