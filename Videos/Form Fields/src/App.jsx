import * as React from 'react';
import './index.css';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';

function App() {

  const addField = () => {
    var viewer = document.getElementById('container').ej2_instances[0];
    viewer.formDesignerModule.addFormField("Textbox", { name: "First Name", bounds: { X: 146, Y: 229, Width: 150, Height: 24 } });
    viewer.formDesignerModule.addFormField("Textbox", { name: "Middle Name", bounds: { X: 338, Y: 229, Width: 150, Height: 24 } });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'Last Name', bounds: { X: 530, Y: 229, Width: 150, Height: 24 }, });
    viewer.formDesignerModule.addFormField('RadioButton', { bounds: { X: 148, Y: 289, Width: 18, Height: 18 }, name: 'Gender', isSelected: false, });
    viewer.formDesignerModule.addFormField('RadioButton', { bounds: { X: 292, Y: 289, Width: 18, Height: 18 }, name: 'Gender', isSelected: false, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOB Month', bounds: { X: 146, Y: 320, Width: 35, Height: 24 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOB Date', bounds: { X: 193, Y: 320, Width: 35, Height: 24 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOB Year', bounds: { X: 242, Y: 320, Width: 35, Height: 24 }, });
    viewer.formDesignerModule.addFormField('InitialField', { name: 'Agree', bounds: { X: 148, Y: 408, Width: 200, Height: 43 }, });
    viewer.formDesignerModule.addFormField('InitialField', { name: 'Do Not Agree', bounds: { X: 148, Y: 466, Width: 200, Height: 43 }, });
    viewer.formDesignerModule.addFormField('CheckBox', { name: 'Text Message', bounds: { X: 56, Y: 664, Width: 20, Height: 20 }, isChecked: false, });
    viewer.formDesignerModule.addFormField('CheckBox', { name: 'Email', bounds: { X: 242, Y: 664, Width: 20, Height: 20 }, isChecked: false, });
    viewer.formDesignerModule.addFormField('CheckBox', { name: 'Appointment Reminder', bounds: { X: 56, Y: 740, Width: 20, Height: 20 }, isChecked: false, });
    viewer.formDesignerModule.addFormField('CheckBox', { name: 'Request for Customerservice', bounds: { X: 56, Y: 778, Width: 20, Height: 20 }, isChecked: false, });
    viewer.formDesignerModule.addFormField('CheckBox', { name: 'Information Billing', bounds: { X: 290, Y: 740, Width: 20, Height: 20 }, isChecked: false, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'My Email', bounds: { X: 146, Y: 850, Width: 200, Height: 24 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'My Phone', bounds: { X: 482, Y: 850, Width: 200, Height: 24 }, });
    viewer.formDesignerModule.addFormField('SignatureField', { name: 'Sign', bounds: { X: 57, Y: 923, Width: 200, Height: 43 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOS Month', bounds: { X: 386, Y: 923, Width: 35, Height: 24 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOS Date', bounds: { X: 434, Y: 923, Width: 35, Height: 24 }, });
    viewer.formDesignerModule.addFormField('Textbox', { name: 'DOS Year', bounds: { X: 482, Y: 923, Width: 35, Height: 24 }, });
  };

  const editField = () => {
    var viewer = document.getElementById('container').ej2_instances[0];
    const field = viewer.formFieldCollections.find(f => f.name === "First Name");
    if (field) {
      viewer.formDesignerModule.updateFormField(field, {
        value: 'Peter',
        backgroundColor: '#e0f7fa',
        borderColor: '#00796b',
        fontColor: '#004d40'
      });
    }
  };

  const deleteField = () => {
    var viewer = document.getElementById('container').ej2_instances[0];
    viewer.formDesignerModule.deleteFormField(viewer.formFieldCollections[2]);
  };

  function downloadClicked() {
    var viewer = document.getElementById('container').ej2_instances[0];
    viewer.download();
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <h2 style={{ margin: 0 }}>Syncfusion PDF Viewer </h2>
        <div>
          <button onClick={addField} style={{ marginRight: '10px' }}>Add Field</button>
          <button onClick={editField} style={{ marginRight: '10px' }}>Edit Field</button>
          <button onClick={deleteField} style={{ marginRight: '10px' }}>Delete Field</button>
          <button onClick={downloadClicked}>Download</button>
        </div>
      </div>
      {/* PDF Viewer Section */}
      <div className='control-section'>
        <PdfViewerComponent
          id="container"
          documentPath="https://cdn.syncfusion.com/content/pdf/form-designer.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
          style={{ height: '700px' }}
        >
          <Inject services={[
            Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
            BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,
            FormFields, FormDesigner
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}

export default App;
