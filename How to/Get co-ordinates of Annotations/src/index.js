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
    this.viewerRef = React.createRef();
  }

  componentDidMount() {
    this.viewerRef.current.annotationAdd = this.handleAnnotationAdd;
  }

  handleAnnotationAdd = (args) => {
    console.log( args); // Log the annotation event arguments
  };

  render() {
    return (
      <div>
      <div className='control-section' style={{ marginTop: '50px' }}>
        <PdfViewerComponent
            ref={this.viewerRef}
            id="PdfViewer"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/27.2.2/dist/ej2-pdfviewer-lib"
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