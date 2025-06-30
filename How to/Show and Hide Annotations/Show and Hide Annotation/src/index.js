import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';

export function App() {
  const viewerRef = React.useRef(null);
  const [annotationsVisible, setAnnotationsVisible] = React.useState(true);
  const [exportObject, setExportObject] = React.useState(null);
  
  const toggleAnnotations = () => {
    if (!viewerRef.current) return;
    
    const viewer = viewerRef.current;
    
    if (annotationsVisible) {
      // Hide annotations by exporting and deleting them
      viewer.exportAnnotationsAsObject().then((value) => {
        setExportObject(value);
        
        const count = viewer.annotationCollection.length;
        for (let i = 0; i < count; i++) {
          // Always delete the first item as the collection shrinks
          viewer.annotationModule.deleteAnnotationById(viewer.annotationCollection[0].annotationId);
        }
        
        setAnnotationsVisible(false);
      });
    } else {
      // Restore annotations
      if (exportObject) {
        let exportAnnotObject= JSON.parse(exportObject);
        viewer.importAnnotation(exportAnnotObject);
      }
      
      setAnnotationsVisible(true);
    }
  };

  return (
    <div>
      <div className='control-section'>
        <button 
          id="toggleBtn" 
          onClick={toggleAnnotations}
        >
          {annotationsVisible ? 'Hide Annotation' : 'Show Annotation'}
        </button>
        
        <PdfViewerComponent 
          id="container" 
          ref={viewerRef}
          serviceUrl='https://localhost:44309/pdfviewer'
          documentPath='Annotations.pdf'
          style={{ 'height': '680px' }}
          documentLoad={documentLoaded}
        >
          <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
            Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}

function documentLoaded(args) {
  // You can perform actions after the document is loaded here
  console.log("Document loaded successfully");
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);