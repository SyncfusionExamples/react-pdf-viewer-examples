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
  PageOrganizer,
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

export default function App() {
  return (
    <div>
      <div className="control-section" style={{ marginBottom: '8px' }}>
        <button onClick={enableCalloutMode}>Enable Callout Mode</button>
        <button onClick={exitCalloutMode}>Exit Callout Mode</button>
        <button onClick={addCalloutProgrammatically}>Add Callout Programmatically</button>
      </div>
      <PdfViewerComponent
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
        style={{ height: '640px' }}
      >
        <Inject services={[
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
          FormDesigner,
          PageOrganizer
        ]} />
      </PdfViewerComponent>
    </div>
  );
}

// Enable Callout Annotation mode
function enableCalloutMode() {
  const viewer = document.getElementById('container').ej2_instances[0];
  viewer.annotation.setAnnotationMode('Callout');
}

// Exit Callout Annotation mode
function exitCalloutMode() {
  const viewer = document.getElementById('container').ej2_instances[0];
  viewer.annotation.setAnnotationMode('None');
}

// Add Callout Annotation programmatically
function addCalloutProgrammatically() {
  const viewer = document.getElementById('container').ej2_instances[0];
  viewer.annotation.addAnnotation('Callout', {
    offset: { x: 200, y: 200 },
    pageNumber: 1,
    opacity: 1,
    borderColor: '#000000',
    borderWidth: 1,
    borderStyle: 'solid',
    author: 'Guest',
    calloutLines: [
      { x: 50, y: 50 },
      { x: 100, y: 100 },
      { x: 200, y: 250 }
    ],
    lineEndingStyle: 'Open'
  });
}
