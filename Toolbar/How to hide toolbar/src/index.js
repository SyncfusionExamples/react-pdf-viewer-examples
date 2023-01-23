import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
let thumbnail = [];
export class App extends React.Component {
  //Event triggers on successful AJAX request
  fireAjaxRequestSuccess(event) {
    if (event.action === 'Load') {
      thumbnail.push(event.data);      
      console.log(thumbnail);
    }
  }
  render() {
    return (
      <div>
        <div className="control-section">
          {/* Render the PDF Viewer */}
          <PdfViewerComponent
            id="container"
            documentPath="PDF_Succinctly.pdf"
            ajaxRequestSuccess={this.fireAjaxRequestSuccess}
            enableToolbar ={false}
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
            style={{ height: '640px' } 
          }
          >
            {/* Inject the required services */}
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
      </div>
    );
  }
}
const root = createRoot(document.getElementById('sample'));
root.render(<App />);