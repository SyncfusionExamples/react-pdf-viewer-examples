import React, { useRef, useState } from 'react';
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
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

export default function App() {
  const viewerRef = useRef(null);

  const addFormatFields = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    const numberField = {
      name: 'NumberField',
      bounds: { X: 146, Y: 200, Width: 200, Height: 24 },
      pageNumber: 1,
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
      tooltip: 'Amount',
      thickness: 1,
      actions: {
        format: {
          script: 'AFNumber_Format(2, 0, 0, 0, "$", true)'
        }
      }
    };

    viewer.formDesignerModule.addFormField('Textbox', numberField);

    const percentField = {
      name: 'PercentField',
      bounds: { X: 146, Y: 300, Width: 200, Height: 24 },
      pageNumber: 1,
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
      tooltip: 'Percentage field',
      thickness: 1,
      actions: {
        format: {
          script: 'AFPercent_Format(2, 0)'
        }
      }
    };

    viewer.formDesignerModule.addFormField('Textbox', percentField);

    const specialField = {
      name: 'SpecialField',
      bounds: { X: 146, Y: 400, Width: 200, Height: 24 },
      pageNumber: 1,
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
      tooltip: 'Special format',
      thickness: 1,
      actions: {
        format: {
          script: 'AFSpecial_Format(0)'
        }
      }
    };

    viewer.formDesignerModule.addFormField('Textbox', specialField);

    const maskField = {
      name: 'MaskField',
      bounds: { X: 146, Y: 500, Width: 200, Height: 24 },
      pageNumber: 1,
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
      tooltip: 'Mask Field',
      thickness: 1,
      actions: {
        keyPressed: {
          script: 'AFSpecial_KeystrokeEx("AAA-9999")'
        }
      }
    };

    viewer.formDesignerModule.addFormField('Textbox', maskField);
  };


  return (
    <div>
      <div
        style={{
          marginBottom: '12px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <button onClick={addFormatFields}>
          Add Format Fields
        </button>
      </div>

      <PdfViewerComponent
        ref={viewerRef}
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/30.1.37/dist/ej2-pdfviewer-lib"
        style={{ height: '700px' }}
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