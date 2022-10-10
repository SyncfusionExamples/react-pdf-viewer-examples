import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
export class App extends React.Component {
    documentLoad(event) {
        var viewer = document.getElementById('container').ej2_instances[0];
        //Method to add annotation programmatically for initial loading.
        viewer.importAnnotation({
          pdfAnnotation: {
            0: {
              shapeAnnotation: [
                {
                  ShapeAnnotationType: 'Square',
                  Author: 'Guest',
                  AnnotationSelectorSettings: {
                    selectionBorderColor: '',
                    resizerBorderColor: 'black',
                    resizerFillColor: '#FF4081',
                    resizerSize: 8,
                    selectionBorderThickness: 1,
                    resizerShape: 'Square',
                    selectorLineDashArray: [],
                    resizerLocation: 3,
                    resizerCursorType: null,
                  },
                  ModifiedDate: '4/22/2021, 10:33:04 AM',
                  Subject: 'Rectangle',
                  Note: '',
                  IsCommentLock: false,
                  StrokeColor: 'rgba(255,0,0,1)',
                  FillColor: 'rgba(255,255,255,0)',
                  Opacity: 1,
                  Bounds: {
                    X: 124,
                    Y: 76,
                    Width: 202,
                    Height: 154,
                    Location: { X: 124, Y: 76 },
                    Size: { IsEmpty: false, Width: 202, Height: 154 },
                    Left: 124,
                    Top: 76,
                    Right: 326,
                    Bottom: 230,
                  },
                  Thickness: 2,
                  BorderStyle: 'Solid',
                  BorderDashArray: 0,
                  RotateAngle: 'RotateAngle0',
                  IsCloudShape: false,
                  CloudIntensity: 0,
                  RectangleDifference: null,
                  VertexPoints: null,
                  LineHeadStart: null,
                  LineHeadEnd: null,
                  IsLocked: false,
                  AnnotName: 'e9a14dbe-5d09-4226-329e-c6edab201284',
                  Comments: null,
                  State: '',
                  StateModel: '',
                  AnnotType: 'shape',
                  EnableShapeLabel: false,
                  LabelContent: null,
                  LabelFillColor: null,
                  LabelBorderColor: null,
                  FontColor: null,
                  FontSize: 0,
                  CustomData: null,
                  LabelBounds: {
                    X: 0,
                    Y: 0,
                    Width: 0,
                    Height: 0,
                    Location: { X: 0, Y: 0 },
                    Size: { IsEmpty: true, Width: 0, Height: 0 },
                    Left: 0,
                    Top: 0,
                    Right: 0,
                    Bottom: 0,
                  },
                  LabelSettings: null,
                  AnnotationSettings: {
                    minWidth: 0,
                    maxWidth: 0,
                    minHeight: 0,
                    maxHeight: 0,
                    isLock: false,
                    isPrint: true,
                  },
                  AllowedInteractions: ['None'],
                  IsPrint: true,
                  ExistingCustomData: null,
                },
              ],
            },
          },
        });
      }
      
      render() {
        return (
          <div>
            <div className="control-section">
              {/* Render the PDF Viewer */}
              <PdfViewerComponent
                id="container"
                documentPath="PDF_Succinctly.pdf"
                documentLoad={this.documentLoad}
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
                style={{ height: '640px' }}
              >
                {/* Inject the required services */}
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
          </div>
        );
      }
    }
ReactDOM.render(<App />, document.getElementById('sample'));