import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
         import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

let viewer;
function App() {
  return (<div>
    <div className='control-section'>
    {/* Render the PDF Viewer */}
      <ButtonComponent id="button1" onClick={ApplyRedaction}>Apply Redaction</ButtonComponent>
      <PdfViewerComponent
        ref={(scope) => {
          viewer = scope;
        }}
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        serviceUrl="https://localhost:44396/pdfviewer" 
        rectangleSettings = {{
          fillColor: "white"
        }}
        style={{ 'height': '640px' }}>

         <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                             ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>
      </PdfViewerComponent>
    </div>
  </div>);
}
const ApplyRedaction = () => {
  viewer.serverActionSettings.download = 'ApplyRedaction';
    var data;
    var base64data;
    viewer.saveAsBlob().then(function (value) {
      data = value;
      var reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = function () {
        base64data = reader.result;
        viewer.load(base64data, null);
      };
    });
  viewer.serverActionSettings.download = 'Download';
};
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);