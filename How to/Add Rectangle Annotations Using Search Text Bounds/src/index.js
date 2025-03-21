import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  Annotation,
  TextSelection,
  TextSearch,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Create a ref for the PdfViewerComponent to access its methods and properties
    this.viewerRef = React.createRef();
  }

  componentDidMount() {
    // Obtain the current instance of the PdfViewerComponent
    const viewer = this.viewerRef.current;

    if (viewer) {
      // Attach an event handler for text search highlight
      viewer.textSearchHighlight = this.handleTextSearchHighlight;
    }
  }

  // Method to handle the text search highlight event
  handleTextSearchHighlight = (args) => {
    console.log(args); // Logs Highlighted text search details

    const pageNumber = args.pageNumber;
    const bounds = args.bounds;
    
     // Add a rectangle annotation on the highlighted text
    this.viewerRef.current.annotationModule.addAnnotation('Rectangle', {
      pageNumber: pageNumber,
      offset: { x: bounds.left, y: bounds.top },
      width: bounds.width,
      height: bounds.height,
    });
  };

  // Method to initiate a text search for the term 'PDF'
  handleSearch = () => {
    this.viewerRef.current.textSearchModule.searchText('PDF', false);
  };

  // Method to go to the next instance of the search term
  handleSearchNext = () => {
    this.viewerRef.current.textSearchModule.searchNext();
  };

  // Method to cancel the current text search operation
  handleCancelSearch = () => {
    this.viewerRef.current.textSearchModule.cancelTextSearch();
  };

  render() {
    return (
      <div>
      <div style={{ marginTop: '50px' }}>
      <button onClick={this.handleSearch}>Search PDF</button>
      <button onClick={this.handleSearchNext}>Search Next</button>
      <button onClick={this.handleCancelSearch}>Cancel Search</button>
      </div>
      <div className='control-section' style={{ marginTop: '5px' }}>
        <PdfViewerComponent
            ref={this.viewerRef}
            id="PdfViewer"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
        >
            <Inject services={[
              Toolbar,
              Magnification,
              Navigation,
              Annotation,
              TextSelection,
              TextSearch,
              FormFields,
              FormDesigner,
              PageOrganizer
            ]} />
        </PdfViewerComponent>
      </div>
      </div>
  );
}
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);