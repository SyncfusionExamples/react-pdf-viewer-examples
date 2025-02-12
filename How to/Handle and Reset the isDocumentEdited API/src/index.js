import ReactDOM from 'react-dom/client';
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
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';

function Default() {
  var isDocumentEdited;
  function commentAdd() {
    var viewer = document.getElementById('container').ej2_instances[0];
    if (viewer.annotationCollection[0]) {
      var comments = viewer.annotationCollection[0].note;
    }
    console.log(comments);
    if (viewer.annotationCollection[0] && viewer.annotationCollection[0].note) {
      isDocumentEdited = true;
    } else {
      isDocumentEdited = false;
    }
  }
  function commentDelete(args) {
    var viewer = document.getElementById('container').ej2_instances[0];

    // Loop through each annotation in the annotationCollection
    for (let i = 0; i < viewer.annotationCollection.length; i++) {
      let annotation = viewer.annotationCollection[i];
      let comments = annotation.note;

      console.log(comments);

      // Check if the note and annotationId match
      if (
        args.annotation.note === comments &&
        args.id === annotation.annotationId
      ) {
        isDocumentEdited = false;
        // break; // Exit the loop once a match is found
      } else {
        isDocumentEdited = true;
      }
    }

    console.log(isDocumentEdited);
  }

  function isDocumentEditedStatus() {
    console.log('isDocumentEdited (after save): ' + isDocumentEdited);
  }

  return (
    <div>

        <button onClick={isDocumentEditedStatus}>isDocumentEdited </button>
        <PdfViewerComponent
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
          commentAdd={commentAdd}
          commentDelete={commentDelete}
        >
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
              PageOrganizer,
            ]}
          />
        </PdfViewerComponent>
      </div>
  );
}
export default Default;

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<Default />);

