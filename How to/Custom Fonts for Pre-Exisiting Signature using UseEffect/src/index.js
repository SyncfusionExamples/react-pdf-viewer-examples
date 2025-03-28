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
  React.useEffect(() => {
    // Load Google Fonts using Web Font Loader
    if (window.WebFont) {
      window.WebFont.load({
        google: {
          families: ['Roboto:300,400,700', 'Caveat:300,400,700'], // Add required fonts
        },
        loading: function () {
          console.log('Fonts are being loaded');
        },
        active: function () {
          console.log('Fonts have been rendered');
        },
        inactive: function () {
          console.error('Failed to load fonts');
        },
      });
    }
  }, []);
  const documentLoad = (args) => {
    //var viewer = document.getElementById('container').ej2_instances[0];
    //To add form fields
    // viewer.formDesignerModule.addFormField('SignatureField', {
    //   bounds: { X: 146, Y: 200, Width: 150, Height: 70 },
    // });

    //To retrieve form fields
    const formFields = viewer.retrieveFormFields();
    const field = formFields[0];
    //To update form fields value
    if(field){
    field.value = 'Tiago';
    field.fontName = 'Caveat';
    viewer?.updateFormFieldsValue(field);
    }
  };
  return (
    <div>
      <div className="control-section">
        </div>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent
          ref={(scope) => {
            viewer = scope;
          }}
          id="container"
          documentLoad={documentLoad}
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
          signatureFieldSettings={{
            typeSignatureFonts: ['Caveat'],
          }}
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

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
