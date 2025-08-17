import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';

export class App extends React.Component {
  constructor() {
    super();
    this.pdfViewer = React.createRef();
  }

  enableTextSelection = () => {
    if (this.pdfViewer.current) {
      this.pdfViewer.current.enableTextSelection = true;
    }
  }

  disableTextSelection = () => {
    if (this.pdfViewer.current) {
      this.pdfViewer.current.enableTextSelection = false;
    }
  }

  render() {
    return (
      <div id="app">
        <button onClick={this.enableTextSelection} style={{ marginBottom: '20px' }}>
          enableTextSelection
        </button>
        <button onClick={this.disableTextSelection} style={{ marginBottom: '20px' }}>
          disableTextSelection
        </button>
        <PdfViewerComponent
          id="pdfViewer"
          ref={this.pdfViewer}
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib"
          enableTextSelection={false}
          style={{ height: '640px' }}
        >
          <Inject services={[Toolbar, Magnification, Navigation, Annotation, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]} />
        </PdfViewerComponent>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);