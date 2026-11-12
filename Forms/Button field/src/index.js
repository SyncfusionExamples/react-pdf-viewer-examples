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

import { ActionType } from '@syncfusion/ej2-pdfviewer';

const documentPath =
  window.location.origin + '/form_document.pdf';

const resourceUrl =
  'https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib';

export function App() {
  const viewerRef = useRef(null);

  const [buttonFields, setButtonFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState('');

  /**
   * Refresh available button fields.
   */
  const refreshButtonFields = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    const fields = Array.isArray(viewer.formFieldCollections)
      ? viewer.formFieldCollections
      : [];

    const buttons = fields
      .filter((field) => field.type === 'ButtonField')
      .map((field) => ({
        id: field.id,
        name: field.name || field.value || field.id
      }));

    setButtonFields(buttons);

    setSelectedFieldId((current) =>
      buttons.some((field) => field.id === current)
        ? current
        : buttons.length
          ? buttons[0].id
          : ''
    );
  }, []);

  /**
   * Get selected form field.
   */
  const getSelectedField = () => {
    const viewer = viewerRef.current;

    if (!viewer || !selectedFieldId) {
      return null;
    }

    const fields = Array.isArray(viewer.formFieldCollections)
      ? viewer.formFieldCollections
      : [];

    return (
      fields.find((field) => field.id === selectedFieldId) ||
      selectedFieldId
    );
  };

  /**
   * Add button field.
   */
  const addButtonField = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    viewer.formDesignerModule.addFormField('ButtonField', {
      name: `Submit${buttonFields.length + 1}`,
      pageNumber: 1,
      bounds: {
        X: 100,
        Y: 350,
        Width: 120,
        Height: 32
      },
      value: 'Submit',
      text: 'Submit',
      tooltip: 'Click to submit',
      actions: {
        mouseUp: {
          action: ActionType.GoTo,
          destinationPageNumber: 5,
          destinationLocation: {
            x: 100,
            y: 100
          },
          zoomValue: 2
        }
      }
    });

    refreshButtonFields();
  };

  /**
   * Enable designer mode.
   */
  const enableButtonMode = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    viewer.formDesignerModule.setFormFieldMode('ButtonField');
  };

  /**
   * Edit selected button.
   */
  const editButtonField = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    const field = getSelectedField();

    if (!field) {
      return;
    }

    viewer.formDesignerModule.updateFormField(field, {
      value: 'Submit Button',
      text: 'Submit Button',
      alignment: 'Left',
      tooltip: 'Updated Submit Button',
      actions: {
        mouseUp: {
          action: ActionType.GoTo,
          destinationPageNumber: 7,
          destinationLocation: {
            x: 100,
            y: 100
          },
          zoomValue: 1
        }
      }
    });

    refreshButtonFields();
  };

  /**
   * Delete selected button.
   */
  const deleteButtonField = () => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    const field = getSelectedField();

    if (!field) {
      return;
    }

    viewer.formDesignerModule.deleteFormField(field);

    refreshButtonFields();
  };

  useEffect(() => {
    refreshButtonFields();
  }, [refreshButtonFields]);

  return (
    <div className="pdf-viewer-container">
      <div className="control-panel">
        <h3>Add button field programmatically</h3>

        <div className="button-group">
          <button
            id="addButtonField"
            className="primary-btn"
            onClick={addButtonField}
          >
            Add Button Field
          </button>

          <button
            id="enableButtonMode"
            className="secondary-btn"
            onClick={enableButtonMode}
          >
            Enable Button Designer Mode
          </button>
        </div>

        <hr />

        <h4>Edit Existing Button Field</h4>

        <select
          value={selectedFieldId}
          onChange={(e) => setSelectedFieldId(e.target.value)}
          className="field-dropdown"
        >
          {buttonFields.length > 0 ? (
            buttonFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))
          ) : (
            <option value="">No Button Fields Available</option>
          )}
        </select>

        <div className="button-group">
          <button
            id="editButtonField"
            disabled={!selectedFieldId}
            className="primary-btn"
            onClick={editButtonField}
          >
            Edit Button Field
          </button>

          <button
            id="deleteButtonField"
            disabled={!selectedFieldId}
            className="danger-btn"
            onClick={deleteButtonField}
          >
            Delete Button Field
          </button>
        </div>
      </div>

      <PdfViewerComponent
        ref={viewerRef}
        id="container"
        documentPath={documentPath}
        resourceUrl={resourceUrl}
        style={{
          height: '700px'
        }}
        documentLoad={refreshButtonFields}
        formFieldAdd={refreshButtonFields}
        formFieldRemove={refreshButtonFields}
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
            Annotation,
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

const root = ReactDOM.createRoot(
  document.getElementById('sample')
);

root.render(<App />);