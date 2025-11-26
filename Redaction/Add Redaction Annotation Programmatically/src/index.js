import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import './index.css';
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  Annotation,
  TextSearch,
  FormFields,
  FormDesigner,
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

export function App() {
  const viewerRef = React.useRef(null);

  // Full toolbar (includes RedactionEditTool)
  const toolbarSettings = {
    toolbarItems: [
      'OpenOption',
      'UndoRedoTool',
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'CommentTool',
      'SubmitForm',
      'AnnotationEditTool',
      'RedactionEditTool',
      'FormDesignerEditTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption'
    ]
  };

  // Default redaction annotation properties
  React.useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.redactionSettings = {
      overlayText: 'Confidential',
      markerFillColor: '#FF0000',
      markerBorderColor: '#000000',
      isRepeat: false,
      fillColor: '#F8F8F8',
      fontColor: '#333333',
      fontSize: 14,
      fontFamily: 'Symbol',
      textAlign: 'Right'
    };
  }, []);

  const onAnnotationAdd = (args) => {
    console.log('Annotation added:', args);
  };

  // Add a redaction annotation
  const addRedaction = () => {
    if (!viewerRef.current) return;
    viewerRef.current.annotation.addAnnotation('Redaction', {
      bound: { x: 200, y: 480, width: 150, height: 75 },
      pageNumber: 1,
      markerFillColor: '#0000FF',
      markerBorderColor: 'white',
      fillColor: 'red',
      overlayText: 'Confidential',
      fontColor: 'yellow',
      fontFamily: 'Times New Roman',
      fontSize: 8,
      beforeRedactionsApplied: false
    });
  };

  // Delete first redaction by id
  const deleteFirstRedaction = () => {
    if (!viewerRef.current) return;
    const id = viewerRef.current.annotationCollection?.[0]?.annotationId;
    if (id) {
      viewerRef.current.annotationModule.deleteAnnotationById(id);
    } else {
      console.warn('No annotations found to delete.');
    }
  };

  // Edit first redaction's properties
  const editFirstRedaction = () => {
    if (!viewerRef.current) return;
    const collection = viewerRef.current.annotationCollection || [];
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].subject === 'Redaction') {
        collection[i].overlayText = 'EditedAnnotation';
        collection[i].markerFillColor = '#22FF00';
        collection[i].markerBorderColor = '#000000';
        collection[i].isRepeat = true;
        collection[i].fillColor = '#F8F8F8';
        collection[i].fontColor = '#333333';
        collection[i].fontSize = 14;
        collection[i].fontFamily = 'Symbol';
        collection[i].textAlign = 'Right';
        collection[i].beforeRedactionsApplied = false;
        viewerRef.current.annotation.editAnnotation(collection[i]);
        return;
      }
    }
    console.warn('No redaction annotations found to edit.');
  };

  // Add page redactions (pages 1,3,5,7)
  const addPageRedactions = () => {
    if (!viewerRef.current) return;
    viewerRef.current.annotation.addPageRedactions([1, 3, 5, 7]);
  };

  // Apply all redactions (irreversible)
  const applyRedaction = () => {
    if (!viewerRef.current) return;
    viewerRef.current.annotation.redact();
  };

  return (
    <div className="content-wrapper">
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button id="addRedactAnnot" type="button" onClick={addRedaction}>Add Redaction</button>
        <button id="deleteFirst" type="button" onClick={deleteFirstRedaction}>Delete First Redaction</button>
        <button id="editFirst" type="button" onClick={editFirstRedaction}>Edit First Redaction</button>
        <button id="addPageRedactions" type="button" onClick={addPageRedactions}>Add Page Redactions (1,3,5,7)</button>
        <button id="applyRedaction" type="button" onClick={applyRedaction}>Apply Redaction</button>
      </div>

      <PdfViewerComponent
        ref={viewerRef}
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
        toolbarSettings={toolbarSettings}
        style={{ height: '680px', display: 'block' }}
        annotationAdd={onAnnotationAdd}
      >
        <Inject
          services={[
            Toolbar,
            Magnification,
            Navigation,
            Annotation,
            LinkAnnotation,
            BookmarkView,
            ThumbnailView,
            Print,
            TextSelection,
            TextSearch,
            FormFields,
            FormDesigner
          ]}
        />
      </PdfViewerComponent>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);