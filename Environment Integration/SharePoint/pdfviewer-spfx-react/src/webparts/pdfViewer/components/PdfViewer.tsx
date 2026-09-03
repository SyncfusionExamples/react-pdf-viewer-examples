import type { IPdfViewerProps } from './IPdfViewerProps';

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
  Inject
} from '@syncfusion/ej2-react-pdfviewer';
export default class PdfViewer extends React.Component<IPdfViewerProps> {

  public render(): React.ReactElement {

    return (
      <PdfViewerComponent
        id="PdfViewer"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://syncfusion.sharepoint.com/sites/syncfusionPdfviewer/SiteAssets/ej2-pdfviewer-lib"
        style={{ height: '800px', width: '100%' }}
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
            FormDesigner
          ]}
        />
      </PdfViewerComponent>
    );
  }
}