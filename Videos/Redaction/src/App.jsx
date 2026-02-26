import React from 'react';
import './index.css';
import {
  PdfViewerComponent, LinkAnnotation, BookmarkView, Magnification, ThumbnailView, Navigation, Annotation,
  TextSearch, TextSelection, Toolbar, Print, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';

function App() {

  const viewerRef = React.useRef(null);

  const addRedactAnnotation = () => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    viewer.annotation.addAnnotation('Redaction', {
      bound: { x: 460, y: 200, width: 75, height: 20 },
      pageNumber: 1,
      markerFillColor: '#0000FF',
      markerBorderColor: 'red',
      fillColor: 'red',
      overlayText: 'Confidential',
      fontColor: 'yellow',
      fontFamily: 'Times New Roman',
      fontSize: 8,
      beforeRedactionsApplied: false
    });
  };


  const editRedactAnnotation = () => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    const collection = viewer.annotationCollection;
    const annotation = collection[1];
    if (annotation.subject === 'Redaction') {
      annotation.overlayText = 'EditedAnnotation';
      annotation.markerFillColor = '#22FF00';
      annotation.markerBorderColor = '#000000';
      annotation.isRepeat = true;
      annotation.fillColor = '#F8F8F8';
      annotation.fontSize = 14;
      annotation.fontColor = '#333333';
      annotation.fontFamily = 'Symbol';
      annotation.textAlign = 'Right';
      viewer.annotation.editAnnotation(annotation);
    }
  };


  const deleteAnnotationById = () => {
    if (!viewerRef.current) return;
    const id = (viewerRef.current).annotationCollection?.[1]?.annotationId;
    if (id) {
      viewerRef.current.annotationModule.deleteAnnotationById(id);
    }
  };

  const addPageRedactions = () => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    viewer.annotation.addPageRedactions([3, 5, 7]);
  };

  const applyRedaction = () => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    viewer.annotation.redact();
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid #e5e5e5',
          backgroundColor: '#f9f9f9'
        }}>
        <h3 style={{ margin: 0 }}>React PDF Viewer</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button id="addRedactAnnotation" type="button" onClick={addRedactAnnotation}>
            Add Redaction Annotation
          </button>
          <button id="editRedactAnnotation" type="button" onClick={editRedactAnnotation}>
            Edit Redaction
          </button>
          <button id="deleteAnnotationById" type="button" onClick={deleteAnnotationById}>
            Delete Annotation By Id
          </button>
          <button id="addPageRedactions" type="button" onClick={addPageRedactions}>
            Add Page Redaction
          </button>
          <button id="applyRedaction" type="button" onClick={applyRedaction}>
            Apply Redaction
          </button>
        </div>
      </div>
      <div className="control-section">
        <PdfViewerComponent
          ref={viewerRef}
          id="container"
          documentPath={window.location.origin + '/assets/redaction.pdf'}
          resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
          style={{ height: '660px' }}
        >
          <Inject services={[
            Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
            ThumbnailView, Print, Toolbar, TextSelection, TextSearch, FormFields, FormDesigner
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}

export default App;