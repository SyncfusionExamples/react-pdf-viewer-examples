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
  PageOrganizer,
  BorderStyle,
  Inject
} from '@syncfusion/ej2-react-pdfviewer';
import './App.css';

export default function App() {
  return (
    <div>
      <div className="toolbar-actions">
        <div className="action-group">
          <h4>Set annotation mode for newly added annotations</h4>
          <button onClick={enableRectangleMode}>Rectangle</button>
          <button onClick={enableCircleMode}>Circle</button>
          <button onClick={enablePolygonMode}>Polygon</button>
          <button onClick={enableCloudMode}>Cloud</button>
          <button onClick={enableFreeTextMode}>Free Text</button>
          <button onClick={enableAreaMode}>Area</button>
          <button onClick={enableLineMode}>Line</button>
        </div>

        <div className="action-group">
          <h4>Exit annotation mode</h4>
          <button onClick={exitAnnotationMode}>Exit Annotation Mode</button>
        </div>

        <div className="action-group">
          <h4>Add annotations programmatically</h4>
          <button onClick={addCloudRectangle}>Cloud Rectangle</button>
          <button onClick={addDashedCircle}>Dashed Circle</button>
          <button onClick={addCloudFreeText}>Cloud Free Text</button>
          <button onClick={addDashedLine}>Dashed Line</button>
          <button onClick={addCloudArea}>Cloud Area</button>
          <button onClick={addDashedRadius}>Dashed Radius</button>
        </div>

        <div className="action-group">
          <h4>Modify existing annotation border</h4>
          <button onClick={applyCloudBorderToSelected}>Apply Cloud Border</button>
          <button onClick={applyDashedBorderToSelected}>Apply Dashed Border</button>
          <button onClick={resetBorderOfSelected}>Reset To Solid</button>
        </div>
      </div>

      <PdfViewerComponent
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
        rectangleSettings={{
          strokeColor: '#d32f2f',
          fillColor: '#ffe0b2',
          borderStyle: BorderStyle.Cloud,
          cloudIntensity: 2
        }}
        circleSettings={{
          strokeColor: '#1976d2',
          fillColor: '#bbdefb',
          borderStyle: BorderStyle.Dashed,
          borderDashArray: [5, 5]
        }}
        freeTextSettings={{
          fillColor: '#e8f5e9',
          borderColor: '#2e7d32',
          fontColor: '#1b5e20',
          opacity: 0.3,
          enableAutoFit: true,
          borderStyle: BorderStyle.Cloud,
          cloudIntensity: 2
        }}
        cloudSettings={{
          opacity: 1,
          strokeColor: '#9c27b0',
          fillColor: '#f3e5f5',
          author: 'Cloud',
          borderStyle: BorderStyle.Cloud,
          cloudIntensity: 2
        }}
        lineSettings={{
          strokeColor: '#f57c00',
          borderStyle: BorderStyle.Dashed,
          borderDashArray: [4, 3]
        }}
        style={{ height: '650px' }}
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
          FormDesigner,
          PageOrganizer
        ]} />
      </PdfViewerComponent>
    </div>
  );
}

function getViewer() {
  return document.getElementById('container').ej2_instances[0];
}

// --- Set the mode used for newly added annotations ---

function enableRectangleMode() {
  getViewer().annotation.setAnnotationMode('Rectangle');
}

function enableCircleMode() {
  getViewer().annotation.setAnnotationMode('Circle');
}

function enablePolygonMode() {
  getViewer().annotation.setAnnotationMode('Polygon');
}

function enableCloudMode() {
  getViewer().annotation.setAnnotationMode('Cloud');
}

function enableFreeTextMode() {
  getViewer().annotation.setAnnotationMode('FreeText');
}

function enableAreaMode() {
  getViewer().annotation.setAnnotationMode('Area');
}

function enableLineMode() {
  getViewer().annotation.setAnnotationMode('Line');
}

// --- Exit the annotation mode ---

function exitAnnotationMode() {
  getViewer().annotation.setAnnotationMode('None');
}

// --- Add annotations programmatically with cloud/dashed borders ---

function addCloudRectangle() {
  getViewer().annotation.addAnnotation('Rectangle', {
    offset: { x: 90, y: 120 },
    pageNumber: 0,
    width: 220,
    height: 110,
    borderStyle: BorderStyle.Cloud,
    cloudIntensity: 2,
    strokeColor: '#d32f2f',
    fillColor: '#ffe0b2',
    opacity: 0.4,
    author: 'Guest'
  });
}

function addDashedCircle() {
  getViewer().annotation.addAnnotation('Circle', {
    offset: { x: 360, y: 120 },
    pageNumber: 0,
    width: 140,
    height: 140,
    borderStyle: BorderStyle.Dashed,
    borderDashArray: [5, 5],
    strokeColor: '#1976d2',
    fillColor: '#bbdefb',
    opacity: 0.4,
    author: 'Guest'
  });
}

function addCloudFreeText() {
  getViewer().annotation.addAnnotation('FreeText', {
    offset: { x: 90, y: 300 },
    pageNumber: 0,
    width: 220,
    height: 70,
    borderStyle: BorderStyle.Cloud,
    cloudIntensity: 1,
    borderColor: '#2e7d32',
    fillColor: '#e8f5e9',
    fontColor: '#1b5e20',
    opacity: 0.3,
    author: 'Guest'
  });
}

function addDashedLine() {
  getViewer().annotation.addAnnotation('Line', {
    offset: { x: 360, y: 330 },
    pageNumber: 0,
    points: [{ x: 360, y: 330 }, { x: 500, y: 400 }],
    borderStyle: BorderStyle.Dashed,
    borderDashArray: [4, 3],
    strokeColor: '#f57c00',
    opacity: 1,
    author: 'Guest'
  });
}

function addCloudArea() {
  getViewer().annotation.addAnnotation('Area', {
    offset: { x: 90, y: 430 },
    pageNumber: 0,
    vertexPoints: [
      { x: 90, y: 430 },
      { x: 300, y: 430 },
      { x: 300, y: 520 },
      { x: 90, y: 520 }
    ],
    borderStyle: BorderStyle.Cloud,
    cloudIntensity: 2,
    strokeColor: '#c2185b',
    fillColor: '#fce4ec',
    opacity: 0.4,
    author: 'Guest'
  });
}

function addDashedRadius() {
  getViewer().annotation.addAnnotation('Radius', {
    offset: { x: 380, y: 470 },
    pageNumber: 0,
    points: [{ x: 380, y: 470 }, { x: 470, y: 470 }],
    borderStyle: BorderStyle.Dashed,
    borderDashArray: [6, 3],
    strokeColor: '#00838f',
    opacity: 1,
    author: 'Guest'
  });
}

// --- Modify the border style of the currently selected annotation ---

function updateSelectedBorder(borderStyle, extra) {
  const viewer = getViewer();
  const annotation = viewer.getSelectedAnnotation?.();

  if (annotation) {
    viewer.annotation.editAnnotation(annotation, { borderStyle, ...extra });
  }
}

function applyCloudBorderToSelected() {
  updateSelectedBorder(BorderStyle.Cloud, { cloudIntensity: 2 });
}

function applyDashedBorderToSelected() {
  updateSelectedBorder(BorderStyle.Dashed, { borderDashArray: [5, 5] });
}

function resetBorderOfSelected() {
  updateSelectedBorder(BorderStyle.Solid, { borderDashArray: null, cloudIntensity: 1 });
}