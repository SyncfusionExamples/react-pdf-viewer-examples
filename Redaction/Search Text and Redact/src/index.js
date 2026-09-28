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

  const px = (pt) => (pt * 96) / 72; // points -> pixels

  const searchTextAndRedact = async () => {
    if (!viewerRef.current) return;
    const term = 'syncfusion';
    const results = await viewerRef.current.textSearchModule.findTextAsync(term, false);
    if (!results || results.length === 0) {
      console.warn('No matches found.');
      return;
    }

    for (const pageResult of results) {
      if (!pageResult?.bounds?.length) continue;
      const pageNumber = (pageResult.pageIndex ?? -1) + 1; // 1-based
      if (pageNumber < 1) continue;

      for (const bound of pageResult.bounds) {
        viewerRef.current.annotation.addAnnotation('Redaction', {
          bound: {
            x: px(bound.x),
            y: px(bound.y),
            width: px(bound.width),
            height: px(bound.height)
          },
          pageNumber,
          overlayText: 'Confidential',
          fillColor: '#00FF40FF',
          fontColor: '#333333',
          fontSize: 12,
          fontFamily: 'Arial',
          markerFillColor: '#FF0000',
          markerBorderColor: '#000000'
        });
      }
    }
  };

  const applyRedaction = () => {
    if (!viewerRef.current) return;
    viewerRef.current.annotation.redact();
  };

  return (
    <div className='content-wrapper'>
      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button id='searchTextRedact' type='button' onClick={searchTextAndRedact}>
          Search "syncfusion" & Mark for Redaction
        </button>
        <button id='applyRedaction' type='button' onClick={applyRedaction}>
          Apply Redaction
        </button>
      </div>

      <PdfViewerComponent
        ref={viewerRef}
        id='container'
        documentPath='https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf'
        resourceUrl='https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib'
        toolbarSettings={toolbarSettings}
        isExtractText={true}
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