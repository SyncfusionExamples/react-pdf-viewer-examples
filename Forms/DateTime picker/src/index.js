import * as ReactDOM from 'react-dom/client';
import React, { useRef } from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';

export function App() {
  const viewerRef = useRef(null);

  const addDateField = () => {
    // Add a Date field
    viewerRef.current?.formDesignerModule.addFormField('Textbox', {
      name: 'DateField1',
      bounds: { X: 146, Y: 200, Width: 200, Height: 24 },
      pageNumber: 1,
      isDateField: true,
      fontSize: 10,
      color: 'black',
      fontFamily: 'Helvetica',
      backgroundColor: '#daeaf7ff',
      borderColor: '#303030',
      alignment: 'Left',
      isReadOnly: false,
      visibility: 'visible',
      isRequired: false,
      isPrint: true,
      tooltip: '',
      thickness: 1,
      actions: {
        format: { script: 'AFDate_FormatEx("m/d/yy")' }
      }
    });
  };

  const addTimeField = () => {
    // Add a Time field
    viewerRef.current?.formDesignerModule.addFormField('Textbox', {
      name: 'TimeField1',
      bounds: { X: 146, Y: 250, Width: 200, Height: 24 },
      pageNumber: 1,
      isDateField: true,
      fontSize: 10,
      color: 'black',
      fontFamily: 'Helvetica',
      backgroundColor: '#daeaf7ff',
      borderColor: '#303030',
      alignment: 'Left',
      isReadOnly: false,
      visibility: 'visible',
      isRequired: false,
      isPrint: true,
      tooltip: '',
      thickness: 1,
      actions: {
        format: { script: 'AFTime_FormatEx("HH:MM")' }
      }
    });
  };

  return (
    <div className='control-section'>
      <button onClick={addDateField}>Add Date Picker</button>
      <button onClick={addTimeField}>Add Time Picker</button>
      <PdfViewerComponent
        ref={viewerRef}
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
        style={{ height: '680px' }}
      >
        <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
      </PdfViewerComponent>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);
