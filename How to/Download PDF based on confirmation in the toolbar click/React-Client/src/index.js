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

  React.useEffect(() => {
    createSpinner({
      target: document.getElementById('PDfviewProgress'),
    });
  }, []);

  const show = () => {
    showSpinner(document.getElementById('PDfviewProgress'));
  };

  const hide = () => {
    hideSpinner(document.getElementById('PDfviewProgress'));
  };

  const downloadStart = () => {
    show();
  };

  const downloadEnd = () => {
    hide();
  };

  var downloadOption = {
    prefixIcon: 'e-pv-download-document-icon e-pv-icon',
    id: 'download_pdf',
    tooltipText: 'Download file',
    align: 'right',
  };

  const toolbarClick = async (args) => {
  if (args.item && args.item.id === 'download_pdf') {
    const userConfirmed = window.confirm('Do you want to download this PDF?');
    if (!userConfirmed) return;

    const requestParams = { canDownload: true };
    try {
      const response = await fetch('https://localhost:5001/pdfviewer/CheckDownload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParams),
      });

      if (!response.ok) throw new Error('Error validating download');

      const result = await response.json();
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
      {/* PDF Viewer Component */}
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
              downloadOption,
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

      {/* Spinner container below the PDF Viewer */}
      <div id="PDfviewProgress"></div>
    </div>
  );
}

export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
