import React from 'react';
import ReactDOM from 'react-dom/client';
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

    // Function to get Base64 of the loaded document
    base64ofloadedDocument = () => {
        this.viewerRef.current.saveAsBlob().then((blobData) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64data = reader.result;
                console.log(base64data);
            };
            reader.readAsDataURL(blobData);
        });
    };

    render() {
        return (
            <div>
                <div className='control-section' style={{ marginTop: '50px' }}>
                <button onClick={this.base64ofloadedDocument} style={{ marginTop: '20px' }}>
                    Get Base64
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