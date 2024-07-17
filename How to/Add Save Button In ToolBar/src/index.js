import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import  { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
import { ComboBox } from "@syncfusion/ej2-dropdowns";
import { TextBox } from "@syncfusion/ej2-inputs";           

export function App() {

// Add OnCreateSearch outside the App function
function OnCreateSearch() {
  this.addIcon('prepend', 'e-icons e-search');
}

var toolItem1  = {
    prefixIcon: 'e-icons e-save',
    id: 'download',
    text: 'Save',
    tooltipText: 'Save Button',
    align: 'Left'
};

  function toolbarClick(args){
    var viewer = document.getElementById('container').ej2_instances[0];
    if (args.item && args.item.id === 'download') {
        viewer.download();
    }
  };
return (<div>
    <div className='control-section'>
        <PdfViewerComponent 
            id="container" 
            documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
            resourceUrl="https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"
            toolbarSettings={{ showTooltip : true, toolbarItems: ['OpenOption', toolItem1, 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'PrintOption', 'UndoRedoTool', 'AnnotationEditTool', 'FormDesignerEditTool', 'CommentTool', 'SubmitForm']}}
            toolbarClick={toolbarClick}
            style={{ 'height': '640px' }}>
               {/* Inject the required services */}
               <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                                   Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
        </PdfViewerComponent>
    </div>
</div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);