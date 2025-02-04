import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
// Import various modules from the Syncfusion PDF Viewer package
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';

export function App() {
  return (
    <div>
      <div className='control-section'>
        {/* Button to toggle read-only mode for the form fields */}
        <button onClick={readOnly}>readOnly</button>
        {/* PdfViewerComponent to display the PDF document */}
        <PdfViewerComponent
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib"
          style={{ 'height': '680px' }}
          documentLoad={documentLoad} // Event handler for when the document is loaded
          enableNavigationToolbar={false}
          enableToolbar={false} // Disable the default toolbar
        >
          {/* Inject necessary PDF viewer services */}
          <Inject services={[
            Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
            ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}

// Handles the event when the PDF document is loaded
function documentLoad(args) {
  // Get the PDF viewer instance
  const viewer = document.getElementById('container').ej2_instances[0];
  viewer.designerMode = false; // Disable designer mode
}

// Function to set all form fields to read-only mode
function readOnly() {
  // Get the PDF viewer instance
  const viewer = document.getElementById('container').ej2_instances[0];
  // Retrieve all form fields in the document
  const forms = viewer.retrieveFormFields();
  // Set each form field to read-only
  forms.forEach(form => {
    form.isReadOnly = true;
    viewer.formDesignerModule.updateFormField(form, { isReadOnly: true });
  });
}

// React application render setup
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);