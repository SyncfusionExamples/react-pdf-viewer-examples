import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
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
  let viewer;
  const addAnnotation = () => {
    if (viewer) {
      var targetPage = 3;
      const pageSize = viewer.getPageInfo(targetPage);

      //convert the points to pixels
      var pageHeight = (pageSize.height * 96) / 72;
      var pageWidth = (pageSize.width * 96) / 72;

      var left = bounding_box['Left'] * pageWidth;
      var top = bounding_box['Top'] * pageHeight;
      var width = bounding_box['Width'] * pageWidth;
      var height = bounding_box['Height'] * pageHeight;
      var bounds = { x: left, y: top, width: width, height: height };

      //add annotation programmatically
      viewer.annotation.addAnnotation('Rectangle', {
        offset: { x: bounds.x, y: bounds.y },
        pageNumber: targetPage,
        width: bounds.width,
        height: bounds.height,
      });
      // Navigate to the page
      viewer.navigation.goToPage(targetPage);

      var annotationBounds = viewer.annotationCollection[viewer.annotationCollection.length - 1].bounds;
      var pageNumber = viewer.annotationCollection[viewer.annotationCollection.length - 1].pageNumber;
      var pagePoint = { x: annotationBounds.left, y: annotationBounds.top };

      //convert the page point to client point
      var clientPoint = viewer.convertPagePointToClientPoint(
        pagePoint,
        parseInt(pageNumber) + 1
      );
      
      //convert the client points to DOM rect
      var rectangle = new DOMRect(
        clientPoint.x,
        clientPoint.y,
        annotationBounds.width,
        annotationBounds.height
      );
        
      viewer.zoomToRect(rectangle);
    }
  };
  
  var bounding_box = {
    Width: 0.11749080568552017,

    Height: 0.0258219875395298,

    Left: 0.06182936578989029,

    Top: 0.19671368598937988,
  };

  return (
    <div>
      <div className="control-section">
        {/* Add Annotation Button */}
        <button onClick={addAnnotation} style={{ marginTop: '10px' }}>
          Add Rectangle Annotation
        </button>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
          ref={(scope) => {
            viewer = scope;
          }}
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
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
    </div>
  );
}

export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
