
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';
export class App extends React.Component {
render() {
    return (<div>
        <div className='control-section'>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
            id="container"
            documentPath="PDF Succinctly.pdf"
            serviceUrl="https://localhost:44399/pdfviewer"
            style={{ height: '640px' }}
          >
            {/*Inject required dependencies*/}
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
              ]}
            />
          </PdfViewerComponent>
        </div>
    </div>);
}
}
ReactDOM.render(<App />, document.getElementById('sample'));