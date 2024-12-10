import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    PdfViewerComponent,
    Toolbar,
    Magnification,
    Navigation,
    Annotation,
    TextSelection,
    TextSearch,
    FormFields,
    FormDesigner,
    PageOrganizer,
    Inject
} from '@syncfusion/ej2-react-pdfviewer';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.viewerRef = React.createRef();
    }

    retrievePageInfo = () => {
        // Set the page index for which info is required
        const pageIndex = 0;
        const pdfviewer = this.viewerRef.current;

        if (pdfviewer) {
            // To Retrieve and log the page information
            console.log(pdfviewer.getPageInfo(pageIndex));
            // To Log the specific page information details to the console
            const pageInfo = pdfviewer.getPageInfo(pageIndex);
            if (pageInfo) {
                console.log(`Page Info for Page Index ${pageIndex}:`);
                console.log(`Height: ${pageInfo.height}`);
                console.log(`Width: ${pageInfo.width}`);
                console.log(`Rotation: ${pageInfo.rotation}`);
            } 
        } 
    }

    render() {
        return (
            <div>
                <div className='control-section' style={{ marginTop: '50px' }}>
                <button onClick={this.retrievePageInfo} style={{ marginTop: '20px' }}>
                GetPageInfo
                </button>
                    <PdfViewerComponent
                        ref={this.viewerRef}
                        id="PdfViewer"
                        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
                        resourceUrl= "https://cdn.syncfusion.com/ej2/27.2.2/dist/ej2-pdfviewer-lib"
                        style={{ height: '640px' }}
                    >
                        <Inject services={[
                            Toolbar,
                            Magnification,
                            Navigation,
                            Annotation,
                            TextSelection,
                            TextSearch,
                            FormFields,
                            FormDesigner,
                            PageOrganizer
                        ]} />
                    </PdfViewerComponent>
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);
