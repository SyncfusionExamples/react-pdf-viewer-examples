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
    <div>
      <button onClick={addInternalLink}>Add Internal Link</button>
      <button onClick={addExternalLink}>Add External Link</button>
      <button onClick={editLinkAnnotation}>Edit Link Annotation</button>
      <button onClick={deleteLinkById}>Delete Link by ID</button>
      <button onClick={addMultipleLinks}>Add Multiple Links</button>
    </div>
    <PdfViewerComponent
      id="container"
      documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
      resourceUrl="https://cdn.syncfusion.com/ej2/34.1.29/dist/ej2-pdfviewer-lib"
      hyperlinkOpenState="NewWindow"
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

function addInternalLink() {
  const viewer = document.getElementById('container').ej2_instances[0];

  viewer.annotation.addAnnotation('Link', {
    offset: { x: 200, y: 480 },
    pageNumber: 1,
    width: 150,
    height: 75,
    destinationPageIndex: 4,
    destinationLocation: { x: 100, y: 200 },
    zoomValue: 4,
    strokeColor: '#1433e3'
  });
}

function addExternalLink() {
  const viewer = document.getElementById('container').ej2_instances[0];

  viewer.annotation.addAnnotation('Link', {
    offset: { x: 450, y: 480 },
    pageNumber: 1,
    width: 150,
    height: 75,
    url: 'https://www.syncfusion.com',
    strokeColor: '#FF0000'
  });
}

function editLinkAnnotation() {
  const viewer = document.getElementById('container').ej2_instances[0];

  for (const linkAnnotation of viewer.annotationCollection) {
    if (linkAnnotation.subject === 'Link') {
      linkAnnotation.strokeColor = '#1fcbd4';
      linkAnnotation.thickness = 2;
      linkAnnotation.bounds = { left: 100, top: 100, width: 100, height: 100 };
      linkAnnotation.url = 'https://www.google.com';
      linkAnnotation.destinationPageIndex = 3;
      linkAnnotation.destinationLocation = { x: 300, y: 300 };
      linkAnnotation.zoomValue = 1;
      viewer.annotation.editAnnotation(linkAnnotation);
      break;
    }
  }
}

function deleteLinkById() {
  const viewer = document.getElementById('container').ej2_instances[0];
  const linkAnnotation = viewer.annotationCollection.find((item) => item.subject === 'Link');

  if (linkAnnotation) {
    viewer.annotation.deleteAnnotationById(linkAnnotation.annotationId);
  }
}

function addMultipleLinks() {
  const viewer = document.getElementById('container').ej2_instances[0];

  viewer.annotation.addAnnotation('Link', {
    offset: { x: 100, y: 150 },
    pageNumber: 1,
    width: 180,
    height: 60,
    url: 'https://www.syncfusion.com',
    strokeColor: '#ff0000'
  });

  viewer.annotation.addAnnotation('Link', {
    offset: { x: 320, y: 180 },
    pageNumber: 1,
    width: 150,
    height: 60,
    destinationPageIndex: 2,
    destinationLocation: { x: 100, y: 200 },
    zoomValue: 2,
    strokeColor: '#1433e3'
  });
}