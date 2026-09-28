import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
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
  Inject
} from '@syncfusion/ej2-react-pdfviewer';

export function App() {
  const viewerRef = React.useRef(null);

  const toolbarSettings = {
    toolbarItems: [
      'OpenOption',
      'UndoRedoTool',
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'CommentTool',
      'SubmitForm',
      'AnnotationEditTool',
      'RedactionEditTool',
      'FormDesignerEditTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption'
    ]
  };

  const showRedactionToolbar = () => {
    if (!viewerRef.current) return;
    viewerRef.current.toolbar.showRedactionToolbar(true);
  };

  const hideRedactionToolbar = () => {
    if (!viewerRef.current) return;
    viewerRef.current.toolbar.showRedactionToolbar(false);
  };

  return (
    <div className='content-wrapper'>
      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
        <button type='button' onClick={showRedactionToolbar}>Show Redaction Toolbar</button>
        <button type='button' onClick={hideRedactionToolbar}>Hide Redaction Toolbar</button>
      </div>
      <PdfViewerComponent
        ref={viewerRef}
        id='container'
        resourceUrl='https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib'
        documentPath='https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf'
        toolbarSettings={toolbarSettings}
        style={{ height: '640px', display: 'block' }}
      >
        <Inject services={[
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
        ]} />
      </PdfViewerComponent>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);