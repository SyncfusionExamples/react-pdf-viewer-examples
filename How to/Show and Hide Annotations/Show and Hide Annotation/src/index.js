import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';

export class App extends React.Component {
  constructor() {
    super();
    this.pdfViewer = React.createRef();
    this.state = {
      exportObject: null
    };
  }
  
  hideAnnotations = () => {
    if (this.pdfViewer.current) {
      this.pdfViewer.current.exportAnnotationsAsObject().then((value) => {
        this.setState({ exportObject: value });
        this.pdfViewer.current.deleteAnnotations();
      });
    }
  }

  showAnnotations = () => {
    if (this.pdfViewer.current && this.state.exportObject) {
      this.pdfViewer.current.importAnnotation(JSON.parse(this.state.exportObject));
    }
  }

  render() {
    return (
      <div id="app">
        <div style={{ marginBottom: '10px' }}>
          <button 
            id="hideBtn" 
            onClick={this.hideAnnotations}
            style={{ marginRight: '10px' }}
          >
            Hide Annotations
          </button>
          <button 
            id="unhideBtn" 
            onClick={this.showAnnotations}
          >
            Show Annotations
          </button>
        </div>
        
        <PdfViewerComponent 
          id="pdfViewer" 
          ref={this.pdfViewer}
          resourceUrl="https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          style={{ 'height': '680px' }}
        >
          <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
            Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]} />
        </PdfViewerComponent>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);