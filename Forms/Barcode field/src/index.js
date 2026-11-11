import * as ReactDOM from 'react-dom/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Annotation,
  TextSearch,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

const documentPath = 'https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf';
const resourceUrl = 'https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib';

export function App() {
  const viewerRef = useRef(null);

  // Barcode fields that are currently present in the viewer.
  const [barcodeFields, setBarcodeFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');

  /**
   * Collects the barcode fields that are currently present in the viewer.
   */
  const refreshBarcodeFields = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    // `formFieldCollections` is an observable property whose default value is a
    // plain object, so it only becomes an array once a form field is drawn.
    const fields = Array.isArray(viewer.formFieldCollections) ? viewer.formFieldCollections : [];
    const barcodes = fields
      .filter((field) => field.type === 'Barcode')
      .map((field) => ({
        id: field.id,
        name: field.name,
        symbology: field.symbology
      }));

    setBarcodeFields(barcodes);
    setSelectedFieldId((current) =>
      barcodes.some((field) => field.id === current) ? current : barcodes.length ? barcodes[0].id : ''
    );
  }, []);

  /** Adds a barcode field of the given symbology to the first page of the document. */
  const addBarcodeField = (symbology) => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    viewer.formDesignerModule.addFormField('Barcode', {
      name: 'Barcode' + (barcodeFields.length + 1),
      bounds: { X: 100, Y: 150, Width: 200, Height: 80 },
      pageNumber: 1,
      symbology: symbology
    });
    refreshBarcodeFields();
  };

  /** Switches the form designer into the barcode placement mode. */
  const enableBarcodeMode = () => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }
    viewer.formDesignerModule.setFormFieldMode('Barcode');
  };

  /**
   * Returns the selected barcode field.
   *
   * The collection entry is passed to the form designer instead of its identifier,
   * because a field that was placed through the PDF Viewer UI is registered in the
   * internal field collection under a different identifier than the one reported by
   * `formFieldCollections`. Resolving the field through the collection object lets
   * the form designer look it up correctly in both cases.
   */
  const getSelectedField = () => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedFieldId) {
      return null;
    }

    const fields = Array.isArray(viewer.formFieldCollections) ? viewer.formFieldCollections : [];
    const field = fields.find((item) => item.id === selectedFieldId);
    return field ? field : selectedFieldId;
  };

  /** Changes the barcode type of the selected barcode field. */
  const updateSymbology = (symbology) => {
    const field = getSelectedField();
    if (!field) {
      return;
    }

    viewerRef.current.formDesignerModule.updateFormField(field, { symbology: symbology });
    refreshBarcodeFields();
  };

  /** Removes the barcode field that is selected in the edit panel. */
  const deleteSelectedField = () => {
    const field = getSelectedField();
    if (!field) {
      return;
    }

    viewerRef.current.formDesignerModule.deleteFormField(field);
    setSelectedFieldId('');
    refreshBarcodeFields();
  };

  // Refresh the field list once the document is loaded.
  useEffect(() => {
    refreshBarcodeFields();
  }, [refreshBarcodeFields]);

  return (
    <div className='pdf-viewer-container'>
      <div className='toolbar-actions'>
        {/* Programmatic creation */}
        <div className='action-group'>
          <h4>Add barcode field programmatically</h4>
          <button id='addPdf417Barcode' onClick={() => addBarcodeField('PDF417')}>Add PDF417</button>
          <button id='addQrCodeBarcode' onClick={() => addBarcodeField('QRCode')}>Add QR Code</button>
          <button id='addDataMatrixBarcode' onClick={() => addBarcodeField('DataMatrix')}>Add Data Matrix</button>
          <button id='enableBarcodeMode' onClick={enableBarcodeMode}>Set Barcode Field Mode</button>
        </div>

        {/* Editing */}
        <div className='action-group'>
          <h4>Edit barcode field</h4>
          <label className='field'>
            <span>Field</span>
            <select
              id='selectedField'
              value={selectedFieldId}
              onChange={(event) => setSelectedFieldId(event.target.value)}
            >
              {barcodeFields.length ? (
                barcodeFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.symbology})
                  </option>
                ))
              ) : (
                <option value=''>No barcode field</option>
              )}
            </select>
          </label>
          <button id='updateSymbologyPdf417' disabled={!selectedFieldId} onClick={() => updateSymbology('PDF417')}>
            Set PDF417
          </button>
          <button id='updateSymbologyQrCode' disabled={!selectedFieldId} onClick={() => updateSymbology('QRCode')}>
            Set QR Code
          </button>
          <button id='updateSymbologyDataMatrix' disabled={!selectedFieldId} onClick={() => updateSymbology('DataMatrix')}>
            Set Data Matrix
          </button>
          <button id='deleteSelectedField' disabled={!selectedFieldId} onClick={deleteSelectedField}>
            Delete Field
          </button>
        </div>
      </div>

      <PdfViewerComponent
        ref={viewerRef}
        id='container'
        documentPath={documentPath}
        resourceUrl={resourceUrl}
        documentLoad={refreshBarcodeFields}
        formFieldAdd={refreshBarcodeFields}
        formFieldRemove={refreshBarcodeFields}
        style={{ height: '680px', display: 'block' }}
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
            FormDesigner,
            PageOrganizer
          ]}
        />
      </PdfViewerComponent>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);
