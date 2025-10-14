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
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';

import {
  createSpinner,
  showSpinner,
  hideSpinner,
} from '@syncfusion/ej2-popups';

function Default() {
  let viewer;

  // Create spinner once component mounts
  React.useEffect(() => {
    createSpinner({
      target: document.getElementById('PDfviewProgress'),
    });
  }, []);

  // Show spinner during download validation
  const show = () => {
    showSpinner(document.getElementById('PDfviewProgress'));
  };

  // Hide spinner after validation completes
  const hide = () => {
    hideSpinner(document.getElementById('PDfviewProgress'));
  };

  // Called when download starts
  const downloadStart = () => {
    show();
  };

  // Called when download ends
  const downloadEnd = () => {
    hide();
  };

  // Custom toolbar button configuration
  var downloadOption = {
    prefixIcon: 'e-pv-download-document-icon e-pv-icon', // Syncfusion icon class
    id: 'download_pdf', // Unique ID for custom button
    tooltipText: 'Download file', // Tooltip shown on hover
    align: 'right', // Aligns button to the right of toolbar
  };

  // Handles toolbar button click events
  const toolbarClick = async (args) => {
    // Check if the clicked item is our custom download button
    if (args.item && args.item.id === 'download_pdf') {
      // Prompt user for confirmation
      const userConfirmed = window.confirm('Do you want to download this PDF?');
      if (!userConfirmed) return;

      // Prepare request payload
      const requestParams = { canDownload: true };

      try {
        // Send request to server to validate download permission
        const response = await fetch('https://localhost:5001/pdfviewer/CheckDownload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestParams),
        });

        // Handle server error
        if (!response.ok) throw new Error('Error validating download');

        // Parse server response
        const result = await response.json();

        // If server allows download, trigger viewer's download method
        if (result) {
          const viewerInstance = document.getElementById('container').ej2_instances[0];
          viewerInstance.download();
        }
      } catch (error) {
        console.error('Download validation failed:', error);
      }
    }
  };

  return (
    <div>
      <div className="control-section">
        <PdfViewerComponent
          ref={(scope) => {
            viewer = scope;
          }}
          id="container"
          downloadStart={downloadStart}
          downloadEnd={downloadEnd}
          serviceUrl="https://localhost:5001/pdfviewer"
          documentPath="https://cdn.syncfusion.com/content/pdf/blazor-annotations.pdf"
          toolbarSettings={{
            showTooltip: true,
            toolbarItems: [
              'OpenOption',
              'PageNavigationTool',
              'MagnificationTool',
              'PanTool',
              'SelectionTool',
              'SearchOption',
              'PrintOption',
              downloadOption, // Inject custom download button
              'UndoRedoTool',
              'AnnotationEditTool',
              'FormDesignerEditTool',
              'CommentTool',
              'SubmitForm',
            ],
          }}
          toolbarClick={toolbarClick}
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
            ]}
          />
        </PdfViewerComponent>
      </div>

      {/* Spinner container */}
      <div id="PDfviewProgress"></div>
    </div>
  );
}

export default Default;

// Render the component
const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
