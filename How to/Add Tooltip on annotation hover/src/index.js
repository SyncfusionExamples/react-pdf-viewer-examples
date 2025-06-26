import { createRoot } from 'react-dom/client';
import './index.css';
import React, { useEffect, useRef } from 'react';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, 
         BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, 
         FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { Tooltip } from '@syncfusion/ej2-popups';

function Default() {
  let viewer;
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    // Initialize Tooltip
    tooltipRef.current = new Tooltip({
      mouseTrail: true, // Makes tooltip follow the mouse cursor
      opensOn: 'Custom', // Only opens programmatically, not on hover/click
    });
  }, []);
  
  function documentLoaded(args) {
    viewer.annotation.addAnnotation("Rectangle", {
      offset: { x: 150, y: 80 },
      pageNumber: 1,
      width: 150,
      height: 75  
    });   
  } 
  

  //Displays a tooltip showing the author of the annotation
  function annotationMouseOvered(args) {
    if (tooltipRef.current && viewer) {
      tooltipRef.current.appendTo(`#container_pageDiv_${viewer.currentPageNumber - 1}`);
      tooltipRef.current.content = args.annotation.author;
      tooltipRef.current.open();
      const tooltipElement = document.getElementsByClassName('e-tooltip-wrap')[0];
      if (tooltipElement) {
        tooltipElement.style.top = `${args.Y + 100}px`;
        tooltipElement.style.left = `${args.X}px`;
      }
    } 
  }
  
  //Hides the tooltip when mouse leaves the annotation
  function annotationMouseLeaved() {
    if (tooltipRef.current) {
      tooltipRef.current.close();
    }
  }
  
  return (
    <div>
      <div className='control-section'>
        {/* Render the PDF Viewer */}
        <PdfViewerComponent  
          ref={(scope) => { viewer = scope; }} 
          id="container" 
          documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf" 
          resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib" 
          style={{ 'height': '640px' }} 
          annotationMouseover={annotationMouseOvered} 
          annotationMouseLeave={annotationMouseLeaved} 
          documentLoad={documentLoaded}
        >
          <Inject services={[
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
            PageOrganizer
          ]}/>
        </PdfViewerComponent>
      </div> 
    </div>
  ); 
}

export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);