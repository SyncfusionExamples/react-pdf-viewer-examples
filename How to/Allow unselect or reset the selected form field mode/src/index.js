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

  const pageMouseover = (args) => {
    console.log(args);
    const viewer = getViewerInstance();
    if (
      viewer.isFormDesignerToolbarVisible &&
      document.getElementById('FormField_helper_html_element')
    ) {
      const formFieldElement = document.getElementById(
        'FormField_helper_html_element'
      );
      viewer.designerMode = false;
      if (formFieldElement) {
        formFieldElement.remove();
      }
      viewer.tool = '';
    }
  };
  const SetFormField = () => {
    const viewer = getViewerInstance();
    if (viewer) {
      viewer.formDesignerModule.setFormFieldMode('Textbox');

      viewer.designerMode = false;
    }
  };

  // Utility function to get the PDF Viewer instance
  const getViewerInstance = () => {
    return document.getElementById('container')?.ej2_instances[0];
  };

  return (
    <div>
      <div className="control-section">
        <button onClick={SetFormField}>Set Form Field</button>
        <div className="flex-container">
        </div>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
          pageMouseover={pageMouseover}
          isFormDesignerToolbarVisible="true"
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
