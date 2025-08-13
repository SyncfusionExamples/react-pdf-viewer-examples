import { createRoot } from 'react-dom/client';
import './index.css';
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
  PageOrganizer,
  Inject,
} from '@syncfusion/ej2-react-pdfviewer';

import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

function Default() {
  const viewerRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const dropDownRef = React.useRef(null);
  const selectionBoundsRef = React.useRef([]);

  const [selectedColor, setSelectedColor] = React.useState('yellow');
  const documentLoad = () => {
    function handleMouseDown(e) {
      if (
        dialogRef.current &&
        !dialogRef.current.visible &&
        selectionBoundsRef.current.length > 0
      ) {
        dialogRef.current.position = {
          X: e.clientX ? e.clientX : e.changedTouches[0].clientX,
          Y: e.clientY ? e.clientY : e.changedTouches[0].clientY,
        };
        dialogRef.current.show();
      } else if (dialogRef.current && dialogRef.current.visible) {
        dialogRef.current.hide();
      }
    }
    const container = document.querySelector('.e-pv-viewer-container');
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
    };
  };
  const changeColor = (e) => {
    setSelectedColor(e.value);
  };
  const colorMap = {
    yellow: 'rgb(255, 255, 153)',
    red: 'rgb(255, 204, 204)',
    green: 'rgb(204, 255, 204)',
    blue: 'rgb(204, 229, 255)',
  };

  const highlightOptions = [
    { text: 'Yellow', value: 'yellow' },
    { text: 'Red', value: 'red' },
    { text: 'Green', value: 'green' },
    { text: 'Blue', value: 'blue' },
  ];
  const content = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <DropDownListComponent
          ref={dropDownRef}
          dataSource={highlightOptions}
          fields={{ text: 'text', value: 'value' }}
          placeholder="Select highlight color"
          value={selectedColor}
          change={changeColor}
          style={{ width: '70%' }}
        />
        <button
          onClick={applyHighlight}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    );
  };
  const dialogClosed = () => {
    selectionBoundsRef.current = [];
  };
  function textSelectionEnd(args) {
    selectionBoundsRef.current = args.textBounds;
  }

  function applyHighlight() {
    const colorKey = dropDownRef.current?.value || selectedColor;
    const highlightColor = colorMap[colorKey];
    const selectionBounds = selectionBoundsRef.current;
    if (selectionBounds && selectionBounds.length > 0) {
      const lineGroups = [];
      const threshold = 2;
      var boundsArray = [];

      selectionBounds.forEach((bound) => {
        const matchedLine = lineGroups.find(
          (group) => Math.abs(group[0].top - bound.top) < threshold
        );
        if (matchedLine) {
          matchedLine.push(bound);
        } else {
          lineGroups.push([bound]);
        }
      });
      var pageIndex = 1;
      lineGroups.forEach((lineBounds) => {
        const x = Math.min(...lineBounds.map((b) => b.left));
        const y = lineBounds[0].top;
        const width = Math.max(...lineBounds.map((b) => b.left + b.width)) - x;
        const height = lineBounds[0].height;
        pageIndex = lineBounds[0].pageIndex;
        boundsArray.push({ x, y, width, height });
      });
      viewerRef.current.annotation.addAnnotation('Highlight', {
        bounds: [...boundsArray],
        pageNumber: pageIndex,
        color: highlightColor,
      });
      if (dialogRef.current) {
        dialogRef.current.hide();
      }
    } else {
      console.warn('No text selection found to add a highlight.');
    }
  }

  return (
    <div>
      <div className="control-section">
        <PdfViewerComponent
          ref={viewerRef}
          id="container"
          documentLoad={documentLoad}
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
          resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
          contextMenuOption="None"
          textSelectionEnd={textSelectionEnd}
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
              FormDesigner,
              PageOrganizer,
            ]}
          />
        </PdfViewerComponent>

        <DialogComponent
          ref={dialogRef}
          width="400px"
          visible={false}
          allowDragging={true}
          close={dialogClosed}
          content={content}
        ></DialogComponent>
      </div>
    </div>
  );
}

export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);
