import {
  PdfComparerComponent
} from '@syncfusion/ej2-react-pdfviewer';

export default function App() {
  return (
    <PdfComparerComponent id="container" height={'600px'}
      // Specifies the URL (for example, a file from the public folder) or a Base64-encoded PDF.
      originalDocumentPath="https://cdn.syncfusion.com/content/pdf/original-document.pdf"
      modifiedDocumentPath="https://cdn.syncfusion.com/content/pdf/modified-document.pdf"
      // Specifies the path to the PDFium resource files required for the PDF Viewer to function.
      resourceUrl="https://cdn.syncfusion.com/ej2/34.1.29/dist/ej2-pdfviewer-lib" >


    </PdfComparerComponent >
  );
}