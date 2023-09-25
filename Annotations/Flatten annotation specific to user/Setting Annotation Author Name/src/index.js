
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
export class App extends React.Component {
render() {
    return (<div>
        <div className='control-section'>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
            ref={(scope) => {
              this.viewer = scope;
            }}
            id="container"
            documentPath="PDF Succinctly.pdf"
            //To set up the **server-backed PDF Viewer**, add the following 'serviceUrl'.
            //serviceUrl="https://localhost:44399/pdfviewer"
            documentLoad={this.documentLoaded}
            style={{ height: '640px' }}
          >
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
                Annotation,
                FormFields,
                FormDesigner,
              ]}
            />
          </PdfViewerComponent>
        </div>
    </div>);
}
documentLoaded = (args) => {
  this.viewer.annotationSettings.author = 'syncfusion';
};
}
const root = createRoot(document.getElementById('sample'));
root.render(<App />);